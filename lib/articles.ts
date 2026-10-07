import { isRelease, sourceLabel } from '@/lib/format';
import type { Article, ArticleDetail } from '@/lib/types';

const VERSION_TITLE = /^v\d/i;
const WORDS_PER_MINUTE = 220;
const POSITIVE_INTEGER = /^\d+$/;

export function getDisplayTitle(article: Pick<Article, 'title' | 'source' | 'thumbnail'>): string {
  if (isRelease(article) && VERSION_TITLE.test(article.title)) {
    return `${sourceLabel(article.source)} ${article.title}`;
  }
  return article.title;
}

export function getReleaseVersion(article: Pick<Article, 'title' | 'source'>): string {
  const labelPrefix = new RegExp(`^${escapeRegExp(sourceLabel(article.source))}\\s+`, 'i');
  return article.title.replace(labelPrefix, '');
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function estimateReadMinutes(article: Pick<ArticleDetail, 'content' | 'summary'>): number {
  const text = article.content?.trim() ? article.content : article.summary;
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

export function parseArticleId(raw: string): number | null {
  if (!POSITIVE_INTEGER.test(raw)) return null;
  const id = Number(raw);
  return id > 0 && Number.isSafeInteger(id) ? id : null;
}

export function mergeArticles(current: Article[], incoming: Article[]): Article[] {
  const seenIds = new Set(current.map((article) => article.id));
  const fresh: Article[] = [];
  for (const article of incoming) {
    if (seenIds.has(article.id)) continue;
    seenIds.add(article.id);
    fresh.push(article);
  }
  return [...current, ...fresh];
}
