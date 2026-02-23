import { NextRequest, NextResponse } from 'next/server';
import { WIX_INSTALLER_URL } from '@/lib/utils/constants';
import { logger } from '@/lib/utils/logger';

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token parameter' }, { status: 400 });
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/wix/callback`;
    const installUrl = new URL(WIX_INSTALLER_URL);
    installUrl.searchParams.set('token', token);
    installUrl.searchParams.set('appId', process.env.WIX_APP_ID!);
    installUrl.searchParams.set('redirectUrl', redirectUrl);

    logger.info('Redirecting to Wix installer', { appId: process.env.WIX_APP_ID });

    return NextResponse.redirect(installUrl.toString());
  } catch (error) {
    logger.error('Wix install error', { error: String(error) });
    return NextResponse.json({ error: 'Installation failed' }, { status: 500 });
  }
}
