import 'server-only';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { ALL_OPTION } from '@/lib/constants';
import type { ArticleDetail, ArticleList, ArticleQuery } from '@/lib/types';
import { getApiClient } from './client';
import { type ApiError, toApiError } from './errors';
import { toArticleDetail, toArticleList } from './mappers';
import { type QueryParams, toSortAtParams, withLanguage } from './params';
import type { ArticleDetailRaw, ArticleListRaw } from './types';

const ARTICLES_ENDPOINT = '/articles';
const ARTICLE_NOT_FOUND_CODE = 'article_not_found';
const HTTP_NOT_FOUND = 404;

export async function getArticles(query: ArticleQuery): Promise<ArticleList> {
  const client = getApiClient();
  try {
    const { data } = await client.get<ArticleListRaw>(ARTICLES_ENDPOINT, { params: toArticleListParams(query) });
    return toArticleList(data);
  } catch (error) {
    throw toApiError(error, ARTICLES_ENDPOINT);
  }
}

function toArticleListParams(query: ArticleQuery): QueryParams {
  const params: QueryParams = { ...toSortAtParams(query), limit: query.limit };
  if (query.q !== '') params.q = query.q;
  if (query.category !== ALL_OPTION) params.category = query.category;
  if (query.source !== ALL_OPTION) params.source = query.source;
  if (query.cursor) params.cursor = query.cursor;
  return withLanguage(params);
}

async function fetchArticleById(id: number): Promise<ArticleDetail> {
  const endpoint = `${ARTICLES_ENDPOINT}/${id}`;
  const client = getApiClient();
  try {
    const { data } = await client.get<ArticleDetailRaw>(endpoint, { params: withLanguage() });
    return toArticleDetail(data);
  } catch (error) {
    const apiError = toApiError(error, endpoint);
    if (isArticleNotFound(apiError)) notFound();
    throw apiError;
  }
}

function isArticleNotFound(error: ApiError): boolean {
  return error.status === HTTP_NOT_FOUND && error.code === ARTICLE_NOT_FOUND_CODE;
}

/** Cached per request so `generateMetadata` and the page share one API call. */
export const getArticleById = cache(fetchArticleById);
