import { NextRequest, NextResponse } from 'next/server';
import { verifyState } from '@/lib/utils/crypto';
import { exchangeHubSpotCode, storeHubSpotConnection, ensureUTMProperties } from '@/lib/services/hubspot-auth';
import { logger } from '@/lib/utils/logger';

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');
    const state = req.nextUrl.searchParams.get('state');

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state parameter' },
        { status: 400 },
      );
    }

    // Verify state to extract instanceId
    const stateData = verifyState(state);
    if (!stateData || !stateData.instanceId) {
      logger.error('Invalid OAuth state', { state });
      return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
    }

    const { instanceId } = stateData;
    logger.info('HubSpot OAuth callback received', { instanceId });

    // Exchange code for tokens
    const tokens = await exchangeHubSpotCode(code);

    // Store HubSpot connection
    await storeHubSpotConnection(instanceId, tokens);

    // Create UTM properties in HubSpot (async, don't block redirect)
    ensureUTMProperties(instanceId).catch((err) => {
      logger.error('Failed to create UTM properties', { instanceId, error: String(err) });
    });

    // Return HTML that closes the popup and notifies the parent
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>HubSpot Connected</title></head>
        <body>
          <h2>HubSpot connected successfully!</h2>
          <p>You can close this window.</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'HUBSPOT_CONNECTED', instanceId: '${instanceId}' }, '*');
              window.close();
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    logger.error('HubSpot callback error', { error: String(error) });
    return NextResponse.json({ error: 'HubSpot OAuth callback failed' }, { status: 500 });
  }
}
