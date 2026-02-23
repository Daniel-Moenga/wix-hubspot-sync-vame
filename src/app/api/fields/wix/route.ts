import { NextRequest, NextResponse } from 'next/server';
import { listWixContactFields } from '@/lib/services/wix-contacts';
import { logger } from '@/lib/utils/logger';

export async function GET(req: NextRequest) {
  try {
    const instanceId = req.nextUrl.searchParams.get('instanceId');
    if (!instanceId) {
      return NextResponse.json({ error: 'Missing instanceId' }, { status: 400 });
    }

    const fields = listWixContactFields();
    return NextResponse.json({ fields });
  } catch (error) {
    logger.error('Failed to get Wix fields', { error: String(error) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
