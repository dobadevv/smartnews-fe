import Image from 'next/image';
import Link from 'next/link';
import { ReleaseThumb } from '@/components/ReleaseThumb';
import { getDisplayTitle } from '@/lib/articles';
import { extractDomain, formatDate, getHttpsImageUrl, isRelease, sourceLabel, truncate } from '@/lib/format';
import type { Article } from '@/lib/types';

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className="flex flex-col overflow-hidden rounded-card border border-border bg-surface text-text transition-[border-color,transform,translate] duration-200 ease-[ease] hover:-translate-y-0.5 hover:border-[rgba(216,165,72,0.45)] hover:text-text motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <ArticleCardMedia article={article} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex justify-between gap-3 font-mono text-[12px] uppercase tracking-[0.02em]">
          <span className="text-accent">{article.category}</span>
          <span className="text-muted">{formatDate(article.publishedAt)}</span>
        </div>
        <h3 className="font-heading text-[21px] font-semibold leading-[1.25] text-pretty text-text-bright">
          {getDisplayTitle(article)}
        </h3>
        <p className="text-[15px] text-text opacity-[0.82]">{truncate(article.summary)}</p>
        <p className="mt-auto pt-2 font-mono text-[12px] text-muted">
          {`${sourceLabel(article.source)} · ${extractDomain(article.url)}`}
        </p>
      </div>
    </Link>
  );
}

function ArticleCardMedia({ article }: { article: Article }) {
  const imageUrl = getHttpsImageUrl(article.thumbnail);
  return (
    <div className="relative aspect-video overflow-hidden border-b border-border bg-[repeating-linear-gradient(135deg,#1c1b14_0_10px,#191810_10px_20px)]">
      {isRelease(article) ? (
        <ReleaseThumb article={article} />
      ) : (
        imageUrl && (
          <Image src={imageUrl} alt="" fill className="object-cover" sizes="(max-width: 720px) 100vw, 360px" />
        )
      )}
    </div>
  );
}
