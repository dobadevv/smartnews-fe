import { describe, expect, it } from 'vitest';
import { buildFacetOptions } from '@/lib/facets';

const facets = [
  { value: 'frontend', label: 'Frontend', articleCount: 4 },
  { value: 'crypto', label: 'Crypto', articleCount: 6 },
];
const toUnknownLabel = (value: string) => `unknown:${value}`;

describe('buildFacetOptions', () => {
  it('prepends the all option with the summed count, keeping API order', () => {
    expect(buildFacetOptions({ facets, activeValue: 'all', allLabel: 'tất cả', toUnknownLabel })).toEqual([
      { value: 'all', label: 'tất cả', count: 10 },
      { value: 'frontend', label: 'Frontend', count: 4 },
      { value: 'crypto', label: 'Crypto', count: 6 },
    ]);
  });

  it('gives the all option no count when the facet list is empty', () => {
    expect(buildFacetOptions({ facets: [], activeValue: 'all', allLabel: 'tất cả', toUnknownLabel })).toEqual([
      { value: 'all', label: 'tất cả', count: null },
    ]);
  });

  it('appends the active value when it is not in the list', () => {
    expect(
      buildFacetOptions({ facets, activeValue: 'runtime', allLabel: 'tất cả', toUnknownLabel }).at(-1),
    ).toEqual({ value: 'runtime', label: 'unknown:runtime', count: null });
  });

  it('does not duplicate an active value that is in the list', () => {
    expect(buildFacetOptions({ facets, activeValue: 'crypto', allLabel: 'tất cả', toUnknownLabel })).toHaveLength(3);
  });
});
