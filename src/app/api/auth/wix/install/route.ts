import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { WIX_INSTALLER_URL } from '@/lib/utils/constants';
import { logger } from '@/lib/utils/logger';

export async function GET(req: NextRequest) {
  const correlationId = randomUUID();
  try {
    const token = req.nextUrl.searchParams.get('token');
    const appId = process.env.WIX_APP_ID?.trim();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/$/, '');

    if (!appId || !baseUrl) {
      logger.error('Missing required Wix install env vars', {
        correlationId,
        hasAppId: !!appId,
        hasBaseUrl: !!baseUrl,
      });
      return NextResponse.json({ error: 'Missing Wix install configuration' }, { status: 500 });
    }

    const redirectUrl = token
      ? `${baseUrl}/api/auth/wix/callback`
      : `${baseUrl}/api/auth/wix/callback?entry=landing`;

    const installUrl = new URL(WIX_INSTALLER_URL);
    if (token) {
      installUrl.searchParams.set('token', token);
    }
    installUrl.searchParams.set('appId', appId);
    installUrl.searchParams.set('redirectUrl', redirectUrl);

    logger.info('Redirecting to Wix installer', {
      correlationId,
      appId,
      hasToken: !!token,
    });

    return NextResponse.redirect(installUrl.toString());
  } catch (error) {
    logger.error('Wix install error', { correlationId, error: String(error) });
    return NextResponse.json({ error: 'Installation failed' }, { status: 500 });
  }
}
