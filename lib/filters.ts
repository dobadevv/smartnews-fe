import { ALL_OPTION } from '@/lib/constants';
import { getVietnamDateParts } from '@/lib/format';
import type { ArticleFilters } from '@/lib/types';

export type FeedSearchParams = Record<string, string | string[] | undefined>;

type DateKey = 'from' | 'to';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function getTodayInVietnam(now: Date = new Date()): string {
  const { year, month, day } = getVietnamDateParts(now);
  return `${year}-${month}-${day}`;
}

export function createDefaultFilters(): ArticleFilters {
  return { q: '', category: ALL_OPTION, source: ALL_OPTION, from: null, to: null };
}

export function parseFilters(searchParams: FeedSearchParams): ArticleFilters {
  return {
    q: (firstValue(searchParams.q) ?? '').trim(),
    category: parseOption(firstValue(searchParams.category)),
    source: parseOption(firstValue(searchParams.source)),
    from: parseDateParam(firstValue(searchParams.from)),
    to: parseDateParam(firstValue(searchParams.to)),
  };
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseOption(value: string | undefined): string {
  return value ? value : ALL_OPTION;
}

function parseDateParam(value: string | undefined): string | null {
  if (value === undefined || value === '') return null;
  return isValidIsoDate(value) ? value : null;
}

export function sanitizeFilters(input: unknown): ArticleFilters {
  const record = isRecord(input) ? input : {};
  return {
    q: typeof record.q === 'string' ? record.q.trim() : '',
    category: sanitizeOption(record.category),
    source: sanitizeOption(record.source),
    from: sanitizeDate(record.from),
    to: sanitizeDate(record.to),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizeOption(value: unknown): string {
  return typeof value === 'string' && value !== '' ? value : ALL_OPTION;
}

function sanitizeDate(value: unknown): string | null {
  if (value === null) return null;
  return typeof value === 'string' && isValidIsoDate(value) ? value : null;
}

export function buildFeedHref(filters: ArticleFilters): string {
  const params = new URLSearchParams();
  if (filters.q !== '') params.set('q', filters.q);
  if (filters.category !== ALL_OPTION) params.set('category', filters.category);
  if (filters.source !== ALL_OPTION) params.set('source', filters.source);
  appendDateParam({ params, key: 'from', value: filters.from });
  appendDateParam({ params, key: 'to', value: filters.to });
  const query = params.toString();
  return query === '' ? '/' : `/?${query}`;
}

function appendDateParam({
  params,
  key,
  value,
}: {
  params: URLSearchParams;
  key: DateKey;
  value: string | null;
}): void {
  if (value === null) return;
  params.set(key, value);
}

export function serializeFilters(filters: ArticleFilters): string {
  return JSON.stringify([filters.q, filters.category, filters.source, filters.from, filters.to]);
}
