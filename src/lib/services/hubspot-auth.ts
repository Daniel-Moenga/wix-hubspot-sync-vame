import { Client } from '@hubspot/api-client';
import { PropertyCreateTypeEnum, PropertyCreateFieldTypeEnum } from '@hubspot/api-client/lib/codegen/crm/properties/models/PropertyCreate';
import { getDb } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/utils/crypto';
import { logger } from '@/lib/utils/logger';
import { HUBSPOT_TOKEN_URL, UTM_PROPERTIES } from '@/lib/utils/constants';
import { HubSpotTokenResponse } from '@/types/hubspot';

export async function exchangeHubSpotCode(code: string): Promise<HubSpotTokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.HUBSPOT_CLIENT_ID!,
    client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/hubspot/callback`,
    code,
  });

  const response = await fetch(HUBSPOT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('HubSpot code exchange failed', { status: response.status, error: errorText });
    throw new Error(`HubSpot code exchange failed: ${response.status}`);
  }

  return response.json();
}

async function refreshHubSpotToken(refreshToken: string): Promise<HubSpotTokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.HUBSPOT_CLIENT_ID!,
    client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
    refresh_token: refreshToken,
  });

  const response = await fetch(HUBSPOT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('HubSpot token refresh failed', { status: response.status, error: errorText });
    throw new Error(`HubSpot token refresh failed: ${response.status}`);
  }

  return response.json();
}

export async function getHubSpotClient(instanceId: string): Promise<Client> {
  const db = await getDb();
  const installation = await db.collection('installations').findOne({ wixInstanceId: instanceId });

  if (!installation || !installation.hubspotAccessToken) {
    throw new Error(`HubSpot not connected for instanceId: ${instanceId}`);
  }

  const client = new Client();

  // Return current token if still valid (with 60s buffer)
  if (installation.hubspotTokenExpiresAt > new Date(Date.now() + 60000)) {
    client.setAccessToken(decrypt(installation.hubspotAccessToken));
    return client;
  }

  // Refresh the token
  logger.info('Refreshing HubSpot access token', { instanceId });
  const decryptedRefresh = decrypt(installation.hubspotRefreshToken!);
  const tokens = await refreshHubSpotToken(decryptedRefresh);

  client.setAccessToken(tokens.access_token);

  await db.collection('installations').updateOne(
    { wixInstanceId: instanceId },
    {
      $set: {
        hubspotAccessToken: encrypt(tokens.access_token),
        hubspotRefreshToken: encrypt(tokens.refresh_token),
        hubspotTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        updatedAt: new Date(),
      },
    },
  );

  return client;
}

export async function storeHubSpotConnection(
  instanceId: string,
  tokens: HubSpotTokenResponse,
): Promise<void> {
  const db = await getDb();

  await db.collection('installations').updateOne(
    { wixInstanceId: instanceId },
    {
      $set: {
        hubspotAccessToken: encrypt(tokens.access_token),
        hubspotRefreshToken: encrypt(tokens.refresh_token),
        hubspotTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        hubspotPortalId: tokens.hub_id?.toString() || null,
        hubspotConnectedAt: new Date(),
        syncEnabled: true,
        updatedAt: new Date(),
      },
    },
  );

  logger.info('HubSpot connection stored', { instanceId, portalId: tokens.hub_id });
}

export async function ensureUTMProperties(instanceId: string): Promise<void> {
  const client = await getHubSpotClient(instanceId);

  for (const prop of UTM_PROPERTIES) {
    try {
      await client.crm.properties.coreApi.create('contacts', {
        name: prop.name,
        label: prop.label,
        type: PropertyCreateTypeEnum.String,
        fieldType: PropertyCreateFieldTypeEnum.Text,
        groupName: 'contactinformation',
      });
      logger.info(`Created UTM property: ${prop.name}`, { instanceId });
    } catch (err: unknown) {
      const error = err as { code?: number; status?: number; body?: { status?: string } };
      // 409 = already exists, which is fine
      if (error.code === 409 || error.status === 409 || error.body?.status === 'error') {
        logger.debug(`UTM property already exists: ${prop.name}`, { instanceId });
      } else {
        logger.error(`Failed to create UTM property: ${prop.name}`, {
          instanceId,
          error: String(err),
        });
      }
    }
  }
}
