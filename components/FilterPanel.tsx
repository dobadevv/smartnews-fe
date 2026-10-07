'use client';

import { useCallback, useState } from 'react';
import { CategoryChips } from '@/components/CategoryChips';
import { DatePicker } from '@/components/DatePicker';
import { SearchBox } from '@/components/SearchBox';
import { SourceSelect } from '@/components/SourceSelect';
import { useFeedNavigation } from '@/hooks/useFeedNavigation';
import type { ArticleFilters, FeedFacets } from '@/lib/types';

export const POPOVER = { SOURCE: 'source', FROM: 'from', TO: 'to' } as const;
export type POPOVER = (typeof POPOVER)[keyof typeof POPOVER];

type FilterPanelProps = { filters: ArticleFilters; facets: FeedFacets; today: string };

export function FilterPanel({ filters, facets, today }: FilterPanelProps) {
  const { applyFilters, resetFilters } = useFeedNavigation({ today });
  const [openPopover, setOpenPopover] = useState<POPOVER | null>(null);

  const changePopover = useCallback((popover: POPOVER, open: boolean) => {
    setOpenPopover((current) => {
      if (open) return popover;
      // A late close from one popover must not close another that just opened.
      return current === popover ? null : current;
    });
  }, []);
  const handleSourceOpenChange = useCallback((open: boolean) => changePopover(POPOVER.SOURCE, open), [changePopover]);
  const handleFromOpenChange = useCallback((open: boolean) => changePopover(POPOVER.FROM, open), [changePopover]);
  const handleToOpenChange = useCallback((open: boolean) => changePopover(POPOVER.TO, open), [changePopover]);

  return (
    <div className="mb-[clamp(32px,5vw,48px)] flex flex-col gap-[18px] rounded-card border border-border bg-surface p-[22px]">
      <SearchBox filters={filters} onFiltersChange={applyFilters} />
      <CategoryChips filters={filters} categories={facets.categories} onFiltersChange={applyFilters} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] items-end gap-4">
        <SourceSelect
          filters={filters}
          sources={facets.sources}
          isOpen={openPopover === POPOVER.SOURCE}
          onOpenChange={handleSourceOpenChange}
          onFiltersChange={applyFilters}
        />
        <DatePicker
          label="Từ ngày"
          field="from"
          filters={filters}
          today={today}
          isOpen={openPopover === POPOVER.FROM}
          onOpenChange={handleFromOpenChange}
          onFiltersChange={applyFilters}
        />
        <DatePicker
          label="Đến ngày"
          field="to"
          filters={filters}
          today={today}
          isOpen={openPopover === POPOVER.TO}
          onOpenChange={handleToOpenChange}
          onFiltersChange={applyFilters}
        />
        <button
          type="button"
          onClick={resetFilters}
          className="cursor-pointer rounded-control border border-border bg-transparent px-[14px] py-[10px] font-mono text-[13px] text-muted transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-text motion-reduce:transition-none"
        >
          ↺ Đặt về mặc định
        </button>
      </div>
    </div>
  );
}
