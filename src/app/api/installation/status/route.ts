import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logger } from '@/lib/utils/logger';

export async function GET(req: NextRequest) {
  try {
    const instanceId = req.nextUrl.searchParams.get('instanceId');
    if (!instanceId) {
      return NextResponse.json({ error: 'Missing instanceId' }, { status: 400 });
    }

    const db = await getDb();
    const installation = await db.collection('installations').findOne({
      wixInstanceId: instanceId,
    });

    if (!installation) {
      return NextResponse.json({ error: 'Installation not found' }, { status: 404 });
    }

    // Count recent sync errors
    const errorCount = await db.collection('sync_errors').countDocuments({
      wixInstanceId: instanceId,
      resolvedAt: null,
    });

    // Count synced contacts
    const contactCount = await db.collection('contact_mappings').countDocuments({
      wixInstanceId: instanceId,
    });

    return NextResponse.json({
      wixConnected: true,
      hubspotConnected: !!installation.hubspotAccessToken,
      hubspotPortalId: installation.hubspotPortalId,
      syncEnabled: installation.syncEnabled,
      lastSyncAt: installation.lastSyncAt,
      installedAt: installation.installedAt,
      errorCount,
      contactCount,
    });
  } catch (error) {
    logger.error('Failed to get installation status', { error: String(error) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
