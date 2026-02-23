import { NextRequest, NextResponse } from 'next/server';
import { exchangeWixCode, storeWixInstallation } from '@/lib/services/wix-auth';
import { logger } from '@/lib/utils/logger';
import { DEFAULT_FIELD_MAPPINGS } from '@/lib/utils/constants';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const instanceId = req.nextUrl.searchParams.get('instanceId');
  const state = req.nextUrl.searchParams.get('state');

  if (!code || !instanceId) {
    logger.error('Wix callback missing params', { hasCode: !!code, hasInstanceId: !!instanceId });
    return redirectWithError('Missing code or instanceId parameter');
  }

  logger.info('Wix OAuth callback received', { instanceId });

  // Step 1: Exchange the authorization code for tokens
  let tokens;
  try {
    tokens = await exchangeWixCode(code);
    logger.info('Wix code exchange succeeded', { instanceId });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Wix code exchange failed', { instanceId, error: message });
    return redirectWithError(`Token exchange failed - ${message}`);
  }

  // Step 2: Store the installation in MongoDB
  try {
    await storeWixInstallation(instanceId, tokens);
    logger.info('Wix installation stored', { instanceId });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Failed to store Wix installation', { instanceId, error: message });
    return redirectWithError(`Storage failed - ${message}`);
  }

  // Step 3: Create default field mappings if none exist
  try {
    const db = await getDb();
    const existingMappings = await db
      .collection('field_mappings')
      .countDocuments({ wixInstanceId: instanceId });

    if (existingMappings === 0) {
      const now = new Date();
      const mappings = DEFAULT_FIELD_MAPPINGS.map((m) => ({
        ...m,
        installationId: instanceId,
        wixInstanceId: instanceId,
        createdAt: now,
        updatedAt: now,
      }));

      await db.collection('field_mappings').insertMany(mappings);
      logger.info('Default field mappings created', { instanceId, count: mappings.length });
    }
  } catch (error) {
    // Non-fatal: mappings can be created later from the dashboard
    logger.error('Failed to create default mappings', { instanceId, error: String(error) });
  }

  // Step 4: Redirect to close the installer window
  const redirectUrl = state
    ? decodeURIComponent(state)
    : `https://www.wix.com/installer/close-window?access_token=${tokens.access_token}`;

  logger.info('Wix OAuth callback complete, redirecting', { instanceId, hasState: !!state });
  return NextResponse.redirect(redirectUrl);
}

function redirectWithError(detail: string): NextResponse {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wix-hubspot-integration-vame.vercel.app';
  const errorUrl = new URL(baseUrl);
  errorUrl.searchParams.set('error', 'install_failed');
  errorUrl.searchParams.set('detail', detail.substring(0, 200));
  return NextResponse.redirect(errorUrl.toString());
}
