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

    // Get recent sync errors
    const recentErrors = await db
      .collection('sync_errors')
      .find({ wixInstanceId: instanceId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Get sync statistics
    const totalContacts = await db.collection('contact_mappings').countDocuments({
      wixInstanceId: instanceId,
    });

    const recentSyncs = await db
      .collection('contact_mappings')
      .find({ wixInstanceId: instanceId })
      .sort({ lastSyncedAt: -1 })
      .limit(5)
      .toArray();

    const unresolvedErrors = await db.collection('sync_errors').countDocuments({
      wixInstanceId: instanceId,
      resolvedAt: null,
    });

    return NextResponse.json({
      totalSyncedContacts: totalContacts,
      unresolvedErrors,
      recentErrors: recentErrors.map((e) => ({
        direction: e.direction,
        errorMessage: e.errorMessage,
        createdAt: e.createdAt,
        errorType: e.errorType,
      })),
      recentSyncs: recentSyncs.map((s) => ({
        wixContactId: s.wixContactId,
        hubspotContactId: s.hubspotContactId,
        lastSyncedAt: s.lastSyncedAt,
        direction: s.lastSyncDirection,
        source: s.lastSyncSource,
      })),
    });
  } catch (error) {
    logger.error('Failed to get sync status', { error: String(error) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
