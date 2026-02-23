import { getDb } from '@/lib/db';
import { logger } from '@/lib/utils/logger';
import { LOOP_PREVENTION_WINDOW_MS, EVENT_TTL_MS, SYNC_ERROR_TTL_MS } from '@/lib/utils/constants';
import { SyncResult } from '@/types/sync';
import { WixContact } from '@/types/wix';
import { HubSpotContact, HubSpotWebhookEvent } from '@/types/hubspot';
import {
  mapWixToHubSpot,
  mapHubSpotToWix,
  getActiveFieldMappings,
  isDataIdentical,
} from '@/lib/services/field-mapper';
import {
  getHubSpotContact,
  upsertHubSpotContactByEmail,
  updateHubSpotContact as updateHS,
  searchHubSpotContactByEmail,
} from '@/lib/services/hubspot-contacts';
import {
  getWixContact,
  createWixContact,
  updateWixContact,
  findWixContactByEmail,
} from '@/lib/services/wix-contacts';

// ─── Event Dedup (Layer 1) ───

export async function isEventProcessed(eventId: string): Promise<boolean> {
  const db = await getDb();
  const existing = await db.collection('processed_events').findOne({ eventId });
  return !!existing;
}

export async function markEventProcessed(
  eventId: string,
  source: 'wix' | 'hubspot',
  eventType?: string,
): Promise<void> {
  const db = await getDb();
  try {
    await db.collection('processed_events').insertOne({
      eventId,
      source,
      eventType,
      processedAt: new Date(),
      expiresAt: new Date(Date.now() + EVENT_TTL_MS),
    });
  } catch {
    // Duplicate key error is expected if event was already recorded
  }
}

// ─── Sync Error Logging ───

export async function logSyncError(
  instanceId: string,
  direction: 'wix_to_hubspot' | 'hubspot_to_wix',
  error: unknown,
  sourceData: Record<string, unknown>,
): Promise<void> {
  const db = await getDb();
  const errMessage = error instanceof Error ? error.message : String(error);
  const errStack = error instanceof Error ? error.stack : null;

  await db.collection('sync_errors').insertOne({
    wixInstanceId: instanceId,
    direction,
    errorType: isRetryableError(error) ? 'retryable' : 'non_retryable',
    errorMessage: errMessage,
    errorStack: errStack,
    sourceData,
    retryCount: 0,
    maxRetries: 3,
    resolvedAt: null,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SYNC_ERROR_TTL_MS),
  });

  logger.error('Sync error recorded', { instanceId, direction, error: errMessage });
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes('timeout') || msg.includes('rate limit') || msg.includes('429')
      || msg.includes('503') || msg.includes('502') || msg.includes('504');
  }
  return false;
}

// ─── Wix → HubSpot Sync ───

