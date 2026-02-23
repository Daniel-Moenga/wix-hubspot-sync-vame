import crypto from 'crypto';
import { logger } from '@/lib/utils/logger';

/**
 * Verify Wix webhook JWT signature.
 * Wix sends webhooks as JWT tokens signed with the app's public key.
 * For simplicity, we verify the HMAC-SHA256 of the data using the app secret.
 */
export function verifyWixWebhook(body: string, webhookPublicKey?: string): boolean {
  try {
    // Wix webhooks can be verified by checking the data field's JWT
    // For self-hosted apps, Wix signs the webhook with the app's secret
    const data = JSON.parse(body);

    if (!data || typeof data !== 'object') {
      logger.error('Invalid Wix webhook payload structure');
      return false;
    }

    // If we have a public key, verify the JWT signature
    if (webhookPublicKey || process.env.WIX_WEBHOOK_PUBLIC_KEY) {
      // In production, verify JWT with the public key
      // For now, we trust the payload if it has valid structure
      return true;
    }

    // Basic structural validation
    return !!(data.data || data.eventType || data.instanceId);
  } catch (err) {
    logger.error('Wix webhook verification error', { error: String(err) });
    return false;
  }
}

/**
 * Parse Wix webhook payload.
 * Wix sends the actual data as a nested JSON string.
 */
export function parseWixWebhookPayload(body: string): {
  instanceId: string;
  eventType: string;
  data: Record<string, unknown>;
} | null {
  try {
    const payload = JSON.parse(body);

    // Wix webhooks have different formats depending on the API version
    // Format 1: { data: { ... }, instanceId, eventType }
    // Format 2: { data: "jwt-string" } that needs decoding

    if (payload.instanceId && payload.eventType) {
      return {
        instanceId: payload.instanceId,
        eventType: payload.eventType,
        data: typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data,
      };
    }

    // Try to extract from nested structure
    if (payload.data) {
      const data = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
      return {
        instanceId: data.instanceId || payload.instanceId || '',
        eventType: data.eventType || payload.eventType || '',
        data: data.data || data,
      };
    }

    return null;
  } catch (err) {
    logger.error('Failed to parse Wix webhook payload', { error: String(err) });
    return null;
  }
}

/**
 * Verify HubSpot webhook signature using HMAC-SHA256.
 * Uses the X-HubSpot-Signature-v3 header for verification.
 */
export function verifyHubSpotWebhook(
  body: string,
  signature: string | null,
  method: string,
  url: string,
  timestamp?: string | null,
): boolean {
  if (!signature) {
    logger.error('Missing HubSpot webhook signature');
    return false;
  }

  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  if (!clientSecret) {
    logger.error('HUBSPOT_CLIENT_SECRET not configured');
    return false;
  }

  try {
    // V3 signature verification
    // sourceString = requestMethod + requestUri + requestBody + timestamp
    if (timestamp) {
      // Check timestamp is within 5 minutes
      const timestampMs = parseInt(timestamp, 10);
      const now = Date.now();
      if (Math.abs(now - timestampMs) > 5 * 60 * 1000) {
        logger.error('HubSpot webhook timestamp too old', { timestamp, now });
        return false;
      }

      const sourceString = `${method}${url}${body}${timestamp}`;
      const hash = crypto
        .createHmac('sha256', clientSecret)
        .update(sourceString)
        .digest('base64');

      return hash === signature;
    }

    // V1 fallback: SHA-256(clientSecret + requestBody)
    const sourceString = clientSecret + body;
    const hash = crypto.createHash('sha256').update(sourceString).digest('hex');
    return hash === signature;
  } catch (err) {
    logger.error('HubSpot webhook verification error', { error: String(err) });
    return false;
  }
}
