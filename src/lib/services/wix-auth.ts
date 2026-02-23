import { getDb } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/utils/crypto';
import { logger } from '@/lib/utils/logger';
import { WIX_OAUTH_BASE } from '@/lib/utils/constants';
import { WixTokenResponse } from '@/types/wix';

export async function getWixTokenByInstance(instanceId: string): Promise<WixTokenResponse> {
  const response = await fetch(`${WIX_OAUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.WIX_APP_ID,
      client_secret: process.env.WIX_APP_SECRET,
      instance_id: instanceId,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('Wix token request failed', { status: response.status, error: errorText });
    throw new Error(`Wix token request failed: ${response.status} - ${errorText.substring(0, 200)}`);
  }

  return response.json();
}

export async function getWixAccessToken(instanceId: string): Promise<string> {
  const db = await getDb();
  const installation = await db.collection('installations').findOne({ wixInstanceId: instanceId });

  if (!installation) {
    throw new Error(`No installation found for instanceId: ${instanceId}`);
  }

  // Return current token if still valid (with 30s buffer)
  if (installation.wixTokenExpiresAt > new Date(Date.now() + 30000)) {
    return decrypt(installation.wixAccessToken);
  }

  // Get a fresh token via client_credentials
  logger.info('Refreshing Wix access token', { instanceId });
  const tokens = await getWixTokenByInstance(instanceId);

  await db.collection('installations').updateOne(
    { wixInstanceId: instanceId },
    {
      $set: {
        wixAccessToken: encrypt(tokens.access_token),
        wixRefreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        wixTokenExpiresAt: new Date(Date.now() + (tokens.expires_in || 300) * 1000),
        updatedAt: new Date(),
      },
    },
  );

  return tokens.access_token;
}

export async function storeWixInstallation(
  instanceId: string,
  tokens: WixTokenResponse,
): Promise<void> {
  const db = await getDb();

  await db.collection('installations').updateOne(
    { wixInstanceId: instanceId },
    {
      $set: {
        wixAccessToken: encrypt(tokens.access_token),
        wixRefreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        wixTokenExpiresAt: new Date(Date.now() + (tokens.expires_in || 300) * 1000),
        updatedAt: new Date(),
        isActive: true,
      },
      $setOnInsert: {
        wixInstanceId: instanceId,
        hubspotAccessToken: null,
        hubspotRefreshToken: null,
        hubspotTokenExpiresAt: null,
        hubspotPortalId: null,
        installedAt: new Date(),
        hubspotConnectedAt: null,
        syncEnabled: false,
        lastSyncAt: null,
      },
    },
    { upsert: true },
  );

  logger.info('Wix installation stored', { instanceId });
}
