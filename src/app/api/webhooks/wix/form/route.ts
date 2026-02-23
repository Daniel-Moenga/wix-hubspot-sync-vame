import { NextRequest, NextResponse } from 'next/server';
import { verifyWixWebhook, parseWixWebhookPayload } from '@/lib/services/webhook-verify';
import { processFormSubmission } from '@/lib/services/form-capture';
import { logger } from '@/lib/utils/logger';
import { WixFormSubmission } from '@/types/wix';

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
      logger.error('Failed to parse Wix form webhook');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { instanceId, data } = payload;

    if (!instanceId) {
      return NextResponse.json({ error: 'Missing instanceId' }, { status: 400 });
    }

    // Build form submission object from webhook data
    const formSubmission: WixFormSubmission = {
      formId: (data.formId || data.entityId || '') as string,
      submissionId: (data.submissionId || data.entityId || '') as string,
      submissions: (data.submissions || data.fieldValues || data) as Record<string, string>,
      pageUrl: data.pageUrl as string | undefined,
      createdDate: (data.createdDate || new Date().toISOString()) as string,
      submitter: data.submitter as WixFormSubmission['submitter'],
    };

    logger.info('Wix form webhook received', {
      instanceId,
      formId: formSubmission.formId,
    });

    // Process asynchronously
    processFormSubmission(instanceId, formSubmission).catch((err) => {
      logger.error('Form capture failed', {
        instanceId,
        formId: formSubmission.formId,
        error: String(err),
      });
    });

    return NextResponse.json({ status: 'accepted' }, { status: 200 });
  } catch (error) {
    logger.error('Wix form webhook error', { error: String(error) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
