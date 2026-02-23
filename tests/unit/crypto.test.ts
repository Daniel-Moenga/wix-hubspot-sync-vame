import { describe, it, expect, vi } from 'vitest';
import crypto from 'crypto';

// Generate stable test keys
const TEST_ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
const TEST_STATE_SECRET = 'test-state-secret-12345';

// Set env vars before importing the module
vi.stubEnv('ENCRYPTION_KEY', TEST_ENCRYPTION_KEY);
vi.stubEnv('STATE_SECRET', TEST_STATE_SECRET);

import { encrypt, decrypt, signState, verifyState } from '@/lib/utils/crypto';

// ─── encrypt / decrypt ───

describe('encrypt / decrypt', () => {
  it('encrypts and decrypts a string correctly', () => {
    const original = 'my-secret-token-12345';
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it('produces different ciphertexts for the same plaintext (random IV)', () => {
    const original = 'same-text';
    const encrypted1 = encrypt(original);
    const encrypted2 = encrypt(original);
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('both encrypt results decrypt to the same value', () => {
    const original = 'same-text';
    const encrypted1 = encrypt(original);
    const encrypted2 = encrypt(original);
    expect(decrypt(encrypted1)).toBe(original);
    expect(decrypt(encrypted2)).toBe(original);
  });

  it('encrypted format is iv:ciphertext', () => {
    const encrypted = encrypt('test');
    const parts = encrypted.split(':');
    expect(parts).toHaveLength(2);
    expect(parts[0]).toHaveLength(32); // 16 bytes = 32 hex chars
  });

  it('handles empty string', () => {
    const encrypted = encrypt('');
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe('');
  });

  it('handles long strings', () => {
    const long = 'a'.repeat(10000);
    const encrypted = encrypt(long);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(long);
  });

  it('handles special characters', () => {
    const special = '!@#$%^&*(){}[]"\'<>?/\\~`';
    const encrypted = encrypt(special);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(special);
  });

  it('throws on invalid encrypted text format', () => {
    expect(() => decrypt('invalid-no-colon')).toThrow();
  });
});

// ─── signState / verifyState ───

describe('signState / verifyState', () => {
  it('signs and verifies a state payload', () => {
    const payload = { instanceId: 'inst-123', timestamp: '1700000000' };
    const state = signState(payload);
    const verified = verifyState(state);
    expect(verified).toEqual(payload);
  });

  it('returns null for tampered state', () => {
    const payload = { instanceId: 'inst-123' };
    const state = signState(payload);

    // Tamper with the encoded part
    const [, sig] = state.split('.');
    const tampered = Buffer.from(JSON.stringify({ instanceId: 'hacked' })).toString('base64url');
    const result = verifyState(`${tampered}.${sig}`);
    expect(result).toBeNull();
  });

  it('returns null for state without separator', () => {
    expect(verifyState('no-separator-here')).toBeNull();
  });

  it('state format is encoded.signature', () => {
    const state = signState({ key: 'value' });
    const parts = state.split('.');
    expect(parts).toHaveLength(2);
    expect(parts[0].length).toBeGreaterThan(0);
    expect(parts[1].length).toBeGreaterThan(0);
  });

  it('different payloads produce different states', () => {
    const state1 = signState({ a: '1' });
    const state2 = signState({ a: '2' });
    expect(state1).not.toBe(state2);
  });
});
