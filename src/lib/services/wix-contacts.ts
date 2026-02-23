import { getWixAccessToken } from '@/lib/services/wix-auth';
import { logger } from '@/lib/utils/logger';
import { WIX_API_BASE } from '@/lib/utils/constants';
import { WixContact, WixContactField } from '@/types/wix';

async function wixApiRequest(
  instanceId: string,
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const accessToken = await getWixAccessToken(instanceId);
  const url = `${WIX_API_BASE}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
      'wix-site-id': instanceId,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('Wix API request failed', { path, status: response.status, error: errorText });
    throw new Error(`Wix API error ${response.status}: ${errorText}`);
  }

  return response;
}

export async function getWixContact(
  instanceId: string,
  contactId: string,
): Promise<WixContact | null> {
  try {
    const response = await wixApiRequest(
      instanceId,
      `/contacts/v4/contacts/${contactId}`,
    );
    const data = await response.json();
    return data.contact || data;
  } catch (err) {
    logger.error('Failed to get Wix contact', { instanceId, contactId, error: String(err) });
    return null;
  }
}

export async function createWixContact(
  instanceId: string,
  contactData: {
    name?: { first?: string; last?: string };
    emails?: { email: string; tag?: string }[];
    phones?: { phone: string; tag?: string }[];
    company?: string;
    jobTitle?: string;
  },
): Promise<WixContact | null> {
  try {
    const response = await wixApiRequest(
      instanceId,
      '/contacts/v4/contacts',
      {
        method: 'POST',
        body: JSON.stringify({ info: contactData }),
      },
    );
    const data = await response.json();
    return data.contact || data;
  } catch (err) {
    logger.error('Failed to create Wix contact', { instanceId, error: String(err) });
    return null;
  }
}

export async function updateWixContact(
  instanceId: string,
  contactId: string,
  revision: number,
  contactData: Record<string, unknown>,
): Promise<WixContact | null> {
  try {
    const response = await wixApiRequest(
      instanceId,
      `/contacts/v4/contacts/${contactId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          info: contactData,
          revision,
        }),
      },
    );
    const data = await response.json();
    return data.contact || data;
  } catch (err) {
    logger.error('Failed to update Wix contact', { instanceId, contactId, error: String(err) });
    return null;
  }
}

export async function queryWixContacts(
  instanceId: string,
  limit: number = 100,
  offset: number = 0,
): Promise<{ contacts: WixContact[]; total: number }> {
  try {
    const response = await wixApiRequest(
      instanceId,
      '/contacts/v4/contacts/query',
      {
        method: 'POST',
        body: JSON.stringify({
          query: {
            paging: { limit, offset },
            sort: [{ fieldName: 'lastActivity.activityDate', order: 'DESC' }],
          },
        }),
      },
    );
    const data = await response.json();
    return {
      contacts: data.contacts || [],
      total: data.pagingMetadata?.total || 0,
    };
  } catch (err) {
    logger.error('Failed to query Wix contacts', { instanceId, error: String(err) });
    return { contacts: [], total: 0 };
  }
}

export async function findWixContactByEmail(
  instanceId: string,
  email: string,
): Promise<WixContact | null> {
  try {
    const response = await wixApiRequest(
      instanceId,
      '/contacts/v4/contacts/query',
      {
        method: 'POST',
        body: JSON.stringify({
          query: {
            filter: {
              'info.emails.email': { $eq: email },
            },
            paging: { limit: 1 },
          },
        }),
      },
    );
    const data = await response.json();
    return data.contacts?.[0] || null;
  } catch (err) {
    logger.error('Failed to find Wix contact by email', { instanceId, email, error: String(err) });
    return null;
  }
}

export function listWixContactFields(): WixContactField[] {
  return [
    { key: 'info.name.first', label: 'First Name', type: 'text' },
    { key: 'info.name.last', label: 'Last Name', type: 'text' },
    { key: 'primaryInfo.email', label: 'Email', type: 'email' },
    { key: 'primaryInfo.phone', label: 'Phone', type: 'phone' },
    { key: 'info.company', label: 'Company', type: 'text' },
    { key: 'info.jobTitle', label: 'Job Title', type: 'text' },
    { key: 'info.birthdate', label: 'Birthdate', type: 'date' },
    { key: 'info.addresses[0].street', label: 'Street Address', type: 'text' },
    { key: 'info.addresses[0].city', label: 'City', type: 'text' },
    { key: 'info.addresses[0].subdivision', label: 'State/Province', type: 'text' },
    { key: 'info.addresses[0].country', label: 'Country', type: 'text' },
    { key: 'info.addresses[0].postalCode', label: 'Postal Code', type: 'text' },
    { key: 'info.locale', label: 'Locale', type: 'text' },
  ];
}
