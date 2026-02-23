import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error('ENCRYPTION_KEY environment variable is required');
  return Buffer.from(key, 'hex');
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, encrypted] = encryptedText.split(':');
  if (!ivHex || !encrypted) throw new Error('Invalid encrypted text format');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function signState(payload: Record<string, string>): string {
  const secret = process.env.STATE_SECRET;
  if (!secret) throw new Error('STATE_SECRET environment variable is required');
  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifyState(state: string): Record<string, string> | null {
  const secret = process.env.STATE_SECRET;
  if (!secret) throw new Error('STATE_SECRET environment variable is required');
  const [encoded, signature] = state.split('.');
  if (!encoded || !signature) return null;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(encoded)
    .digest('base64url');
  if (signature !== expectedSignature) return null;
  return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
}
