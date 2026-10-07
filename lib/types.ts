export type Article = {
  id: number;
  title: string;
  summary: string;
  category: string;
  source: string;
  publishedAt: string | null;
  sortAt: string;
  /** Already `&amp;`-decoded. */
  thumbnail: string | null;
  url: string;
};

export type ArticleDetail = Article & { content: string | null };

export type ArticleList = { items: Article[]; nextCursor: string | null };

export type Facet = { value: string; label: string; articleCount: number };

export type FeedFacets = { categories: Facet[]; sources: Facet[] };

/** 'YYYY-MM-DD' or null (= no bound). */
export type DateRange = { from: string | null; to: string | null };

/** `category` / `source` equal to ALL_OPTION mean "no filter". */
export type ArticleFilters = DateRange & { q: string; category: string; source: string };

export type ArticleQuery = ArticleFilters & { cursor?: string; limit: number };
