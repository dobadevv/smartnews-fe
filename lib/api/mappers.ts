import { decodeThumb } from '@/lib/format';
import type { Article, ArticleDetail, ArticleList, Facet } from '@/lib/types';
import type { ArticleDetailRaw, ArticleListRaw, ArticleRaw, FacetRaw } from './types';

export function toArticle(raw: ArticleRaw): Article {
  return {
    id: raw.id,
    title: raw.title,
    summary: raw.summary,
    category: raw.category,
    source: raw.source,
    publishedAt: raw.published_at,
    sortAt: raw.sort_at,
    thumbnail: decodeThumb(raw.thumbnail),
    url: raw.url,
  };
}

export function toArticleDetail(raw: ArticleDetailRaw): ArticleDetail {
  return { ...toArticle(raw), content: raw.content };
}

export function toArticleList(raw: ArticleListRaw): ArticleList {
  return { items: raw.items.map(toArticle), nextCursor: raw.next_cursor };
}

export function toFacet(raw: FacetRaw): Facet {
  return { value: raw.value, label: raw.label, articleCount: raw.article_count };
}
