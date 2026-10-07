'use client';

import { useState } from 'react';
import { loadMoreArticles } from '@/app/actions';
import { ArticleCard } from '@/components/ArticleCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadMore } from '@/components/LoadMore';
import { mergeArticles } from '@/lib/articles';
import type { Article, ArticleFilters } from '@/lib/types';

type ArticleFeedProps = {
  filters: ArticleFilters;
  initialItems: Article[];
  initialNextCursor: string | null;
};

export function ArticleFeed({ filters, initialItems, initialNextCursor }: ArticleFeedProps) {
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  async function handleLoadMore() {
    if (nextCursor === null || isLoading) return;
    setIsLoading(true);
    setHasLoadError(false);
    try {
      const result = await loadMoreArticles(filters, nextCursor);
      if (result.status === 'success') {
        setItems((current) => mergeArticles(current, result.items));
        setNextCursor(result.nextCursor);
      } else {
        setHasLoadError(true);
      }
    } catch (error) {
      console.error('[smartnews] load more request failed', { cursor: nextCursor, error });
      setHasLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2 className="mb-[clamp(24px,4vw,40px)] flex items-baseline gap-3 font-mono text-[clamp(20px,3vw,30px)] font-normal uppercase tracking-[0.02em] text-text-bright">
        <span className="text-accent">{formatArticleCount(items.length)}</span>Bài viết
      </h2>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
      {nextCursor !== null && <LoadMore onLoadMore={handleLoadMore} isLoading={isLoading} />}
      {hasLoadError && (
        <p role="status" className="mt-3 text-center font-mono text-[13px] text-muted">
          Không tải được thêm bài viết. Thử lại.
        </p>
      )}
    </>
  );
}

function formatArticleCount(count: number): string {
  return String(count).padStart(2, '0');
}
