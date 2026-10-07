import Image from 'next/image';
import Link from 'next/link';
import { estimateReadMinutes, getDisplayTitle } from '@/lib/articles';
import { extractDomain, formatDate, getHttpsImageUrl, isRelease, sourceLabel, splitParagraphs } from '@/lib/format';
import type { ArticleDetail } from '@/lib/types';

const SUMMARY_CLASS = 'mb-[clamp(28px,5vw,40px)] text-[clamp(16px,2vw,19px)] text-pretty text-muted';

export function ArticleDetailView({ article }: { article: ArticleDetail }) {
  const isReleaseArticle = isRelease(article);
  return (
    <article className="article-container pt-[clamp(32px,6vw,64px)] pb-[clamp(64px,9vw,116px)]">
      <Link href="/" className="mb-[clamp(28px,5vw,48px)] inline-flex gap-2 font-mono text-[14px]">
        ← quay lại feed
      </Link>
      <ArticleMeta article={article} />
      {isReleaseArticle ? (
        <ReleaseHeading article={article} />
      ) : (
        <h1 className="mb-5 font-heading text-[clamp(30px,5vw,46px)] font-semibold leading-[1.15] text-pretty text-text-bright">
          {getDisplayTitle(article)}
        </h1>
      )}
      <p className={SUMMARY_CLASS}>{article.summary}</p>
      {isReleaseArticle ? (
        <div className="mb-[clamp(28px,5vw,40px)] h-px bg-border" />
      ) : (
        <HeroImage thumbnail={article.thumbnail} />
      )}
      <ArticleBody content={article.content} />
      <ArticleSourceFooter url={article.url} />
    </article>
  );
}

function ArticleMeta({ article }: { article: ArticleDetail }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[13px] uppercase tracking-[0.02em]">
      <span className="rounded-full bg-accent-dim px-3 py-1 text-accent">{article.category}</span>
      <span className="text-muted">{sourceLabel(article.source)}</span>
      <span className="text-muted">{formatDate(article.publishedAt)}</span>
      <span className="text-muted">{`${estimateReadMinutes(article)} phút đọc`}</span>
    </div>
  );
}

function ReleaseHeading({ article }: { article: ArticleDetail }) {
  const avatarUrl = getHttpsImageUrl(article.thumbnail);
  return (
    <div className="mb-5 flex items-center gap-5">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-[14px] border border-accent bg-bg shadow-[0_0_0_8px_rgba(216,165,72,0.14)]">
        {avatarUrl && <Image src={avatarUrl} alt="" width={64} height={64} className="size-full object-cover" />}
      </div>
      <h1 className="font-heading text-[clamp(28px,4.5vw,42px)] font-semibold leading-[1.15] [word-break:break-word] text-text-bright">
        {getDisplayTitle(article)}
      </h1>
    </div>
  );
}

function HeroImage({ thumbnail }: { thumbnail: string | null }) {
  const imageUrl = getHttpsImageUrl(thumbnail);
  return (
    <div className="relative mb-[clamp(32px,5vw,48px)] aspect-video overflow-hidden rounded-card border border-border bg-[repeating-linear-gradient(135deg,#1c1b14_0_12px,#191810_12px_24px)]">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 760px) 100vw, 760px"
          fetchPriority="high"
        />
      )}
    </div>
  );
}

function ArticleBody({ content }: { content: string | null }) {
  const paragraphs = splitParagraphs(content);
  return (
    <div className="flex flex-col gap-[22px] text-[17px] leading-[1.75] text-text [overflow-wrap:anywhere]">
      {paragraphs.length === 0 ? (
        <p className="rounded-card border border-dashed border-border-strong p-5 font-mono text-[13px] text-muted">
          Chưa có nội dung chi tiết cho bài này — đọc bài gốc để xem đầy đủ.
        </p>
      ) : (
        paragraphs.map((paragraph, index) => (
          <p key={index} className="text-pretty">
            {paragraph}
          </p>
        ))
      )}
    </div>
  );
}

function ArticleSourceFooter({ url }: { url: string }) {
  return (
    <div className="mt-[clamp(40px,6vw,64px)] flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
      <span className="font-mono text-[13px] text-muted [overflow-wrap:anywhere]">{extractDomain(url)}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex gap-2 rounded-control bg-accent px-[22px] py-3 font-mono text-[14px] font-medium text-bg hover:text-bg hover:opacity-90"
      >
        Đọc bài gốc ↗
      </a>
    </div>
  );
}
