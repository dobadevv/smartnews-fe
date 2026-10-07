import { ArticleFeed } from '@/components/ArticleFeed';
import { FeedIntro } from '@/components/FeedIntro';
import { FilterPanel } from '@/components/FilterPanel';
import { getArticles } from '@/lib/api/articles';
import { getFeedFacets } from '@/lib/api/facets';
import { PAGE_SIZE } from '@/lib/constants';
import { getTodayInVietnam, parseFilters, serializeFilters } from '@/lib/filters';

export const dynamic = 'force-dynamic';

export default async function FeedPage({ searchParams }: PageProps<'/'>) {
  const today = getTodayInVietnam();
  const filters = parseFilters(await searchParams);
  const [articleList, facets] = await Promise.all([
    getArticles({ ...filters, limit: PAGE_SIZE }),
    getFeedFacets({ from: filters.from, to: filters.to }),
  ]);

  return (
    <section className="page-container pt-[clamp(48px,8vw,96px)] pb-[clamp(64px,9vw,116px)]">
      <FeedIntro />
      <FilterPanel filters={filters} facets={facets} today={today} />
      <ArticleFeed
        key={serializeFilters(filters)}
        filters={filters}
        initialItems={articleList.items}
        initialNextCursor={articleList.nextCursor}
      />
    </section>
  );
}
