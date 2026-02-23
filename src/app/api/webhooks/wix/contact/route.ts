import { NextRequest, NextResponse } from 'next/server';
import { verifyWixWebhook, parseWixWebhookPayload } from '@/lib/services/webhook-verify';
import { processWixContactEvent } from '@/lib/services/sync-engine';
import { logger } from '@/lib/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    // Verify webhook signature
    if (!verifyWixWebhook(body)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse payload
    const payload = parseWixWebhookPayload(body);
    if (!payload) {
      logger.error('Failed to parse Wix contact webhook');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { instanceId, eventType, data } = payload;
    const contactId = (data.entityId || data.contactId || data.id) as string;

    if (!instanceId || !contactId) {
      logger.error('Missing instanceId or contactId in webhook', { payload });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    logger.info('Wix contact webhook received', { instanceId, eventType, contactId });

    // Process asynchronously  - respond fast
    processWixContactEvent(instanceId, contactId, eventType).catch((err) => {
      logger.error('Wix contact sync failed', {
        instanceId,
        contactId,
        error: String(err),
      });
    });

    return NextResponse.json({ status: 'accepted' }, { status: 200 });
  } catch (error) {
    logger.error('Wix contact webhook error', { error: String(error) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
