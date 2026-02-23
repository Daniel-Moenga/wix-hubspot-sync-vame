import { MongoClient, Db } from 'mongodb';
import { logger } from '@/lib/utils/logger';

function getMongoUri(): string {
  const raw = process.env.MONGODB_URI;
  if (!raw) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  // Defend against accidental copy/paste artifacts in hosted env vars.
  const sanitized = raw
    .trim()
    .replace(/[\r\n]/g, '')
    .replace(/^["']|["']$/g, '');

  if (!sanitized) {
    throw new Error('MONGODB_URI is empty after sanitization');
  }

  return sanitized;
}

function getMongoUriDiagnostics(uri: string): Record<string, unknown> {
  const safe: Record<string, unknown> = {
    length: uri.length,
    hasLiteralBackslashN: uri.includes('\\n'),
    hasLiteralBackslashR: uri.includes('\\r'),
    hasWhitespace: /\s/.test(uri),
    startsWithQuote: uri.startsWith('"') || uri.startsWith("'"),
    endsWithQuote: uri.endsWith('"') || uri.endsWith("'"),
  };

  try {
    const parsed = new URL(uri);
    safe.protocol = parsed.protocol;
    safe.host = parsed.host;
    safe.pathname = parsed.pathname;
    safe.hasAuth = !!parsed.username;
  } catch {
    safe.urlParse = 'failed';
  }

  return safe;
}

interface MongoClientCache {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

const globalForMongo = globalThis as unknown as {
  _mongoClientCache: MongoClientCache;
};

if (!globalForMongo._mongoClientCache) {
  globalForMongo._mongoClientCache = { client: null, promise: null };
}

const cached = globalForMongo._mongoClientCache;

async function getClient(): Promise<MongoClient> {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    const uri = getMongoUri();
    cached.promise = MongoClient.connect(uri)
      .then((client) => {
        cached.client = client;
        return client;
      })
      .catch((error) => {
        logger.error('MongoClient.connect failed', {
          error: String(error),
          diagnostics: getMongoUriDiagnostics(uri),
        });
        cached.promise = null;
        throw error;
      });
  }

  return cached.promise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db('wix-hubspot-integration');
}

export async function ensureIndexes(): Promise<void> {
  const db = await getDb();

  await db.collection('installations').createIndex(
    { wixInstanceId: 1 },
    { unique: true },
  );

  await db.collection('installations').createIndex(
    { hubspotPortalId: 1 },
    { sparse: true },
  );

  await db.collection('field_mappings').createIndex(
    { wixInstanceId: 1 },
  );

  await db.collection('contact_mappings').createIndex(
    { wixInstanceId: 1, wixContactId: 1 },
    { unique: true },
  );

  await db.collection('contact_mappings').createIndex(
    { wixInstanceId: 1, hubspotContactId: 1 },
    { unique: true },
  );

  await db.collection('contact_mappings').createIndex(
    { wixInstanceId: 1, email: 1 },
  );

  await db.collection('processed_events').createIndex(
    { eventId: 1 },
    { unique: true },
  );

  await db.collection('processed_events').createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 },
  );

  await db.collection('sync_errors').createIndex(
    { wixInstanceId: 1, resolvedAt: 1 },
  );

  await db.collection('sync_errors').createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 },
  );
}
