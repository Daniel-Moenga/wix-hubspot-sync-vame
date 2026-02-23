import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'crypto';
import { verifyWixWebhook, parseWixWebhookPayload, verifyHubSpotWebhook } from '@/lib/services/webhook-verify';

// ─── verifyWixWebhook ───

describe('verifyWixWebhook', () => {
  it('returns true for valid payload with webhook key', () => {
    vi.stubEnv('WIX_WEBHOOK_PUBLIC_KEY', 'test-public-key');
    const body = JSON.stringify({ data: { instanceId: '123', eventType: 'contact.created' } });
    expect(verifyWixWebhook(body)).toBe(true);
    vi.unstubAllEnvs();
  });

  it('returns true for valid payload with structural check', () => {
    delete process.env.WIX_WEBHOOK_PUBLIC_KEY;
    const body = JSON.stringify({ data: { foo: 'bar' } });
    expect(verifyWixWebhook(body)).toBe(true);
  });

  it('returns false for invalid JSON', () => {
    expect(verifyWixWebhook('not-json')).toBe(false);
  });

  it('returns false for empty object without expected fields', () => {
    const body = JSON.stringify({});
    expect(verifyWixWebhook(body)).toBe(false);
  });
});

// ─── parseWixWebhookPayload ───

describe('parseWixWebhookPayload', () => {
  it('parses format 1: top-level instanceId and eventType', () => {
    const body = JSON.stringify({
      instanceId: 'inst-123',
      eventType: 'wix.contacts.v4.contact_created',
      data: { contact: { id: 'c1' } },
    });

    const result = parseWixWebhookPayload(body);
    expect(result).not.toBeNull();
    expect(result!.instanceId).toBe('inst-123');
    expect(result!.eventType).toBe('wix.contacts.v4.contact_created');
    expect(result!.data).toEqual({ contact: { id: 'c1' } });
  });

  it('parses format 2: data as JSON string', () => {
    const body = JSON.stringify({
      instanceId: 'inst-123',
      eventType: 'contact.created',
      data: JSON.stringify({ contact: { id: 'c2' } }),
    });

    const result = parseWixWebhookPayload(body);
    expect(result).not.toBeNull();
    expect(result!.data).toEqual({ contact: { id: 'c2' } });
  });

  it('parses nested structure', () => {
    const body = JSON.stringify({
      data: {
        instanceId: 'inst-456',
        eventType: 'contact.updated',
        data: { contact: { id: 'c3' } },
      },
    });

    const result = parseWixWebhookPayload(body);
    expect(result).not.toBeNull();
    expect(result!.instanceId).toBe('inst-456');
  });

  it('returns null for invalid JSON', () => {
    expect(parseWixWebhookPayload('bad-json')).toBeNull();
  });

  it('returns null for empty payload', () => {
    expect(parseWixWebhookPayload(JSON.stringify({}))).toBeNull();
  });
});

// ─── verifyHubSpotWebhook ───

describe('verifyHubSpotWebhook', () => {
  const CLIENT_SECRET = 'test-secret-12345';

  beforeEach(() => {
    vi.stubEnv('HUBSPOT_CLIENT_SECRET', CLIENT_SECRET);
  });

  it('returns false when signature is missing', () => {
    expect(verifyHubSpotWebhook('body', null, 'POST', 'https://example.com')).toBe(false);
  });

  it('returns false when client secret is missing', () => {
    vi.stubEnv('HUBSPOT_CLIENT_SECRET', '');
    delete process.env.HUBSPOT_CLIENT_SECRET;
    expect(verifyHubSpotWebhook('body', 'sig', 'POST', 'https://example.com')).toBe(false);
    vi.unstubAllEnvs();
  });

  it('verifies v3 signature correctly', () => {
    const body = '[{"eventId":1}]';
    const method = 'POST';
    const url = 'https://app.example.com/api/webhooks/hubspot';
    const timestamp = Date.now().toString();

    const sourceString = `${method}${url}${body}${timestamp}`;
    const expectedSig = crypto
      .createHmac('sha256', CLIENT_SECRET)
      .update(sourceString)
      .digest('base64');

    expect(verifyHubSpotWebhook(body, expectedSig, method, url, timestamp)).toBe(true);
  });

  it('rejects v3 signature with tampered body', () => {
    const method = 'POST';
    const url = 'https://app.example.com/api/webhooks/hubspot';
    const timestamp = Date.now().toString();

    const sourceString = `${method}${url}original-body${timestamp}`;
    const sig = crypto.createHmac('sha256', CLIENT_SECRET).update(sourceString).digest('base64');

    expect(verifyHubSpotWebhook('tampered-body', sig, method, url, timestamp)).toBe(false);
  });

  it('rejects v3 signature with expired timestamp', () => {
    const body = 'test-body';
    const method = 'POST';
    const url = 'https://example.com';
    const oldTimestamp = (Date.now() - 10 * 60 * 1000).toString(); // 10 minutes ago

    const sourceString = `${method}${url}${body}${oldTimestamp}`;
    const sig = crypto.createHmac('sha256', CLIENT_SECRET).update(sourceString).digest('base64');

    expect(verifyHubSpotWebhook(body, sig, method, url, oldTimestamp)).toBe(false);
  });

  it('verifies v1 fallback signature (no timestamp)', () => {
    const body = '[{"eventId":1}]';
    const sourceString = CLIENT_SECRET + body;
    const expectedSig = crypto.createHash('sha256').update(sourceString).digest('hex');

    expect(verifyHubSpotWebhook(body, expectedSig, 'POST', 'https://example.com')).toBe(true);
  });

  it('rejects v1 signature with wrong body', () => {
    const sourceString = CLIENT_SECRET + 'original-body';
    const sig = crypto.createHash('sha256').update(sourceString).digest('hex');

    expect(verifyHubSpotWebhook('tampered', sig, 'POST', 'https://example.com')).toBe(false);
  });
});
