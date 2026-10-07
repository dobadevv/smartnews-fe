'use client';

import { useId } from 'react';
import { FIELD_LABEL_CLASS } from '@/components/fieldStyles';
import { joinClassNames } from '@/lib/classNames';
import { buildFacetOptions } from '@/lib/facets';
import type { ArticleFilters, Facet } from '@/lib/types';

const ALL_CATEGORIES_LABEL = 'tất cả';

type CategoryChipsProps = {
  filters: ArticleFilters;
  categories: Facet[];
  onFiltersChange: (next: ArticleFilters) => void;
};

export function CategoryChips({ filters, categories, onFiltersChange }: CategoryChipsProps) {
  const labelId = useId();
  const options = buildFacetOptions({
    facets: categories,
    activeValue: filters.category,
    allLabel: ALL_CATEGORIES_LABEL,
    toUnknownLabel: (value) => value,
  });

  function selectCategory(value: string) {
    if (value === filters.category) return;
    onFiltersChange({ ...filters, category: value });
  }

  return (
    <div className="flex flex-col gap-[10px]">
      <span id={labelId} className={FIELD_LABEL_CLASS}>
        Category
      </span>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2 font-mono text-[13px]">
        {options.map((option) => {
          const isActive = option.value === filters.category;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => selectCategory(option.value)}
              className={joinClassNames(
                'flex cursor-pointer gap-2 rounded-full border px-3 py-[5px] transition-colors motion-reduce:transition-none',
                isActive
                  ? 'border-accent bg-accent text-bg'
                  : 'border-transparent bg-accent-dim text-accent hover:border-accent-hover-border',
              )}
            >
              {option.label}
              {option.count !== null && <span className="opacity-60">{option.count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
