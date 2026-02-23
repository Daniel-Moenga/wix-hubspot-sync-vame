import { NextRequest, NextResponse } from 'next/server';
import { verifyHubSpotWebhook } from '@/lib/services/webhook-verify';
import { processHubSpotContactEvent } from '@/lib/services/sync-engine';
import { logger } from '@/lib/utils/logger';
import { HubSpotWebhookEvent } from '@/types/hubspot';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('X-HubSpot-Signature-v3')
      || req.headers.get('X-HubSpot-Signature');
    const timestamp = req.headers.get('X-HubSpot-Request-Timestamp');
    const method = 'POST';
    const url = req.nextUrl.pathname;

    // Verify HMAC signature
    if (!verifyHubSpotWebhook(body, signature, method, url, timestamp)) {
      logger.error('HubSpot webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // HubSpot sends an array of events
    const events: HubSpotWebhookEvent[] = JSON.parse(body);

    logger.info('HubSpot webhook received', { eventCount: events.length });

    // Process each event asynchronously
    for (const event of events) {
      // Only process contact creation and property change events
      if (
        event.subscriptionType !== 'contact.creation'
        && event.subscriptionType !== 'contact.propertyChange'
      ) {
        continue;
      }

      processHubSpotContactEvent(event).catch((err) => {
        logger.error('HubSpot contact sync failed', {
          eventId: event.eventId,
          objectId: event.objectId,
          error: String(err),
        });
      });
    }

    return NextResponse.json({ status: 'accepted' }, { status: 200 });
  } catch (error) {
    logger.error('HubSpot webhook error', { error: String(error) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
