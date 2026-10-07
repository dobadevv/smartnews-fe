'use client';

import { useEffect, useState } from 'react';
import type { ArticleFilters } from '@/lib/types';

export const SEARCH_DEBOUNCE_MS = 300;

type SearchBoxProps = {
  filters: ArticleFilters;
  onFiltersChange: (next: ArticleFilters) => void;
};

export function SearchBox({ filters, onFiltersChange }: SearchBoxProps) {
  const [value, setValue] = useState(filters.q);
  const [syncedQuery, setSyncedQuery] = useState(filters.q);

  // Adopt an external query change (e.g. reset) during render; remounting via `key` would drop focus.
  if (filters.q !== syncedQuery) {
    setSyncedQuery(filters.q);
    if (value.trim() !== filters.q) setValue(filters.q);
  }

  useEffect(() => {
    const query = value.trim();
    if (query === filters.q) return;
    const timer = setTimeout(() => onFiltersChange({ ...filters, q: query }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, filters, onFiltersChange]);

  return (
    <label className="flex items-center gap-3 rounded-control border border-border bg-bg px-[14px] transition-colors duration-150 ease-[ease] focus-within:border-accent-hover-border hover:border-accent-hover-border motion-reduce:transition-none">
      <span aria-hidden="true" className="font-mono text-[14px] text-accent">
        /
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Tìm theo tiêu đề hoặc summary…"
        aria-label="Tìm theo tiêu đề hoặc summary"
        className="min-w-0 flex-1 border-none bg-transparent py-3 text-[15px] outline-none"
      />
    </label>
  );
}
