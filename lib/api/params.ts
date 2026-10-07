import type { DateRange } from '@/lib/types';

export type QueryParams = Record<string, string | number>;

export const API_LANGUAGE = 'vi';

const VIETNAM_UTC_OFFSET = '+07:00';
const START_OF_DAY = 'T00:00:00';
const END_OF_DAY = 'T23:59:59.999';

export function withLanguage(params: QueryParams = {}): QueryParams {
  return { ...params, lang: API_LANGUAGE };
}

export function toSortAtParams(range: DateRange): QueryParams {
  const params: QueryParams = {};
  if (range.from !== null) params.sort_at_from = `${range.from}${START_OF_DAY}${VIETNAM_UTC_OFFSET}`;
  if (range.to !== null) params.sort_at_to = `${range.to}${END_OF_DAY}${VIETNAM_UTC_OFFSET}`;
  return params;
}
