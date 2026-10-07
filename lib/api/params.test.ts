import axios from 'axios';
import { describe, expect, it } from 'vitest';
import { toSortAtParams, withLanguage } from '@/lib/api/params';

describe('withLanguage', () => {
  it('adds lang=vi to empty params', () => {
    expect(withLanguage()).toEqual({ lang: 'vi' });
  });

  it('keeps other params and cannot be overridden', () => {
    expect(withLanguage({ limit: 6, lang: 'en' })).toEqual({ limit: 6, lang: 'vi' });
  });
});

describe('toSortAtParams', () => {
  it('maps a full range to Vietnam day bounds', () => {
    expect(toSortAtParams({ from: '2026-10-01', to: '2026-10-07' })).toEqual({
      sort_at_from: '2026-10-01T00:00:00+07:00',
      sort_at_to: '2026-10-07T23:59:59.999+07:00',
    });
  });

  it('omits null bounds', () => {
    expect(toSortAtParams({ from: null, to: null })).toEqual({});
    expect(toSortAtParams({ from: '2026-10-07', to: null })).toEqual({ sort_at_from: '2026-10-07T00:00:00+07:00' });
  });

  it('percent-encodes the + of the offset when axios serializes the URL', () => {
    const uri = axios.getUri({
      url: '/articles',
      params: withLanguage(toSortAtParams({ from: '2026-10-07', to: '2026-10-07' })),
    });
    expect(uri).toContain('sort_at_from=2026-10-07T00:00:00%2B07:00');
    expect(uri).toContain('sort_at_to=2026-10-07T23:59:59.999%2B07:00');
    expect(uri).not.toMatch(/T00:00:00\+07/);
  });
});
