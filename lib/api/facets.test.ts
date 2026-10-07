import type { AxiosInstance } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getApiClient } from '@/lib/api/client';
import { getCategories, getFeedFacets, getSources } from '@/lib/api/facets';
import { createHttpError } from '@/test/fixtures/axios';

vi.mock('@/lib/api/client', () => ({ getApiClient: vi.fn() }));

const get = vi.fn();
const range = { from: '2026-10-07', to: '2026-10-07' };
const expectedParams = {
  lang: 'vi',
  sort_at_from: '2026-10-07T00:00:00+07:00',
  sort_at_to: '2026-10-07T23:59:59.999+07:00',
};

beforeEach(() => {
  get.mockReset();
  vi.mocked(getApiClient).mockReturnValue({ get } as unknown as AxiosInstance);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getCategories / getSources', () => {
  it('sends only lang and sort_at bounds and maps facets', async () => {
    get.mockResolvedValue({ data: { items: [{ value: 'frontend', label: 'Frontend', article_count: 4 }] } });
    await expect(getCategories(range)).resolves.toEqual([{ value: 'frontend', label: 'Frontend', articleCount: 4 }]);
    expect(get).toHaveBeenCalledWith('/categories', { params: expectedParams });
  });

  it('omits cleared date bounds', async () => {
    get.mockResolvedValue({ data: { items: [] } });
    await getSources({ from: null, to: null });
    expect(get).toHaveBeenCalledWith('/sources', { params: { lang: 'vi' } });
  });

  it('throws an ApiError carrying the endpoint', async () => {
    get.mockRejectedValue(createHttpError(404, { error: { code: 'not_found', message: 'nope' } }));
    await expect(getSources(range)).rejects.toMatchObject({ endpoint: '/sources', status: 404, code: 'not_found' });
  });
});

describe('getFeedFacets', () => {
  it('returns both facet lists when both succeed', async () => {
    get.mockImplementation((endpoint: string) =>
      Promise.resolve({
        data: { items: [{ value: endpoint.slice(1), label: endpoint, article_count: 1 }] },
      }),
    );
    await expect(getFeedFacets(range)).resolves.toEqual({
      categories: [{ value: 'categories', label: '/categories', articleCount: 1 }],
      sources: [{ value: 'sources', label: '/sources', articleCount: 1 }],
    });
  });

  it('returns [] for a failed side, logs with context and never rejects', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    get.mockImplementation((endpoint: string) =>
      endpoint === '/categories'
        ? Promise.reject(createHttpError(404, { error: { code: 'not_found', message: 'nope' } }))
        : Promise.resolve({ data: { items: [{ value: 'infoq', label: 'InfoQ', article_count: 3 }] } }),
    );
    await expect(getFeedFacets(range)).resolves.toEqual({
      categories: [],
      sources: [{ value: 'infoq', label: 'InfoQ', articleCount: 3 }],
    });
    expect(consoleError).toHaveBeenCalledWith('[smartnews] facet request failed', {
      endpoint: '/categories',
      status: 404,
      code: 'not_found',
      range,
    });
  });

  it('resolves with two empty lists when both sides fail', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    get.mockRejectedValue(createHttpError(404, { error: { code: 'not_found', message: 'nope' } }));
    await expect(getFeedFacets(range)).resolves.toEqual({ categories: [], sources: [] });
  });
});
