import { NextRequest, NextResponse } from 'next/server';
import { signState } from '@/lib/utils/crypto';
import { HUBSPOT_AUTH_URL, HUBSPOT_SCOPES } from '@/lib/utils/constants';
import { logger } from '@/lib/utils/logger';

export async function GET(req: NextRequest) {
  try {
    const instanceId = req.nextUrl.searchParams.get('instanceId');

    if (!instanceId) {
      return NextResponse.json({ error: 'Missing instanceId' }, { status: 400 });
    }

    const state = signState({ instanceId });
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/hubspot/callback`;

    const authUrl = new URL(HUBSPOT_AUTH_URL);
    authUrl.searchParams.set('client_id', process.env.HUBSPOT_CLIENT_ID!);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', HUBSPOT_SCOPES);
    authUrl.searchParams.set('state', state);

    logger.info('Redirecting to HubSpot OAuth', { instanceId });

    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    logger.error('HubSpot connect error', { error: String(error) });
    return NextResponse.json({ error: 'Failed to initiate HubSpot connection' }, { status: 500 });
  }
}
