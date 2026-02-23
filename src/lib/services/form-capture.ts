import { getDb } from '@/lib/db';
import { logger } from '@/lib/utils/logger';
import { FORM_FIELD_HEURISTICS } from '@/lib/utils/constants';
import { getActiveFieldMappings } from '@/lib/services/field-mapper';
import { upsertHubSpotContactByEmail } from '@/lib/services/hubspot-contacts';
import { WixFormSubmission } from '@/types/wix';

/**
 * Extract UTM parameters from a page URL.
 */
export function extractUTMParams(pageUrl: string | undefined): Record<string, string> {
  if (!pageUrl) return {};

  try {
    const url = new URL(pageUrl);
    const params: Record<string, string> = {};
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

    for (const key of utmKeys) {
      const value = url.searchParams.get(key);
      if (value) params[key] = value;
    }

    return params;
  } catch {
    return {};
  }
}

/**
 * Heuristically match a form field name to a HubSpot property.
 */
export function heuristicMatchField(fieldName: string): string | null {
  const normalized = fieldName.toLowerCase().trim();
  return FORM_FIELD_HEURISTICS[normalized] || null;
}

/**
 * Process a Wix form submission and push it to HubSpot.
 */
export async function processFormSubmission(
  instanceId: string,
  formData: WixFormSubmission,
): Promise<{ contactId: string } | null> {
  const db = await getDb();

  // Check HubSpot is connected
  const installation = await db.collection('installations').findOne({
    wixInstanceId: instanceId,
    hubspotAccessToken: { $ne: null },
  });

  if (!installation) {
    logger.warn('Form capture skipped: HubSpot not connected', { instanceId });
    return null;
  }

  // Build HubSpot properties from form fields
  const properties: Record<string, string> = {};

  // Get existing field mappings for hinting
  const fieldMappings = await getActiveFieldMappings(instanceId, 'wix_to_hubspot');
  const mappingByWixField = new Map(fieldMappings.map((m) => [m.wixFieldLabel.toLowerCase(), m.hubspotProperty]));

  // Map form submissions to HubSpot properties
  for (const [fieldName, fieldValue] of Object.entries(formData.submissions)) {
    if (!fieldValue) continue;

    // Strategy 1: Check if user has a mapping matching this field label
    const mappedProp = mappingByWixField.get(fieldName.toLowerCase());
    if (mappedProp) {
      properties[mappedProp] = fieldValue;
      continue;
    }

    // Strategy 2: Heuristic matching
    const heuristicProp = heuristicMatchField(fieldName);
    if (heuristicProp) {
      properties[heuristicProp] = fieldValue;
      continue;
    }

    // Strategy 3: Log unmapped fields for debugging
    logger.debug('Unmapped form field', { instanceId, fieldName, fieldValue });
  }

  // Extract UTM parameters from the page URL
  const utmParams = extractUTMParams(formData.pageUrl);
  for (const [key, value] of Object.entries(utmParams)) {
    properties[key] = value;
  }

  // Ensure we have at least an email to create a contact
  if (!properties.email) {
    logger.warn('Form submission missing email field', {
      instanceId,
      formId: formData.formId,
      fields: Object.keys(formData.submissions),
    });
    return null;
  }

  // Upsert the contact in HubSpot
  try {
    const contactId = await upsertHubSpotContactByEmail(instanceId, properties);

    // Record the contact mapping if we have a Wix contact ID
    if (formData.submitter?.contactId) {
      await db.collection('contact_mappings').updateOne(
        { wixInstanceId: instanceId, wixContactId: formData.submitter.contactId },
        {
          $set: {
            hubspotContactId: contactId,
            email: properties.email,
            lastSyncedAt: new Date(),
            lastSyncDirection: 'wix_to_hubspot' as const,
            lastSyncSource: 'form' as const,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            wixInstanceId: instanceId,
            wixContactId: formData.submitter.contactId,
            createdAt: new Date(),
          },
        },
        { upsert: true },
      );
    }

    logger.info('Form submission synced to HubSpot', {
      instanceId,
      formId: formData.formId,
      contactId,
      utmParams,
    });

    return { contactId };
  } catch (err) {
    logger.error('Failed to sync form submission to HubSpot', {
      instanceId,
      formId: formData.formId,
      error: String(err),
    });

    // Log sync error
    await db.collection('sync_errors').insertOne({
      wixInstanceId: instanceId,
      direction: 'wix_to_hubspot',
      errorType: 'non_retryable',
      errorMessage: String(err),
      sourceData: { formData, properties },
      retryCount: 0,
      maxRetries: 0,
      resolvedAt: null,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return null;
  }
}
