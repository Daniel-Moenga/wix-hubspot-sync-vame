import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

function makeInstanceJwt(payload: Record<string, string>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.signature`;
}

async function importWixCallbackRoute({
  getWixTokenByInstance = vi.fn(),
  getWixTokenByCode = vi.fn(),
  storeWixInstallation = vi.fn(),
} = {}) {
  const countDocuments = vi.fn().mockResolvedValue(1);
  const insertMany = vi.fn().mockResolvedValue(undefined);
  const collection = vi.fn((name: string) => {
    if (name === 'field_mappings') {
      return { countDocuments, insertMany };
    }
    return {};
  });

  vi.doMock('@/lib/services/wix-auth', () => ({
    getWixTokenByInstance,
    getWixTokenByCode,
    storeWixInstallation,
  }));
  vi.doMock('@/lib/db', () => ({
    getDb: vi.fn().mockResolvedValue({ collection }),
  }));

  const route = await import('@/app/api/auth/wix/callback/route');
  return { GET: route.GET, getWixTokenByInstance, getWixTokenByCode, storeWixInstallation };
}

afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('wix install route', () => {
  it('redirects to wix installer and preserves token when present', async () => {
    vi.stubEnv('WIX_APP_ID', 'app-123');
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.vercel.app');
    const route = await import('@/app/api/auth/wix/install/route');
    const req = new NextRequest('https://example.vercel.app/api/auth/wix/install?token=test-token');

    const res = await route.GET(req);
    const location = res.headers.get('location');

    expect(res.status).toBe(307);
    expect(location).toContain('https://www.wix.com/installer/install');
    expect(location).toContain('token=test-token');
    expect(location).toContain('appId=app-123');
    expect(location).toContain(
      `redirectUrl=${encodeURIComponent('https://example.vercel.app/api/auth/wix/callback')}`,
    );
  });

  it('redirects to wix installer without token in manual entry path', async () => {
    vi.stubEnv('WIX_APP_ID', 'app-123');
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.vercel.app');
    const route = await import('@/app/api/auth/wix/install/route');
    const req = new NextRequest('https://example.vercel.app/api/auth/wix/install');

    const res = await route.GET(req);
    const location = res.headers.get('location');

    expect(res.status).toBe(307);
    expect(location).toContain('https://www.wix.com/installer/install');
    expect(location).not.toContain('token=');
    expect(location).toContain('appId=app-123');
  });
});

describe('wix callback route', () => {
  it('resolves instanceId from instance JWT and uses oauth_only flow A', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.vercel.app');
    vi.stubEnv('WIX_AUTH_MODE', 'oauth_only');

    const getWixTokenByInstance = vi
      .fn()
      .mockResolvedValue({ access_token: 'wix-access', expires_in: 300 });
    const getWixTokenByCode = vi.fn();
    const storeWixInstallation = vi.fn().mockResolvedValue(undefined);
    const { GET } = await importWixCallbackRoute({
      getWixTokenByInstance,
      getWixTokenByCode,
      storeWixInstallation,
    });

    const jwt = makeInstanceJwt({ instanceId: 'instance-abc' });
    const req = new NextRequest(
      `https://example.vercel.app/api/auth/wix/callback?instance=${jwt}`,
    );

    const res = await GET(req);
    const location = res.headers.get('location') || '';

    expect(getWixTokenByInstance).toHaveBeenCalledWith('instance-abc', expect.any(String));
    expect(getWixTokenByCode).not.toHaveBeenCalled();
    expect(storeWixInstallation).toHaveBeenCalledWith(
      'instance-abc',
      expect.objectContaining({ access_token: 'wix-access' }),
    );
    expect(location).toContain('wix.com/installer/close-window');
    expect(res.headers.get('cross-origin-opener-policy')).toBe('unsafe-none');
  });

  it('uses legacy_only flow B when code is present', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.vercel.app');
    vi.stubEnv('WIX_AUTH_MODE', 'legacy_only');

    const getWixTokenByInstance = vi.fn();
    const getWixTokenByCode = vi
      .fn()
      .mockResolvedValue({ access_token: 'legacy-access', expires_in: 300 });
    const storeWixInstallation = vi.fn().mockResolvedValue(undefined);
    const { GET } = await importWixCallbackRoute({
      getWixTokenByInstance,
      getWixTokenByCode,
      storeWixInstallation,
    });

    const req = new NextRequest(
      'https://example.vercel.app/api/auth/wix/callback?instanceId=instance-legacy&code=auth-1',
    );

    const res = await GET(req);

    expect(getWixTokenByInstance).not.toHaveBeenCalled();
    expect(getWixTokenByCode).toHaveBeenCalledWith('auth-1', expect.any(String));
    expect(storeWixInstallation).toHaveBeenCalledWith(
      'instance-legacy',
      expect.objectContaining({ access_token: 'legacy-access' }),
    );
    expect(res.headers.get('cross-origin-opener-policy')).toBe('unsafe-none');
  });

  it('fails if token succeeds but no resolvable instance id is available for storage', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.vercel.app');
    vi.stubEnv('WIX_AUTH_MODE', 'legacy_only');

    const getWixTokenByCode = vi
      .fn()
      .mockResolvedValue({ access_token: 'legacy-access', expires_in: 300 });
    const storeWixInstallation = vi.fn();
    const { GET } = await importWixCallbackRoute({
      getWixTokenByCode,
      storeWixInstallation,
    });

    const req = new NextRequest(
      'https://example.vercel.app/api/auth/wix/callback?code=auth-only',
    );
    const res = await GET(req);
    const location = res.headers.get('location') || '';
    const decodedLocation = decodeURIComponent(location).replace(/\+/g, ' ');

    expect(storeWixInstallation).not.toHaveBeenCalled();
    expect(location).toContain('error=install_failed');
    expect(decodedLocation).toContain('Storage failed');
    expect(location).toContain('cid=');
    expect(res.headers.get('cross-origin-opener-policy')).toBe('unsafe-none');
  });
});