export async function syncWixToHubSpot(
  instanceId: string,
  wixContact: WixContact,
  eventId: string,
): Promise<SyncResult> {
  const db = await getDb();

  // Layer 1: Event dedup
  if (await isEventProcessed(eventId)) {
    return { status: 'skipped', reason: 'duplicate_event' };
  }

  // Mark event as processed immediately
  await markEventProcessed(eventId, 'wix', 'contact.sync');

  // Layer 2: Timestamp check — prevent echo loops
  const mapping = await db.collection('contact_mappings').findOne({
    wixInstanceId: instanceId,
    wixContactId: wixContact.id,
  });

  if (mapping && mapping.lastSyncDirection === 'hubspot_to_wix') {
    const timeSinceLastSync = Date.now() - new Date(mapping.lastSyncedAt).getTime();
    if (timeSinceLastSync < LOOP_PREVENTION_WINDOW_MS) {
      logger.info('Loop prevented (timestamp)', { instanceId, contactId: wixContact.id });
      return { status: 'skipped', reason: 'recent_reverse_sync' };
    }
  }

  // Get field mappings
  const fieldMappings = await getActiveFieldMappings(instanceId, 'wix_to_hubspot');
  if (fieldMappings.length === 0) {
    return { status: 'skipped', reason: 'no_active_mappings' };
  }

  // Transform Wix → HubSpot properties
  const hubspotProperties = mapWixToHubSpot(wixContact, fieldMappings);
  if (Object.keys(hubspotProperties).length === 0) {
    return { status: 'skipped', reason: 'no_mapped_fields' };
  }

  // Layer 3: Data change detection
  if (mapping?.hubspotContactId) {
    const currentHS = await getHubSpotContact(instanceId, mapping.hubspotContactId);
    if (currentHS && isDataIdentical(hubspotProperties, currentHS.properties)) {
      logger.info('Loop prevented (identical data)', { instanceId, contactId: wixContact.id });
      return { status: 'skipped', reason: 'no_changes' };
    }
  }

  // Perform the upsert
  let hubspotContactId: string;
  try {
    if (mapping?.hubspotContactId) {
      const updated = await updateHS(instanceId, mapping.hubspotContactId, hubspotProperties);
      hubspotContactId = updated?.id || mapping.hubspotContactId;
    } else {
      hubspotContactId = await upsertHubSpotContactByEmail(instanceId, hubspotProperties);
    }
  } catch (err) {
    await logSyncError(instanceId, 'wix_to_hubspot', err, {
      wixContactId: wixContact.id,
      properties: hubspotProperties,
    });
    return { status: 'error', error: String(err) };
  }

  // Record contact mapping
  const email = wixContact.primaryInfo?.email || hubspotProperties.email || null;
  await db.collection('contact_mappings').updateOne(
    { wixInstanceId: instanceId, wixContactId: wixContact.id },
    {
      $set: {
        hubspotContactId,
        email,
        lastSyncedAt: new Date(),
        lastSyncDirection: 'wix_to_hubspot' as const,
        lastSyncSource: 'webhook' as const,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        wixInstanceId: instanceId,
        wixContactId: wixContact.id,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  // Mark echo suppression for the resulting HubSpot webhook
  const echoBucket = Math.floor(Date.now() / 5000);
  await markEventProcessed(`hs-echo-${hubspotContactId}-${echoBucket}`, 'hubspot');

  logger.info('Synced Wix → HubSpot', {
    instanceId,
    wixContactId: wixContact.id,
    hubspotContactId,
  });

  return {
    status: 'success',
    sourceContactId: wixContact.id,
    targetContactId: hubspotContactId,
  };
}

// ─── HubSpot → Wix Sync ───

export async function syncHubSpotToWix(
  instanceId: string,
  hubspotContactId: string,
  eventId: string,
): Promise<SyncResult> {
  const db = await getDb();

  // Layer 1: Event dedup
  if (await isEventProcessed(eventId)) {
    return { status: 'skipped', reason: 'duplicate_event' };
  }

  // Echo suppression — check if this was caused by our own Wix → HubSpot sync
  const echoBucket = Math.floor(Date.now() / 5000);
  const echoId = `hs-echo-${hubspotContactId}-${echoBucket}`;
  if (await isEventProcessed(echoId)) {
    await markEventProcessed(eventId, 'hubspot', 'contact.echo_suppressed');
    return { status: 'skipped', reason: 'echo_suppressed' };
  }

  // Also check adjacent time bucket
  const prevEchoBucket = echoBucket - 1;
  const prevEchoId = `hs-echo-${hubspotContactId}-${prevEchoBucket}`;
  if (await isEventProcessed(prevEchoId)) {
    await markEventProcessed(eventId, 'hubspot', 'contact.echo_suppressed');
    return { status: 'skipped', reason: 'echo_suppressed' };
  }

  await markEventProcessed(eventId, 'hubspot', 'contact.sync');

  // Layer 2: Timestamp check
  const mapping = await db.collection('contact_mappings').findOne({
    wixInstanceId: instanceId,
    hubspotContactId,
  });

  if (mapping && mapping.lastSyncDirection === 'wix_to_hubspot') {
    const timeSinceLastSync = Date.now() - new Date(mapping.lastSyncedAt).getTime();
    if (timeSinceLastSync < LOOP_PREVENTION_WINDOW_MS) {
      logger.info('Loop prevented (timestamp)', { instanceId, hubspotContactId });
      return { status: 'skipped', reason: 'recent_reverse_sync' };
    }
  }

  // Fetch full HubSpot contact
  const fieldMappings = await getActiveFieldMappings(instanceId, 'hubspot_to_wix');
  if (fieldMappings.length === 0) {
    return { status: 'skipped', reason: 'no_active_mappings' };
  }

  const hsProperties = fieldMappings.map((m) => m.hubspotProperty);
  const hubspotContact = await getHubSpotContact(instanceId, hubspotContactId, hsProperties);
  if (!hubspotContact) {
    return { status: 'error', error: 'HubSpot contact not found' };
  }

  // Transform HubSpot → Wix data
  const wixData = mapHubSpotToWix(hubspotContact, fieldMappings);
  if (Object.keys(wixData).length === 0) {
    return { status: 'skipped', reason: 'no_mapped_fields' };
  }

  // Create or update in Wix
  let wixContactId: string;
  try {
    if (mapping?.wixContactId) {
      // Update existing Wix contact
      const existingWix = await getWixContact(instanceId, mapping.wixContactId);
      if (existingWix) {
        await updateWixContact(instanceId, mapping.wixContactId, existingWix.revision, wixData);
        wixContactId = mapping.wixContactId;
      } else {
        // Contact was deleted in Wix, recreate
        const email = hubspotContact.properties.email;
        const newContact = await createWixContact(instanceId, {
          name: {
            first: (wixData.info as Record<string, unknown>)?.name
              ? ((wixData.info as Record<string, unknown>).name as Record<string, string>)?.first
              : undefined,
            last: (wixData.info as Record<string, unknown>)?.name
              ? ((wixData.info as Record<string, unknown>).name as Record<string, string>)?.last
              : undefined,
          },
          emails: email ? [{ email, tag: 'MAIN' }] : undefined,
          company: (wixData.info as Record<string, unknown>)?.company as string | undefined,
          jobTitle: (wixData.info as Record<string, unknown>)?.jobTitle as string | undefined,
        });
        if (!newContact) throw new Error('Failed to create Wix contact');
        wixContactId = newContact.id;
      }
    } else {
      // Find by email or create new
      const email = hubspotContact.properties.email;
      let existingWix: WixContact | null = null;

      if (email) {
        existingWix = await findWixContactByEmail(instanceId, email);
      }

      if (existingWix) {
        await updateWixContact(instanceId, existingWix.id, existingWix.revision, wixData);
        wixContactId = existingWix.id;
      } else {
        const newContact = await createWixContact(instanceId, {
          name: {
            first: (wixData.info as Record<string, unknown>)?.name
              ? ((wixData.info as Record<string, unknown>).name as Record<string, string>)?.first
              : undefined,
            last: (wixData.info as Record<string, unknown>)?.name
              ? ((wixData.info as Record<string, unknown>).name as Record<string, string>)?.last
              : undefined,
          },
          emails: email ? [{ email, tag: 'MAIN' }] : undefined,
          company: (wixData.info as Record<string, unknown>)?.company as string | undefined,
          jobTitle: (wixData.info as Record<string, unknown>)?.jobTitle as string | undefined,
        });
        if (!newContact) throw new Error('Failed to create Wix contact');
        wixContactId = newContact.id;
      }
    }
  } catch (err) {
    await logSyncError(instanceId, 'hubspot_to_wix', err, {
      hubspotContactId,
      properties: hubspotContact.properties,
    });
    return { status: 'error', error: String(err) };
  }

  // Record contact mapping
  await db.collection('contact_mappings').updateOne(
    { wixInstanceId: instanceId, hubspotContactId },
    {
      $set: {
        wixContactId,
        email: hubspotContact.properties.email || null,
        lastSyncedAt: new Date(),
        lastSyncDirection: 'hubspot_to_wix' as const,
        lastSyncSource: 'webhook' as const,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        wixInstanceId: instanceId,
        hubspotContactId,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  // Mark echo suppression for the resulting Wix webhook
  const wixEchoBucket = Math.floor(Date.now() / 5000);
  await markEventProcessed(`wix-echo-${wixContactId}-${wixEchoBucket}`, 'wix');

  logger.info('Synced HubSpot → Wix', {
    instanceId,
    hubspotContactId,
    wixContactId,
  });

  return {
    status: 'success',
    sourceContactId: hubspotContactId,
    targetContactId: wixContactId,
  };
}

// ─── Process Webhook Events ───

export async function processWixContactEvent(
  instanceId: string,
  contactId: string,
  eventType: string,
): Promise<SyncResult> {
  // Check if HubSpot is connected
  const db = await getDb();
  const installation = await db.collection('installations').findOne({
    wixInstanceId: instanceId,
    hubspotAccessToken: { $ne: null },
    syncEnabled: true,
  });

  if (!installation) {
    return { status: 'skipped', reason: 'hubspot_not_connected' };
  }

  // Fetch the Wix contact
  const wixContact = await getWixContact(instanceId, contactId);
  if (!wixContact) {
    return { status: 'error', error: 'Wix contact not found' };
  }

  // Check echo suppression for Wix
  const echoBucket = Math.floor(Date.now() / 5000);
  const echoId = `wix-echo-${contactId}-${echoBucket}`;
  if (await isEventProcessed(echoId)) {
    return { status: 'skipped', reason: 'echo_suppressed' };
  }
  const prevEchoId = `wix-echo-${contactId}-${echoBucket - 1}`;
  if (await isEventProcessed(prevEchoId)) {
    return { status: 'skipped', reason: 'echo_suppressed' };
  }

  const eventId = `wix-${contactId}-${eventType}-${Date.now()}`;
  return syncWixToHubSpot(instanceId, wixContact, eventId);
}

export async function processHubSpotContactEvent(
  event: HubSpotWebhookEvent,
): Promise<SyncResult> {
  const db = await getDb();
  const hubspotContactId = event.objectId.toString();

  // Find the installation by HubSpot portal ID
  const installation = await db.collection('installations').findOne({
    hubspotPortalId: event.portalId.toString(),
    syncEnabled: true,
    isActive: true,
  });

  if (!installation) {
    return { status: 'skipped', reason: 'installation_not_found' };
  }

  const instanceId = installation.wixInstanceId;
  const eventId = `hs-${event.eventId}`;

  return syncHubSpotToWix(instanceId, hubspotContactId, eventId);
}
