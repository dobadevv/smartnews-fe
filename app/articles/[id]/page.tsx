import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleDetailView } from '@/components/ArticleDetailView';
import { getArticleById } from '@/lib/api/articles';
import { getDisplayTitle, parseArticleId } from '@/lib/articles';
import { getHttpsImageUrl, isRelease } from '@/lib/format';

export const revalidate = 3600;

export async function generateStaticParams() {
  // Empty list: no paths at build time; each article is rendered on first visit and cached (ISR).
  return [];
}

export async function generateMetadata({ params }: PageProps<'/articles/[id]'>): Promise<Metadata> {
  const article = await getArticleById(await resolveArticleId(params));
  const title = getDisplayTitle(article);
  const description = article.summary;
  const imageUrl = isRelease(article) ? null : getHttpsImageUrl(article.thumbnail);
  return {
    title,
    description,
    openGraph: { title, description, ...(imageUrl ? { images: [imageUrl] } : {}) },
  };
}

export default async function ArticlePage({ params }: PageProps<'/articles/[id]'>) {
  const article = await getArticleById(await resolveArticleId(params));
  return <ArticleDetailView article={article} />;
}

async function resolveArticleId(params: Promise<{ id: string }>): Promise<number> {
  const { id } = await params;
  const articleId = parseArticleId(id);
  if (articleId === null) notFound();
  return articleId;
}
