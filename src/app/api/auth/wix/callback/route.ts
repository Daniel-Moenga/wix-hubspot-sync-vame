import { NextRequest, NextResponse } from 'next/server';
import { exchangeWixCode, storeWixInstallation } from '@/lib/services/wix-auth';
import { logger } from '@/lib/utils/logger';
import { DEFAULT_FIELD_MAPPINGS } from '@/lib/utils/constants';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');
    const instanceId = req.nextUrl.searchParams.get('instanceId');
    const state = req.nextUrl.searchParams.get('state');

    if (!code || !instanceId) {
      return NextResponse.json(
        { error: 'Missing code or instanceId' },
        { status: 400 },
      );
    }

    logger.info('Wix OAuth callback received', { instanceId });

    // Exchange code for tokens
    const tokens = await exchangeWixCode(code);

    // Store installation
    await storeWixInstallation(instanceId, tokens);

    // Create default field mappings for this installation
    const db = await getDb();
    const existingMappings = await db
      .collection('field_mappings')
      .countDocuments({ wixInstanceId: instanceId });

    if (existingMappings === 0) {
      const now = new Date();
      const mappings = DEFAULT_FIELD_MAPPINGS.map((m) => ({
        ...m,
        installationId: instanceId,
        wixInstanceId: instanceId,
        createdAt: now,
        updatedAt: now,
      }));

      await db.collection('field_mappings').insertMany(mappings);
      logger.info('Default field mappings created', { instanceId, count: mappings.length });
    }

    // Redirect back - close the installer window
    const redirectUrl = state
      ? decodeURIComponent(state)
      : `https://www.wix.com/installer/close-window?access_token=${tokens.access_token}`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    logger.error('Wix callback error', { error: String(error) });
    return NextResponse.json({ error: 'OAuth callback failed' }, { status: 500 });
  }
}
