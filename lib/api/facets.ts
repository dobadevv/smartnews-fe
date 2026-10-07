import 'server-only';
import type { DateRange, Facet, FeedFacets } from '@/lib/types';
import { getApiClient } from './client';
import { API_ERROR_CODE, ApiError, toApiError } from './errors';
import { toFacet } from './mappers';
import { toSortAtParams, withLanguage } from './params';
import type { FacetListRaw } from './types';

const CATEGORIES_ENDPOINT = '/categories';
const SOURCES_ENDPOINT = '/sources';

async function getFacets(endpoint: string, range: DateRange): Promise<Facet[]> {
  const client = getApiClient();
  try {
    const { data } = await client.get<FacetListRaw>(endpoint, { params: withLanguage(toSortAtParams(range)) });
    return data.items.map(toFacet);
  } catch (error) {
    throw toApiError(error, endpoint);
  }
}

export function getCategories(range: DateRange): Promise<Facet[]> {
  return getFacets(CATEGORIES_ENDPOINT, range);
}

export function getSources(range: DateRange): Promise<Facet[]> {
  return getFacets(SOURCES_ENDPOINT, range);
}

export async function getFeedFacets(range: DateRange): Promise<FeedFacets> {
  const [categories, sources] = await Promise.allSettled([getCategories(range), getSources(range)]);
  return {
    categories: settleFacets(categories, range),
    sources: settleFacets(sources, range),
  };
}

function settleFacets(result: PromiseSettledResult<Facet[]>, range: DateRange): Facet[] {
  if (result.status === 'fulfilled') return result.value;
  logFacetFailure(result.reason, range);
  return [];
}

function logFacetFailure(reason: unknown, range: DateRange): void {
  const error =
    reason instanceof ApiError
      ? reason
      : new ApiError({ status: undefined, code: API_ERROR_CODE.UNKNOWN, endpoint: 'unknown', cause: reason });
  console.error('[smartnews] facet request failed', {
    endpoint: error.endpoint,
    status: error.status,
    code: error.code,
    range,
  });
}
