import { MongoClient, Db } from 'mongodb';

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
    cached.promise = MongoClient.connect(getMongoUri()).then((client) => {
      cached.client = client;
      return client;
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
