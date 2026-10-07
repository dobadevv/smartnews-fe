import type { AxiosInstance } from 'axios';
import { notFound } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getArticleById, getArticles } from '@/lib/api/articles';
import { getApiClient } from '@/lib/api/client';
import { ApiError } from '@/lib/api/errors';
import { coindeskArticle, releaseArticle, releaseArticleDetail } from '@/test/fixtures/articles';
import { createHttpError } from '@/test/fixtures/axios';
import { articleListRaw, releaseArticleDetailRaw } from '@/test/fixtures/rawArticles';

vi.mock('@/lib/api/client', () => ({ getApiClient: vi.fn() }));
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

const get = vi.fn();

beforeEach(() => {
  get.mockReset();
  vi.mocked(notFound).mockClear();
  vi.mocked(getApiClient).mockReturnValue({ get } as unknown as AxiosInstance);
});

const defaultQuery = { q: '', category: 'all', source: 'all', from: null, to: null, limit: 6 };

describe('getArticles', () => {
  it('sends only lang and limit for a default query and maps the response', async () => {
    get.mockResolvedValue({ data: articleListRaw });
    const result = await getArticles(defaultQuery);
    expect(get).toHaveBeenCalledWith('/articles', { params: { lang: 'vi', limit: 6 } });
    expect(result).toEqual({ items: [releaseArticle, coindeskArticle], nextCursor: 'cursor-page-2' });
  });

  it('sends every non-empty filter with snake_case date bounds', async () => {
    get.mockResolvedValue({ data: articleListRaw });
    await getArticles({
      q: 'rust',
      category: 'frontend',
      source: 'infoq',
      from: '2026-10-01',
      to: '2026-10-07',
      cursor: 'cursor-page-2',
      limit: 6,
    });
    expect(get).toHaveBeenCalledWith('/articles', {
      params: {
        lang: 'vi',
        q: 'rust',
        category: 'frontend',
        source: 'infoq',
        sort_at_from: '2026-10-01T00:00:00+07:00',
        sort_at_to: '2026-10-07T23:59:59.999+07:00',
        cursor: 'cursor-page-2',
        limit: 6,
      },
    });
  });

  it('throws an ApiError with endpoint, status and code on failure', async () => {
    get.mockRejectedValue(createHttpError(400, { error: { code: 'invalid_limit', message: 'bad' } }));
    await expect(getArticles(defaultQuery)).rejects.toMatchObject({
      name: 'ApiError',
      endpoint: '/articles',
      status: 400,
      code: 'invalid_limit',
    });
  });
});

describe('getArticleById', () => {
  it('requests the article with lang and maps the detail', async () => {
    get.mockResolvedValue({ data: releaseArticleDetailRaw });
    await expect(getArticleById(130495)).resolves.toEqual(releaseArticleDetail);
    expect(get).toHaveBeenCalledWith('/articles/130495', { params: { lang: 'vi' } });
  });

  it('calls notFound for 404 article_not_found', async () => {
    get.mockRejectedValue(createHttpError(404, { error: { code: 'article_not_found', message: 'missing' } }));
    await expect(getArticleById(1)).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('throws ApiError for other failures without calling notFound', async () => {
    get.mockRejectedValue(createHttpError(500, { error: { code: 'internal', message: 'boom' } }));
    await expect(getArticleById(2)).rejects.toBeInstanceOf(ApiError);
    expect(notFound).not.toHaveBeenCalled();
  });

  it('treats a 404 with a different code as an ApiError', async () => {
    get.mockRejectedValue(createHttpError(404, { error: { code: 'not_found', message: 'route' } }));
    await expect(getArticleById(3)).rejects.toMatchObject({ status: 404, code: 'not_found' });
    expect(notFound).not.toHaveBeenCalled();
  });
});
