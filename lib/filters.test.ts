import { describe, expect, it } from 'vitest';
import {
  buildFeedHref,
  createDefaultFilters,
  getTodayInVietnam,
  isValidIsoDate,
  parseFilters,
  sanitizeFilters,
  serializeFilters,
} from '@/lib/filters';

const TODAY = '2026-10-07';

describe('getTodayInVietnam', () => {
  it('returns the previous day just before Vietnam midnight', () => {
    expect(getTodayInVietnam(new Date('2026-10-06T16:59:59Z'))).toBe('2026-10-06');
  });

  it('rolls to the next day at Vietnam midnight', () => {
    expect(getTodayInVietnam(new Date('2026-10-06T17:00:00Z'))).toBe('2026-10-07');
  });
});

describe('isValidIsoDate', () => {
  it.each(['2026-10-07', '2024-02-29'])('accepts %s', (value) => {
    expect(isValidIsoDate(value)).toBe(true);
  });

  it.each(['2026-02-30', '2026-13-01', '2026-1-7', '07/10/2026', 'today', ''])('rejects %j', (value) => {
    expect(isValidIsoDate(value)).toBe(false);
  });
});

describe('parseFilters', () => {
  it('uses defaults when every key is absent', () => {
    expect(parseFilters({}, TODAY)).toEqual({ q: '', category: 'all', source: 'all', from: TODAY, to: TODAY });
  });

  it('treats a present but empty date as cleared', () => {
    expect(parseFilters({ from: '', to: '' }, TODAY)).toMatchObject({ from: null, to: null });
  });

  it('keeps valid dates and falls back to today for invalid ones', () => {
    expect(parseFilters({ from: '2026-10-01', to: '2026-02-30' }, TODAY)).toMatchObject({
      from: '2026-10-01',
      to: TODAY,
    });
  });

  it('passes an inverted range through unchanged', () => {
    expect(parseFilters({ from: '2026-10-09', to: '2026-10-01' }, TODAY)).toMatchObject({
      from: '2026-10-09',
      to: '2026-10-01',
    });
  });

  it('uses the first element of array values', () => {
    expect(parseFilters({ category: ['frontend', 'crypto'], q: ['rust', 'go'] }, TODAY)).toMatchObject({
      category: 'frontend',
      q: 'rust',
    });
  });

  it('trims the search query', () => {
    expect(parseFilters({ q: '  bảo mật  ' }, TODAY).q).toBe('bảo mật');
  });

  it('defaults empty category and source to all and ignores unknown keys', () => {
    expect(parseFilters({ category: '', source: '', cursor: 'abc' }, TODAY)).toEqual({
      q: '',
      category: 'all',
      source: 'all',
      from: TODAY,
      to: TODAY,
    });
  });
});

describe('sanitizeFilters', () => {
  it('normalizes a malformed object', () => {
    expect(
      sanitizeFilters({ q: 42, category: ['x'], source: '', from: 'yesterday', to: 7 }, TODAY),
    ).toEqual({ q: '', category: 'all', source: 'all', from: TODAY, to: TODAY });
  });

  it('keeps valid values and null (cleared) dates', () => {
    expect(
      sanitizeFilters({ q: ' rust ', category: 'frontend', source: 'infoq', from: null, to: '2026-10-05' }, TODAY),
    ).toEqual({ q: 'rust', category: 'frontend', source: 'infoq', from: null, to: '2026-10-05' });
  });

  it.each([null, undefined, 'string', 12])('returns defaults for non-object input %j', (input) => {
    expect(sanitizeFilters(input, TODAY)).toEqual(createDefaultFilters(TODAY));
  });
});

describe('buildFeedHref', () => {
  it('returns / when every filter is default', () => {
    expect(buildFeedHref(createDefaultFilters(TODAY), TODAY)).toBe('/');
  });

  it('writes cleared dates explicitly', () => {
    expect(buildFeedHref({ ...createDefaultFilters(TODAY), from: null }, TODAY)).toBe('/?from=');
  });

  it('orders keys q, category, source, from, to', () => {
    expect(
      buildFeedHref({ q: 'rust', category: 'frontend', source: 'infoq', from: '2026-10-01', to: null }, TODAY),
    ).toBe('/?q=rust&category=frontend&source=infoq&from=2026-10-01&to=');
  });

  it('encodes a Vietnamese query', () => {
    const href = buildFeedHref({ ...createDefaultFilters(TODAY), q: 'bảo mật' }, TODAY);
    expect(href).toBe('/?q=b%E1%BA%A3o+m%E1%BA%ADt');
    expect(new URLSearchParams(href.slice(2)).get('q')).toBe('bảo mật');
  });

  it('round-trips through parseFilters', () => {
    const filters = { q: 'c++ & rust', category: 'frontend', source: 'all', from: null, to: '2026-10-05' };
    const params = Object.fromEntries(new URLSearchParams(buildFeedHref(filters, TODAY).slice(2)));
    expect(parseFilters(params, TODAY)).toEqual(filters);
  });
});

describe('serializeFilters', () => {
  it('returns the same string for equal filters and different strings otherwise', () => {
    const filters = createDefaultFilters(TODAY);
    expect(serializeFilters({ ...filters })).toBe(serializeFilters(filters));
    expect(serializeFilters({ ...filters, from: null })).not.toBe(serializeFilters(filters));
  });
});
