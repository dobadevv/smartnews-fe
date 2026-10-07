'use server';

import { getArticles } from '@/lib/api/articles';
import { API_ERROR_CODE, ApiError } from '@/lib/api/errors';
import { PAGE_SIZE } from '@/lib/constants';
import { getTodayInVietnam, sanitizeFilters } from '@/lib/filters';
import type { Article, ArticleFilters } from '@/lib/types';

export type LoadMoreResult =
  | { status: 'success'; items: Article[]; nextCursor: string | null }
  | { status: 'error' };

const MAX_CURSOR_LENGTH = 512;

export async function loadMoreArticles(filters: ArticleFilters, cursor: string): Promise<LoadMoreResult> {
  const safeFilters = sanitizeFilters(filters, getTodayInVietnam());
  if (!isValidCursor(cursor)) return { status: 'error' };
  try {
    const page = await getArticles({ ...safeFilters, cursor, limit: PAGE_SIZE });
    return { status: 'success', items: page.items, nextCursor: page.nextCursor };
  } catch (error) {
    console.error('[smartnews] load more failed', {
      cursor,
      filters: safeFilters,
      status: error instanceof ApiError ? error.status : undefined,
      code: error instanceof ApiError ? error.code : API_ERROR_CODE.UNKNOWN,
    });
    return { status: 'error' };
  }
}

function isValidCursor(cursor: unknown): cursor is string {
  return typeof cursor === 'string' && cursor.length > 0 && cursor.length <= MAX_CURSOR_LENGTH;
}
