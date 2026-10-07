export type ArticleRaw = {
  id: number;
  title: string;
  summary: string;
  category: string;
  source: string;
  published_at: string | null;
  sort_at: string;
  thumbnail: string | null;
  url: string;
};

export type ArticleDetailRaw = ArticleRaw & { content: string | null };

export type ArticleListRaw = { items: ArticleRaw[]; next_cursor: string | null };

export type FacetRaw = { value: string; label: string; article_count: number };

export type FacetListRaw = { items: FacetRaw[] };

export type ApiErrorBody = { error: { code: string; message: string } };
