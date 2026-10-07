// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type LoadMoreResult, loadMoreArticles } from '@/app/actions';
import { ArticleFeed } from '@/components/ArticleFeed';
import { createDefaultFilters } from '@/lib/filters';
import { createArticle } from '@/test/fixtures/articles';

vi.mock('@/app/actions', () => ({ loadMoreArticles: vi.fn() }));
const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));

const TODAY = '2026-10-07';
const filters = createDefaultFilters(TODAY);
const firstPage = [createArticle({ id: 1, title: 'Bài một' }), createArticle({ id: 2, title: 'Bài hai' })];

function renderFeed(initialNextCursor: string | null = 'cursor-2', initialItems = firstPage) {
  return render(
    <ArticleFeed filters={filters} initialItems={initialItems} initialNextCursor={initialNextCursor} today={TODAY} />,
  );
}

beforeEach(() => {
  vi.mocked(loadMoreArticles).mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ArticleFeed', () => {
  it('renders the zero-padded count heading and one card per article', () => {
    renderFeed();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('02Bài viết');
    expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Bài một',
      'Bài hai',
    ]);
  });

  it('appends the next page, dedupes, and updates the count and cursor', async () => {
    const user = userEvent.setup();
    vi.mocked(loadMoreArticles).mockResolvedValue({
      status: 'success',
      items: [createArticle({ id: 2, title: 'Bài hai' }), createArticle({ id: 3, title: 'Bài ba' })],
      nextCursor: null,
    });
    renderFeed();
    await user.click(screen.getByRole('button', { name: '↓ Tải thêm' }));
    expect(loadMoreArticles).toHaveBeenCalledWith(filters, 'cursor-2');
    expect(await screen.findByText('Bài ba')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('03Bài viết');
    expect(screen.queryByRole('button', { name: '↓ Tải thêm' })).toBeNull();
  });

  it('hides the button when there is no next cursor', () => {
    renderFeed(null);
    expect(screen.queryByRole('button', { name: '↓ Tải thêm' })).toBeNull();
  });

  it('shows the inline error on an error result and clears it on retry', async () => {
    const user = userEvent.setup();
    vi.mocked(loadMoreArticles).mockResolvedValueOnce({ status: 'error' });
    renderFeed();
    await user.click(screen.getByRole('button', { name: '↓ Tải thêm' }));
    expect(await screen.findByText('Không tải được thêm bài viết. Thử lại.')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);

    let resolveRetry: (result: LoadMoreResult) => void = () => {};
    vi.mocked(loadMoreArticles).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRetry = resolve;
      }),
    );
    await user.click(screen.getByRole('button', { name: '↓ Tải thêm' }));
    expect(screen.queryByText('Không tải được thêm bài viết. Thử lại.')).toBeNull();
    await act(async () => {
      resolveRetry({ status: 'success', items: [], nextCursor: null });
    });
  });

  it('shows the inline error and re-enables the button when the action call rejects', async () => {
    const user = userEvent.setup();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(loadMoreArticles).mockRejectedValue(new Error('Failed to fetch'));
    renderFeed();
    await user.click(screen.getByRole('button', { name: '↓ Tải thêm' }));
    expect(await screen.findByText('Không tải được thêm bài viết. Thử lại.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '↓ Tải thêm' })).toBeEnabled();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('calls the action only once on a rapid double click', () => {
    vi.mocked(loadMoreArticles).mockReturnValue(new Promise(() => {}));
    renderFeed();
    const button = screen.getByRole('button', { name: '↓ Tải thêm' });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(loadMoreArticles).toHaveBeenCalledTimes(1);
  });

  it('renders the empty state with a 00 count when there are no articles', () => {
    renderFeed(null, []);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('00Bài viết');
    expect(screen.getByText('Không có bài viết phù hợp')).toBeInTheDocument();
  });
});
