import { ALL_OPTION } from '@/lib/constants';
import type { Facet } from '@/lib/types';

export type FacetOption = { value: string; label: string; count: number | null };

type BuildFacetOptionsInput = {
  facets: Facet[];
  activeValue: string;
  allLabel: string;
  toUnknownLabel: (value: string) => string;
};

export function buildFacetOptions({
  facets,
  activeValue,
  allLabel,
  toUnknownLabel,
}: BuildFacetOptionsInput): FacetOption[] {
  const options: FacetOption[] = [
    { value: ALL_OPTION, label: allLabel, count: sumArticleCounts(facets) },
    ...facets.map((facet) => ({ value: facet.value, label: facet.label, count: facet.articleCount })),
  ];
  const isActiveListed = activeValue === ALL_OPTION || facets.some((facet) => facet.value === activeValue);
  if (!isActiveListed) options.push({ value: activeValue, label: toUnknownLabel(activeValue), count: null });
  return options;
}

function sumArticleCounts(facets: Facet[]): number | null {
  if (facets.length === 0) return null;
  return facets.reduce((total, facet) => total + facet.articleCount, 0);
}
