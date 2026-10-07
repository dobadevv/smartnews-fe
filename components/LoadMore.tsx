'use client';

import { joinClassNames } from '@/lib/classNames';

type LoadMoreProps = { onLoadMore: () => void; isLoading: boolean };

export function LoadMore({ onLoadMore, isLoading }: LoadMoreProps) {
  return (
    <div className="mt-[clamp(32px,5vw,48px)] flex justify-center">
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isLoading}
        aria-busy={isLoading}
        className={joinClassNames(
          'cursor-pointer rounded-control border border-accent-hover-border bg-transparent px-[22px] py-3 font-mono text-[14px] font-medium text-accent hover:bg-accent-dim',
          isLoading && 'opacity-60',
        )}
      >
        ↓ Tải thêm
      </button>
    </div>
  );
}
