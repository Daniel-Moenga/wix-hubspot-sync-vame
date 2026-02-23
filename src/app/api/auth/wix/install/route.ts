import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { WIX_INSTALLER_URL } from '@/lib/utils/constants';
import { logger } from '@/lib/utils/logger';

const INSTALL_ENTRY_COOKIE = 'wix_install_entry';

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

    const redirectUrl = `${baseUrl}/api/auth/wix/callback`;

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

    const response = NextResponse.redirect(installUrl.toString());
    if (token) {
      // Prevent stale landing markers from influencing Wix-native installs.
      response.cookies.set(INSTALL_ENTRY_COOKIE, '', {
        maxAge: 0,
        path: '/',
      });
    } else {
      response.cookies.set(INSTALL_ENTRY_COOKIE, 'landing', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 10,
      });
    }

    return response;
  } catch (error) {
    logger.error('Wix install error', { correlationId, error: String(error) });
    return NextResponse.json({ error: 'Installation failed' }, { status: 500 });
  }
}
