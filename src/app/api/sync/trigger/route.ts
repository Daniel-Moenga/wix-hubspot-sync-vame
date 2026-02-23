import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logger } from '@/lib/utils/logger';
import { queryWixContacts } from '@/lib/services/wix-contacts';
import { syncWixToHubSpot } from '@/lib/services/sync-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instanceId, direction = 'both' } = body;

    if (!instanceId) {
      return NextResponse.json({ error: 'Missing instanceId' }, { status: 400 });
    }

    const db = await getDb();
    const installation = await db.collection('installations').findOne({
      wixInstanceId: instanceId,
      hubspotAccessToken: { $ne: null },
    });

    if (!installation) {
      return NextResponse.json({ error: 'HubSpot not connected' }, { status: 400 });
    }

    logger.info('Manual sync triggered', { instanceId, direction });

    // Perform Wix → HubSpot sync (most common manual sync direction)
    let syncedCount = 0;
    let errorCount = 0;

    if (direction === 'wix_to_hubspot' || direction === 'both') {
      const { contacts } = await queryWixContacts(instanceId, 100);

      for (const contact of contacts) {
        const eventId = `manual-wix-${contact.id}-${Date.now()}`;
        try {
          const result = await syncWixToHubSpot(instanceId, contact, eventId);
          if (result.status === 'success') syncedCount++;
        } catch {
          errorCount++;
        }
      }
    }

    // Update last sync timestamp
    await db.collection('installations').updateOne(
      { wixInstanceId: instanceId },
      { $set: { lastSyncAt: new Date(), updatedAt: new Date() } },
    );

    return NextResponse.json({
      success: true,
      syncedCount,
      errorCount,
      direction,
    });
  } catch (error) {
    logger.error('Manual sync failed', { error: String(error) });
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
