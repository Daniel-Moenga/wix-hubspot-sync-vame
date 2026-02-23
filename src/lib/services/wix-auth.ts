import { getDb } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/utils/crypto';
import { logger } from '@/lib/utils/logger';
import { WIX_OAUTH_BASE } from '@/lib/utils/constants';
import { WixTokenResponse } from '@/types/wix';

export async function exchangeWixCode(code: string): Promise<WixTokenResponse> {
  const response = await fetch(`${WIX_OAUTH_BASE}/access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.WIX_APP_ID,
      client_secret: process.env.WIX_APP_SECRET,
      code,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('Wix code exchange failed', { status: response.status, error: errorText });
    throw new Error(`Wix code exchange failed: ${response.status} - ${errorText.substring(0, 200)}`);
  }

  return response.json();
}

export async function refreshWixToken(refreshToken: string): Promise<WixTokenResponse> {
  const response = await fetch(`${WIX_OAUTH_BASE}/access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: process.env.WIX_APP_ID,
      client_secret: process.env.WIX_APP_SECRET,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('Wix token refresh failed', { status: response.status, error: errorText });
    throw new Error(`Wix token refresh failed: ${response.status}`);
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

  // Refresh the token
  logger.info('Refreshing Wix access token', { instanceId });
  const decryptedRefresh = decrypt(installation.wixRefreshToken);
  const tokens = await refreshWixToken(decryptedRefresh);

  await db.collection('installations').updateOne(
    { wixInstanceId: instanceId },
    {
      $set: {
        wixAccessToken: encrypt(tokens.access_token),
        wixRefreshToken: encrypt(tokens.refresh_token),
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
        wixRefreshToken: encrypt(tokens.refresh_token),
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
