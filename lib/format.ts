import { VIETNAM_TIME_ZONE } from '@/lib/constants';
import type { Article } from '@/lib/types';

const SOURCE_LABELS = new Map<string, string>([
  ['nextjs-releases', 'Next.js'],
  ['coindesk', 'CoinDesk'],
  ['infoq', 'InfoQ'],
  ['cloudflare-blog', 'Cloudflare Blog'],
  ['the-new-stack', 'The New Stack'],
  ['aws-architecture-blog', 'AWS Architecture'],
  ['loki-releases', 'Grafana Loki'],
  ['nestjs-releases', 'NestJS'],
  ['deno-releases', 'Deno'],
  ['bun-releases', 'Bun'],
]);

const RELEASE_SOURCE_SUFFIX = '-releases';
const RELEASE_AVATAR_HOST = 'avatars.githubusercontent.com';
const UNDATED_LABEL = 'Release';
const DEFAULT_TRUNCATE_LIMIT = 150;
const WORD_BOUNDARY_TOLERANCE = 12;
const TRAILING_PUNCTUATION = /[\s,.;:—-]+$/;
const PARAGRAPH_SEPARATOR = /\n\s*\n/;

const vietnamDateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: VIETNAM_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function decodeThumb(url: string | null): string | null {
  return url === null ? null : url.replaceAll('&amp;', '&');
}

export function sourceLabel(slug: string): string {
  return SOURCE_LABELS.get(slug) ?? humanizeSlug(slug);
}

function humanizeSlug(slug: string): string {
  return slug
    .replace(/-releases$/, '')
    .split('-')
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function isRelease(article: Pick<Article, 'source' | 'thumbnail'>): boolean {
  if (article.source.endsWith(RELEASE_SOURCE_SUFFIX)) return true;
  return article.thumbnail !== null && parseUrl(article.thumbnail)?.hostname === RELEASE_AVATAR_HOST;
}

export function getVietnamDateParts(date: Date): { year: string; month: string; day: string } {
  const parts = vietnamDateFormatter.formatToParts(date);
  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return { year: valueOf('year'), month: valueOf('month'), day: valueOf('day') };
}

export function formatDate(iso: string | null): string {
  if (iso === null) return UNDATED_LABEL;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return UNDATED_LABEL;
  const { year, month, day } = getVietnamDateParts(date);
  return `${day}/${month}/${year}`;
}

export function truncate(text: string, limit = DEFAULT_TRUNCATE_LIMIT): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const kept = cut.slice(0, Math.max(cut.lastIndexOf(' '), limit - WORD_BOUNDARY_TOLERANCE));
  return `${kept.replace(TRAILING_PUNCTUATION, '')}…`;
}

export function splitParagraphs(content: string | null): string[] {
  if (content === null) return [];
  return content
    .split(PARAGRAPH_SEPARATOR)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function extractDomain(url: string): string {
  return parseUrl(url)?.hostname.replace(/^www\./, '') ?? '';
}

export function getHttpsImageUrl(url: string | null): string | null {
  if (url === null) return null;
  return parseUrl(url)?.protocol === 'https:' ? url : null;
}

function parseUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    // An unparsable URL is an expected data case (shown as "no domain" / "no image"), not a failure.
    return null;
  }
}
