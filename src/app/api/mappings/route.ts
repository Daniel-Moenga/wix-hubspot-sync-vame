import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { logger } from '@/lib/utils/logger';

export async function GET(req: NextRequest) {
  try {
    const instanceId = req.nextUrl.searchParams.get('instanceId');
    if (!instanceId) {
      return NextResponse.json({ error: 'Missing instanceId' }, { status: 400 });
    }

    const db = await getDb();
    const mappings = await db
      .collection('field_mappings')
      .find({ wixInstanceId: instanceId })
      .sort({ isDefault: -1, createdAt: 1 })
      .toArray();

    return NextResponse.json({ mappings });
  } catch (error) {
    logger.error('Failed to get mappings', { error: String(error) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instanceId, wixField, wixFieldLabel, hubspotProperty, hubspotPropertyLabel, transformType, transformConfig, direction } = body;

    if (!instanceId || !wixField || !hubspotProperty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date();

    const mapping = {
      installationId: instanceId,
      wixInstanceId: instanceId,
      wixField,
      wixFieldLabel: wixFieldLabel || wixField,
      hubspotProperty,
      hubspotPropertyLabel: hubspotPropertyLabel || hubspotProperty,
      transformType: transformType || 'identity',
      transformConfig: transformConfig || null,
      direction: direction || 'both',
      isActive: true,
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('field_mappings').insertOne(mapping);

    return NextResponse.json({
      mapping: { ...mapping, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create mapping', { error: String(error) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { instanceId, mappingId, ...updates } = body;

    if (!instanceId || !mappingId) {
      return NextResponse.json({ error: 'Missing instanceId or mappingId' }, { status: 400 });
    }

    const db = await getDb();

    const allowedUpdates: Record<string, unknown> = { updatedAt: new Date() };
    const fields = ['wixField', 'wixFieldLabel', 'hubspotProperty', 'hubspotPropertyLabel', 'transformType', 'transformConfig', 'direction', 'isActive'];

    for (const field of fields) {
      if (updates[field] !== undefined) {
        allowedUpdates[field] = updates[field];
      }
    }

    const result = await db.collection('field_mappings').updateOne(
      { _id: new ObjectId(mappingId), wixInstanceId: instanceId },
      { $set: allowedUpdates },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to update mapping', { error: String(error) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const instanceId = req.nextUrl.searchParams.get('instanceId');
    const mappingId = req.nextUrl.searchParams.get('mappingId');

    if (!instanceId || !mappingId) {
      return NextResponse.json({ error: 'Missing instanceId or mappingId' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection('field_mappings').deleteOne({
      _id: new ObjectId(mappingId),
      wixInstanceId: instanceId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to delete mapping', { error: String(error) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
