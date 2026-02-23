import { getHubSpotClient } from '@/lib/services/hubspot-auth';
import { FilterOperatorEnum } from '@hubspot/api-client/lib/codegen/crm/contacts/models/Filter';
import { logger } from '@/lib/utils/logger';
import { HubSpotContact, HubSpotProperty } from '@/types/hubspot';

export async function getHubSpotContact(
  instanceId: string,
  contactId: string,
  properties?: string[],
): Promise<HubSpotContact | null> {
  try {
    const client = await getHubSpotClient(instanceId);
    const response = await client.crm.contacts.basicApi.getById(
      contactId,
      properties || ['firstname', 'lastname', 'email', 'phone', 'company', 'jobtitle'],
    );
    return {
      id: response.id,
      properties: response.properties as Record<string, string>,
      createdAt: response.createdAt.toISOString(),
      updatedAt: response.updatedAt.toISOString(),
      archived: response.archived || false,
    };
  } catch (err) {
    logger.error('Failed to get HubSpot contact', { instanceId, contactId, error: String(err) });
    return null;
  }
}

export async function createHubSpotContact(
  instanceId: string,
  properties: Record<string, string>,
): Promise<HubSpotContact | null> {
  try {
    const client = await getHubSpotClient(instanceId);
    const response = await client.crm.contacts.basicApi.create({
      properties,
      associations: [],
    });
    return {
      id: response.id,
      properties: response.properties as Record<string, string>,
      createdAt: response.createdAt.toISOString(),
      updatedAt: response.updatedAt.toISOString(),
      archived: response.archived || false,
    };
  } catch (err) {
    logger.error('Failed to create HubSpot contact', { instanceId, error: String(err) });
    throw err;
  }
}

export async function updateHubSpotContact(
  instanceId: string,
  contactId: string,
  properties: Record<string, string>,
): Promise<HubSpotContact | null> {
  try {
    const client = await getHubSpotClient(instanceId);
    const response = await client.crm.contacts.basicApi.update(contactId, {
      properties,
    });
    return {
      id: response.id,
      properties: response.properties as Record<string, string>,
      createdAt: response.createdAt.toISOString(),
      updatedAt: response.updatedAt.toISOString(),
      archived: response.archived || false,
    };
  } catch (err) {
    logger.error('Failed to update HubSpot contact', { instanceId, contactId, error: String(err) });
    throw err;
  }
}

export async function upsertHubSpotContactByEmail(
  instanceId: string,
  properties: Record<string, string>,
): Promise<string> {
  const email = properties.email;
  if (!email) throw new Error('Email is required for HubSpot contact upsert');

  try {
    // Try to find existing contact by email
    const existing = await searchHubSpotContactByEmail(instanceId, email);

    if (existing) {
      const updated = await updateHubSpotContact(instanceId, existing.id, properties);
      return updated?.id || existing.id;
    }

    // Create new contact
    const created = await createHubSpotContact(instanceId, properties);
    if (!created) throw new Error('Failed to create HubSpot contact');
    return created.id;
  } catch (err: unknown) {
    const error = err as { code?: number; status?: number; body?: { message?: string } };
    // Handle 409 conflict (contact exists)
    if (error.code === 409 || error.status === 409) {
      const existingIdMatch = error.body?.message?.match(/Existing ID:\s*(\d+)/);
      if (existingIdMatch) {
        const existingId = existingIdMatch[1];
        const updated = await updateHubSpotContact(instanceId, existingId, properties);
        return updated?.id || existingId;
      }
    }
    throw err;
  }
}

export async function searchHubSpotContactByEmail(
  instanceId: string,
  email: string,
): Promise<HubSpotContact | null> {
  try {
    const client = await getHubSpotClient(instanceId);
    const response = await client.crm.contacts.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: FilterOperatorEnum.Eq,
              value: email,
            },
          ],
        },
      ],
      properties: ['firstname', 'lastname', 'email', 'phone', 'company', 'jobtitle', 'lastmodifieddate'],
      limit: 1,
      after: '0',
      sorts: [],
    });

    const contact = response.results?.[0];
    if (!contact) return null;

    return {
      id: contact.id,
      properties: contact.properties as Record<string, string>,
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
      archived: contact.archived || false,
    };
  } catch (err) {
    logger.error('Failed to search HubSpot contact by email', { instanceId, email, error: String(err) });
    return null;
  }
}

export async function listHubSpotContactProperties(
  instanceId: string,
): Promise<HubSpotProperty[]> {
  try {
    const client = await getHubSpotClient(instanceId);
    const response = await client.crm.properties.coreApi.getAll('contacts');

    return response.results
      .filter((p) => !p.hidden && p.formField !== false)
      .map((p) => ({
        name: p.name,
        label: p.label,
        type: p.type,
        fieldType: p.fieldType,
        description: p.description || '',
        groupName: p.groupName,
        options: p.options?.map((o) => ({ label: o.label, value: o.value })) || [],
        hidden: p.hidden || false,
        formField: p.formField ?? true,
      }));
  } catch (err) {
    logger.error('Failed to list HubSpot properties', { instanceId, error: String(err) });
    return [];
  }
}
