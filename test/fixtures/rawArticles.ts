import type { ArticleDetailRaw, ArticleListRaw, ArticleRaw } from '@/lib/api/types';
import { coindeskArticle, releaseArticle, releaseArticleDetail } from '@/test/fixtures/articles';

export const releaseArticleRaw: ArticleRaw = {
  id: releaseArticle.id,
  title: releaseArticle.title,
  summary: releaseArticle.summary,
  category: releaseArticle.category,
  source: releaseArticle.source,
  published_at: null,
  sort_at: releaseArticle.sortAt,
  thumbnail: 'https://avatars.githubusercontent.com/in/3491438?s=60&amp;v=4',
  url: releaseArticle.url,
};

export const coindeskArticleRaw: ArticleRaw = {
  id: coindeskArticle.id,
  title: coindeskArticle.title,
  summary: coindeskArticle.summary,
  category: coindeskArticle.category,
  source: coindeskArticle.source,
  published_at: coindeskArticle.publishedAt,
  sort_at: coindeskArticle.sortAt,
  thumbnail:
    'https://cdn.sanity.io/images/s3y3vcno/production/f2ac925a7a768a3a034001f0cf6c3ecdc6749b81-4000x2250.jpg?fm=jpg&amp;w=1920&amp;h=1080&amp;crop=focalpoint&amp;fit=clip',
  url: coindeskArticle.url,
};

export const releaseArticleDetailRaw: ArticleDetailRaw = {
  ...releaseArticleRaw,
  content: releaseArticleDetail.content,
};

export const articleListRaw: ArticleListRaw = {
  items: [releaseArticleRaw, coindeskArticleRaw],
  next_cursor: 'cursor-page-2',
};
