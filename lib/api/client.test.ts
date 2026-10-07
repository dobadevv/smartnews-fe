import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('axios', () => ({ default: { create: vi.fn(() => ({ get: vi.fn() })) } }));

async function loadModules() {
  const axios = (await import('axios')).default;
  const { getApiClient } = await import('@/lib/api/client');
  return { axios, getApiClient };
}

describe('getApiClient', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('throws a descriptive error at first use when SMARTNEWS_SERVICE_URL is missing', async () => {
    vi.stubEnv('SMARTNEWS_SERVICE_URL', '');
    const { getApiClient } = await loadModules();
    expect(() => getApiClient()).toThrow('SMARTNEWS_SERVICE_URL is not set — copy .env.example to .env.local');
  });

  it('creates the axios instance with base URL, 10s timeout and the http adapter', async () => {
    vi.stubEnv('SMARTNEWS_SERVICE_URL', 'https://api.example.test');
    const { axios, getApiClient } = await loadModules();
    getApiClient();
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.example.test',
      timeout: 10000,
      adapter: 'http',
    });
  });

  it('memoizes the instance', async () => {
    vi.stubEnv('SMARTNEWS_SERVICE_URL', 'https://api.example.test');
    const { axios, getApiClient } = await loadModules();
    expect(getApiClient()).toBe(getApiClient());
    expect(axios.create).toHaveBeenCalledTimes(1);
  });
});
