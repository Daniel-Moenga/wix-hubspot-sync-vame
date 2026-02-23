import { NextRequest, NextResponse } from 'next/server';
import { getWixTokenByInstance, getWixTokenByCode, storeWixInstallation } from '@/lib/services/wix-auth';
import { logger } from '@/lib/utils/logger';
import { DEFAULT_FIELD_MAPPINGS } from '@/lib/utils/constants';
import { getDb } from '@/lib/db';
import { WixTokenResponse } from '@/types/wix';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const instanceId = req.nextUrl.searchParams.get('instanceId');
  const state = req.nextUrl.searchParams.get('state');

  logger.info('Wix OAuth callback received', {
    hasCode: !!code,
    hasInstanceId: !!instanceId,
    hasState: !!state,
    codeLength: code?.length ?? 0,
    instanceIdLength: instanceId?.length ?? 0,
  });

  if (!instanceId && !code) {
    logger.error('Wix callback missing both code and instanceId');
    return redirectWithError('Missing both code and instanceId parameters');
  }

  // Step 1: Try to get tokens - attempt both flows
  let tokens: WixTokenResponse | null = null;
  const errors: string[] = [];

  // Flow A: Modern OAuth client_credentials (if we have instanceId)
  if (instanceId) {
    try {
      tokens = await getWixTokenByInstance(instanceId);
      logger.info('Flow A (client_credentials) succeeded', { instanceId });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Flow A (client_credentials): ${message}`);
      logger.warn('Flow A (client_credentials) failed, will try Flow B', { error: message });
    }
  }

  // Flow B: Legacy authorization_code (if Flow A failed and we have a code)
  if (!tokens && code) {
    try {
      tokens = await getWixTokenByCode(code);
      logger.info('Flow B (authorization_code) succeeded', { instanceId });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Flow B (authorization_code): ${message}`);
      logger.error('Flow B (authorization_code) also failed', { error: message });
    }
  }

  if (!tokens) {
    const detail = errors.join(' | ');
    logger.error('All token flows failed', { instanceId, errors });
    return redirectWithError(`Token exchange failed - ${detail}`);
  }

  // Use instanceId from the callback for storage (even if we used code for auth)
  const storageId = instanceId || 'unknown';

  // Step 2: Store the installation in MongoDB
  try {
    await storeWixInstallation(storageId, tokens);
    logger.info('Wix installation stored', { instanceId: storageId });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Failed to store Wix installation', { instanceId: storageId, error: message });
    return redirectWithError(`Storage failed - ${message}`);
  }

  // Step 3: Create default field mappings if none exist
  try {
    const db = await getDb();
    const existingMappings = await db
      .collection('field_mappings')
      .countDocuments({ wixInstanceId: storageId });

    if (existingMappings === 0) {
      const now = new Date();
      const mappings = DEFAULT_FIELD_MAPPINGS.map((m) => ({
        ...m,
        installationId: storageId,
        wixInstanceId: storageId,
        createdAt: now,
        updatedAt: now,
      }));

      await db.collection('field_mappings').insertMany(mappings);
      logger.info('Default field mappings created', { instanceId: storageId, count: mappings.length });
    }
  } catch (error) {
    // Non-fatal: mappings can be created later from the dashboard
    logger.error('Failed to create default mappings', { instanceId: storageId, error: String(error) });
  }

  // Step 4: Redirect to close the installer window
  const redirectUrl = state
    ? decodeURIComponent(state)
    : `https://www.wix.com/installer/close-window?access_token=${tokens.access_token}`;

  logger.info('Wix OAuth callback complete, redirecting', { instanceId: storageId, hasState: !!state });
  return NextResponse.redirect(redirectUrl);
}

function redirectWithError(detail: string): NextResponse {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wix-hubspot-integration-vame.vercel.app';
  const errorUrl = new URL(baseUrl);
  errorUrl.searchParams.set('error', 'install_failed');
  errorUrl.searchParams.set('detail', detail.substring(0, 500));
  return NextResponse.redirect(errorUrl.toString());
}
