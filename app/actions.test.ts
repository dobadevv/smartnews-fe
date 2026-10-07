import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadMoreArticles } from '@/app/actions';
import { getArticles } from '@/lib/api/articles';
import { ApiError } from '@/lib/api/errors';
import { coindeskArticle } from '@/test/fixtures/articles';

vi.mock('@/lib/api/articles', () => ({ getArticles: vi.fn() }));

const TODAY = '2026-10-07';
const filters = { q: 'rust', category: 'frontend', source: 'all', from: TODAY, to: TODAY };

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-07T03:00:00Z'));
  vi.mocked(getArticles).mockReset();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('loadMoreArticles', () => {
  it('returns the next page with a fixed limit of 6', async () => {
    vi.mocked(getArticles).mockResolvedValue({ items: [coindeskArticle], nextCursor: 'cursor-3' });
    await expect(loadMoreArticles(filters, 'cursor-2')).resolves.toEqual({
      status: 'success',
      items: [coindeskArticle],
      nextCursor: 'cursor-3',
    });
    expect(getArticles).toHaveBeenCalledWith({ ...filters, cursor: 'cursor-2', limit: 6 });
  });

  it('sanitizes untrusted filters before calling the API', async () => {
    vi.mocked(getArticles).mockResolvedValue({ items: [], nextCursor: null });
    const untrusted = { q: 5, category: '', source: null, from: 'bad', to: null } as unknown as typeof filters;
    await loadMoreArticles(untrusted, 'cursor-2');
    expect(getArticles).toHaveBeenCalledWith({
      q: '',
      category: 'all',
      source: 'all',
      from: null,
      to: null,
      cursor: 'cursor-2',
      limit: 6,
    });
  });

  it.each(['', 'x'.repeat(513), 42 as unknown as string])('rejects invalid cursor %j without calling the API', async (cursor) => {
    await expect(loadMoreArticles(filters, cursor)).resolves.toEqual({ status: 'error' });
    expect(getArticles).not.toHaveBeenCalled();
  });

  it('returns an error result and logs context when the API fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(getArticles).mockRejectedValue(new ApiError({ status: 500, code: 'internal', endpoint: '/articles' }));
    await expect(loadMoreArticles(filters, 'cursor-2')).resolves.toEqual({ status: 'error' });
    expect(consoleError).toHaveBeenCalledWith('[smartnews] load more failed', {
      cursor: 'cursor-2',
      filters,
      status: 500,
      code: 'internal',
    });
  });
});
