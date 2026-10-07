// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FeedPage, { dynamic } from '@/app/page';
import { getArticles } from '@/lib/api/articles';
import { getFeedFacets } from '@/lib/api/facets';
import { coindeskArticle, releaseArticle } from '@/test/fixtures/articles';

vi.mock('@/lib/api/articles', () => ({ getArticles: vi.fn() }));
vi.mock('@/lib/api/facets', () => ({ getFeedFacets: vi.fn() }));
vi.mock('@/app/actions', () => ({ loadMoreArticles: vi.fn() }));
const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));

function createProps(searchParams: Record<string, string | string[] | undefined>) {
  return { params: Promise.resolve({}), searchParams: Promise.resolve(searchParams) };
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-07T03:00:00Z'));
  vi.mocked(getArticles).mockResolvedValue({ items: [releaseArticle, coindeskArticle], nextCursor: 'cursor-2' });
  vi.mocked(getFeedFacets).mockResolvedValue({
    categories: [{ value: 'frontend', label: 'frontend', articleCount: 1 }],
    sources: [],
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('FeedPage', () => {
  it('is always dynamic', () => {
    expect(dynamic).toBe('force-dynamic');
  });

  it('parses search params and fetches the first page and facets', async () => {
    render(await FeedPage(createProps({ category: 'frontend', from: '' })));
    expect(getArticles).toHaveBeenCalledWith({
      q: '',
      category: 'frontend',
      source: 'all',
      from: null,
      to: '2026-10-07',
      limit: 6,
    });
    expect(getFeedFacets).toHaveBeenCalledWith({ from: null, to: '2026-10-07' });
  });

  it('renders the intro, filter panel and feed', async () => {
    render(await FeedPage(createProps({})));
    expect(screen.getByText('Personal reader · Tin công nghệ được tuyển chọn')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Feed của tôi — luật của tôi.');
    expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('02Bài viết');
    expect(screen.getByRole('button', { name: '↓ Tải thêm' })).toBeInTheDocument();
  });

  it('propagates article list failures to the error boundary', async () => {
    vi.mocked(getArticles).mockRejectedValue(new Error('boom'));
    await expect(FeedPage(createProps({}))).rejects.toThrow('boom');
  });
});
