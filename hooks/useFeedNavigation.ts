'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { buildFeedHref, createDefaultFilters } from '@/lib/filters';
import type { ArticleFilters } from '@/lib/types';

type FeedNavigation = {
  applyFilters: (next: ArticleFilters) => void;
  resetFilters: () => void;
  isPending: boolean;
};

export function useFeedNavigation({ today }: { today: string }): FeedNavigation {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const applyFilters = useCallback(
    (next: ArticleFilters) => {
      const href = buildFeedHref(next, today);
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [router, today],
  );

  const resetFilters = useCallback(() => {
    applyFilters(createDefaultFilters(today));
  }, [applyFilters, today]);

  return { applyFilters, resetFilters, isPending };
}
