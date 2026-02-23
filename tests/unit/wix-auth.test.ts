import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getWixTokenByCode, getWixTokenByInstance } from '@/lib/services/wix-auth';

describe('wix auth token requests', () => {
  beforeEach(() => {
    vi.stubEnv('WIX_APP_ID', 'wix-app-id');
    vi.stubEnv('WIX_APP_SECRET', 'wix-app-secret');
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.vercel.app');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('sends client_credentials request as form-urlencoded', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'token', expires_in: 300 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await getWixTokenByInstance('instance-123');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = options.body as string;
    expect(body).toContain('grant_type=client_credentials');
    expect(body).toContain('client_id=wix-app-id');
    expect(body).toContain('client_secret=wix-app-secret');
    expect(body).toContain('instance_id=instance-123');
  });

  it('sends authorization_code request as form-urlencoded and includes redirect_uri', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'token', expires_in: 300 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await getWixTokenByCode('auth-code-123');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = options.body as string;
    expect(body).toContain('grant_type=authorization_code');
    expect(body).toContain('client_id=wix-app-id');
    expect(body).toContain('client_secret=wix-app-secret');
    expect(body).toContain('code=auth-code-123');
    expect(body).toContain(
      `redirect_uri=${encodeURIComponent('https://example.vercel.app/api/auth/wix/callback')}`,
    );
  });
});
