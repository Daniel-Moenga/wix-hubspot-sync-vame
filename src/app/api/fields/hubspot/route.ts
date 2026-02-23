import { NextRequest, NextResponse } from 'next/server';
import { listHubSpotContactProperties } from '@/lib/services/hubspot-contacts';
import { logger } from '@/lib/utils/logger';

export async function GET(req: NextRequest) {
  try {
    const instanceId = req.nextUrl.searchParams.get('instanceId');
    if (!instanceId) {
      return NextResponse.json({ error: 'Missing instanceId' }, { status: 400 });
    }

    const properties = await listHubSpotContactProperties(instanceId);
    return NextResponse.json({
      properties: properties.map((p) => ({
        key: p.name,
        label: p.label,
        type: p.type,
      })),
    });
  } catch (error) {
    logger.error('Failed to get HubSpot fields', { error: String(error) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
