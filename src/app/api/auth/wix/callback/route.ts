import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getWixTokenByInstance, getWixTokenByCode, storeWixInstallation } from '@/lib/services/wix-auth';
import { logger } from '@/lib/utils/logger';
import { DEFAULT_FIELD_MAPPINGS } from '@/lib/utils/constants';
import { getDb } from '@/lib/db';
import { WixTokenResponse } from '@/types/wix';

const INSTALL_ENTRY_COOKIE = 'wix_install_entry';

export async function GET(req: NextRequest) {
  const correlationId = randomUUID();
  const code = req.nextUrl.searchParams.get('code');
  const rawInstanceId = req.nextUrl.searchParams.get('instanceId');
  const instanceJwt = req.nextUrl.searchParams.get('instance');
  const state = req.nextUrl.searchParams.get('state');
  const queryEntry = req.nextUrl.searchParams.get('entry');
  const cookieEntry = req.cookies.get(INSTALL_ENTRY_COOKIE)?.value || null;
  const entry = queryEntry || cookieEntry;
  const authMode = getWixAuthMode();
  const instanceId = rawInstanceId || extractInstanceIdFromJwt(instanceJwt);

  logger.info('Wix OAuth callback received', {
    correlationId,
    authMode,
    hasCode: !!code,
    hasInstanceId: !!rawInstanceId,
    hasInstanceJwt: !!instanceJwt,
    resolvedInstanceId: !!instanceId,
    hasState: !!state,
    hasInstallEntryCookie: !!cookieEntry,
    resolvedEntry: entry,
    codeLength: code?.length ?? 0,
    instanceIdLength: rawInstanceId?.length ?? 0,
  });

  if (!instanceId && !code) {
    logger.error('Wix callback missing both code and instanceId');
    return redirectWithError('Missing both code and instance context parameters', correlationId);
  }

  // Step 1: Try to get tokens - attempt both flows
  let tokens: WixTokenResponse | null = null;
  const errors: string[] = [];

  const allowFlowA = authMode === 'hybrid' || authMode === 'oauth_only';
  const allowFlowB = authMode === 'hybrid' || authMode === 'legacy_only';

  if (!allowFlowA) {
    errors.push(`Flow A blocked by mode=${authMode}`);
  }
  if (!allowFlowB) {
    errors.push(`Flow B blocked by mode=${authMode}`);
  }

  // Flow A: Modern OAuth client_credentials (if allowed and we have instanceId)
  if (allowFlowA && instanceId) {
    try {
      tokens = await getWixTokenByInstance(instanceId, correlationId);
      logger.info('Flow A (client_credentials) succeeded', { correlationId, instanceId, authMode });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Flow A (client_credentials): ${message}`);
      logger.warn('Flow A (client_credentials) failed, will try Flow B', { correlationId, authMode, error: message });
    }
  } else if (allowFlowA && !instanceId) {
    errors.push('Flow A (client_credentials): missing instanceId');
  }

  // Flow B: Legacy authorization_code (if allowed and Flow A failed/skipped)
  if (!tokens && allowFlowB && code) {
    try {
      tokens = await getWixTokenByCode(code, correlationId);
      logger.info('Flow B (authorization_code) succeeded', { correlationId, instanceId, authMode });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Flow B (authorization_code): ${message}`);
      logger.error('Flow B (authorization_code) also failed', { correlationId, authMode, error: message });
    }
  } else if (!tokens && allowFlowB && !code) {
    errors.push('Flow B (authorization_code): missing code');
  }

  if (!tokens) {
    const detail = errors.join(' | ');
    logger.error('All token flows failed', { correlationId, instanceId, authMode, errors });
    return redirectWithError(`Token exchange failed - ${detail}`, correlationId);
  }

  const storageId = resolveStorageInstanceId(instanceId, tokens);
  if (!storageId) {
    logger.error('Unable to resolve Wix instance id for storage', { correlationId, authMode });
    return redirectWithError('Storage failed - missing resolvable instance id', correlationId);
  }

  // Step 2: Store the installation in MongoDB
  try {
    await storeWixInstallation(storageId, tokens);
    logger.info('Wix installation stored', { correlationId, instanceId: storageId });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Failed to store Wix installation', { correlationId, instanceId: storageId, error: message });
    return redirectWithError(`Storage failed - ${message}`, correlationId);
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
      logger.info('Default field mappings created', { correlationId, instanceId: storageId, count: mappings.length });
    }
  } catch (error) {
    // Non-fatal: mappings can be created later from the dashboard
    logger.error('Failed to create default mappings', { correlationId, instanceId: storageId, error: String(error) });
  }

  // Step 4: Redirect user
  let redirectUrl: string;
  if (entry === 'landing') {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/$/, '')
      || 'https://wix-hubspot-integration-vame.vercel.app';
    const successUrl = new URL(`${baseUrl}/install/success`);
    successUrl.searchParams.set('instanceId', storageId);
    redirectUrl = successUrl.toString();
  } else if (state) {
    redirectUrl = decodeURIComponent(state);
  } else {
    // Use close-window without access_token — the installation is already stored
    // in MongoDB above. Passing the modern OAuthNG token to the legacy close-window
    // endpoint causes a Wix-side 500 error.
    redirectUrl = 'https://www.wix.com/installer/close-window';
  }

  logger.info('Wix OAuth callback complete, redirecting', {
    correlationId,
    instanceId: storageId,
    hasState: !!state,
    entry,
    redirectTarget: redirectUrl.substring(0, 120),
  });
  const response = NextResponse.redirect(redirectUrl);
  return finalizeRedirectResponse(response);
}

function redirectWithError(detail: string, correlationId: string): NextResponse {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/$/, '')
    || 'https://wix-hubspot-integration-vame.vercel.app';
  const errorUrl = new URL(baseUrl);
  errorUrl.searchParams.set('error', 'install_failed');
  errorUrl.searchParams.set('detail', detail.substring(0, 500));
  errorUrl.searchParams.set('cid', correlationId);
  const response = NextResponse.redirect(errorUrl.toString());
  return finalizeRedirectResponse(response);
}

function finalizeRedirectResponse(response: NextResponse): NextResponse {
  response.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none');
  response.cookies.set(INSTALL_ENTRY_COOKIE, '', {
    maxAge: 0,
    path: '/',
  });
  return response;
}

type WixAuthMode = 'hybrid' | 'oauth_only' | 'legacy_only';
const VALID_AUTH_MODES: WixAuthMode[] = ['hybrid', 'oauth_only', 'legacy_only'];

function getWixAuthMode(): WixAuthMode {
  const mode = process.env.WIX_AUTH_MODE;
  if (!mode) return 'hybrid';
  if (VALID_AUTH_MODES.includes(mode as WixAuthMode)) return mode as WixAuthMode;

  logger.warn('Invalid WIX_AUTH_MODE, defaulting to hybrid', { mode });
  return 'hybrid';
}

function extractInstanceIdFromJwt(instanceJwt: string | null): string | null {
  if (!instanceJwt) return null;
  try {
    const parts = instanceJwt.split('.');
    if (parts.length < 2) return null;
    const payloadRaw = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(payloadRaw, 'base64').toString('utf8')) as {
      instanceId?: string;
      instance_id?: string;
    };
    return payload.instanceId || payload.instance_id || null;
  } catch {
    return null;
  }
}

function resolveStorageInstanceId(
  resolvedInstanceId: string | null,
  tokens: WixTokenResponse,
): string | null {
  return (
    resolvedInstanceId ||
    tokens.instanceId ||
    tokens.instance_id ||
    null
  );
}
