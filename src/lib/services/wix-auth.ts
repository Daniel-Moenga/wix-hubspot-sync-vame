import { getDb } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/utils/crypto';
import { logger } from '@/lib/utils/logger';
import { WIX_OAUTH_BASE } from '@/lib/utils/constants';
import { WixTokenResponse } from '@/types/wix';

/**
 * Modern OAuth: client_credentials grant at /oauth2/token
 */
export async function getWixTokenByInstance(instanceId: string): Promise<WixTokenResponse> {
  const url = `${WIX_OAUTH_BASE}/token`;
  const appId = process.env.WIX_APP_ID;
  const appSecret = process.env.WIX_APP_SECRET;

  logger.info('Attempting client_credentials token request', {
    url,
    hasAppId: !!appId,
    appIdLength: appId?.length ?? 0,
    hasAppSecret: !!appSecret,
    appSecretLength: appSecret?.length ?? 0,
    instanceIdPrefix: instanceId?.substring(0, 8) ?? 'EMPTY',
    instanceIdLength: instanceId?.length ?? 0,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: appId,
      client_secret: appSecret,
      instance_id: instanceId,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('client_credentials token request failed', {
      status: response.status,
      error: errorText,
      url,
    });
    throw new Error(`client_credentials failed: ${response.status} - ${errorText.substring(0, 300)}`);
  }

  logger.info('client_credentials token request succeeded');
  return response.json();
}

/**
 * Legacy flow: authorization_code grant at /oauth/access (wixapis.com domain)
 */
export async function getWixTokenByCode(code: string): Promise<WixTokenResponse> {
  const url = 'https://www.wixapis.com/oauth/access';
  const appId = process.env.WIX_APP_ID;
  const appSecret = process.env.WIX_APP_SECRET;

  logger.info('Attempting authorization_code token request', {
    url,
    hasCode: !!code,
    codeLength: code?.length ?? 0,
    codePrefix: code?.substring(0, 8) ?? 'EMPTY',
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: appId,
      client_secret: appSecret,
      code,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('authorization_code token request failed', {
      status: response.status,
      error: errorText,
      url,
    });
    throw new Error(`authorization_code failed: ${response.status} - ${errorText.substring(0, 300)}`);
  }

  logger.info('authorization_code token request succeeded');
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
