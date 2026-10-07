import { describe, expect, it } from 'vitest';
import { toArticle, toArticleDetail, toArticleList, toFacet } from '@/lib/api/mappers';
import { coindeskArticle, releaseArticle, releaseArticleDetail } from '@/test/fixtures/articles';
import {
  articleListRaw,
  coindeskArticleRaw,
  releaseArticleDetailRaw,
  releaseArticleRaw,
} from '@/test/fixtures/rawArticles';

describe('mappers', () => {
  it('maps a raw article to camelCase and decodes the thumbnail', () => {
    expect(toArticle(coindeskArticleRaw)).toEqual(coindeskArticle);
    expect(toArticle(releaseArticleRaw)).toEqual(releaseArticle);
  });

  it('maps a raw article detail including content', () => {
    expect(toArticleDetail(releaseArticleDetailRaw)).toEqual(releaseArticleDetail);
  });

  it('maps a raw list and its cursor', () => {
    expect(toArticleList(articleListRaw)).toEqual({
      items: [releaseArticle, coindeskArticle],
      nextCursor: 'cursor-page-2',
    });
  });

  it('maps a raw facet', () => {
    expect(toFacet({ value: 'frontend', label: 'Frontend', article_count: 12 })).toEqual({
      value: 'frontend',
      label: 'Frontend',
      articleCount: 12,
    });
  });
});
