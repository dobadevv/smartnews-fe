import Image from 'next/image';
import { getReleaseVersion } from '@/lib/articles';
import { getHttpsImageUrl, sourceLabel } from '@/lib/format';
import type { Article } from '@/lib/types';

export function ReleaseThumb({ article }: { article: Article }) {
  const avatarUrl = getHttpsImageUrl(article.thumbnail);
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4 p-6">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-card border border-accent bg-bg shadow-[0_0_0_6px_rgba(216,165,72,0.14)]">
        {avatarUrl && <Image src={avatarUrl} alt="" width={56} height={56} className="size-full object-cover" />}
      </div>
      <div className="flex min-w-0 flex-col gap-[2px]">
        <span className="font-mono text-[12px] uppercase tracking-[0.04em] text-muted">
          {`${sourceLabel(article.source)} · release`}
        </span>
        <span className="truncate font-mono text-[18px] text-text-bright">{getReleaseVersion(article)}</span>
      </div>
    </div>
  );
}
