import { describe, expect, it } from 'vitest';
import {
  decodeThumb,
  extractDomain,
  formatDate,
  getHttpsImageUrl,
  isRelease,
  sourceLabel,
  splitParagraphs,
  truncate,
} from '@/lib/format';

describe('decodeThumb', () => {
  it('replaces every &amp; with &', () => {
    expect(decodeThumb('https://x.io/a.jpg?fm=jpg&amp;w=1920&amp;h=1080')).toBe(
      'https://x.io/a.jpg?fm=jpg&w=1920&h=1080',
    );
  });

  it('leaves an already decoded URL unchanged', () => {
    expect(decodeThumb('https://x.io/a.jpg?s=60&v=4')).toBe('https://x.io/a.jpg?s=60&v=4');
  });

  it('returns null for null', () => {
    expect(decodeThumb(null)).toBeNull();
  });
});

describe('sourceLabel', () => {
  it.each([
    ['nextjs-releases', 'Next.js'],
    ['coindesk', 'CoinDesk'],
    ['infoq', 'InfoQ'],
    ['cloudflare-blog', 'Cloudflare Blog'],
    ['the-new-stack', 'The New Stack'],
    ['aws-architecture-blog', 'AWS Architecture'],
    ['loki-releases', 'Grafana Loki'],
    ['nestjs-releases', 'NestJS'],
    ['deno-releases', 'Deno'],
    ['bun-releases', 'Bun'],
  ])('maps known slug %s to %s', (slug, label) => {
    expect(sourceLabel(slug)).toBe(label);
  });

  it('humanizes an unknown -releases slug', () => {
    expect(sourceLabel('rust-lang-releases')).toBe('Rust Lang');
  });

  it('humanizes an unknown multi-word slug', () => {
    expect(sourceLabel('hacker-news-daily')).toBe('Hacker News Daily');
  });

  it('humanizes slugs that collide with Object.prototype keys', () => {
    expect(sourceLabel('constructor')).toBe('Constructor');
  });
});

describe('isRelease', () => {
  it('is true when the source ends with -releases', () => {
    expect(isRelease({ source: 'deno-releases', thumbnail: null })).toBe(true);
  });

  it('is true when the thumbnail is a GitHub avatar', () => {
    expect(
      isRelease({ source: 'github', thumbnail: 'https://avatars.githubusercontent.com/u/1?s=60&v=4' }),
    ).toBe(true);
  });

  it('is false for a normal article', () => {
    expect(isRelease({ source: 'coindesk', thumbnail: 'https://cdn.sanity.io/a.jpg' })).toBe(false);
  });

  it('is false for a normal article without thumbnail', () => {
    expect(isRelease({ source: 'infoq', thumbnail: null })).toBe(false);
  });
});

describe('formatDate', () => {
  it('formats in Vietnam time, rolling a UTC evening to the next day', () => {
    expect(formatDate('2026-10-05T19:21:06+00:00')).toBe('06/10/2026');
  });

  it('keeps the same day when Vietnam time is still before midnight', () => {
    expect(formatDate('2026-10-05T16:00:00+00:00')).toBe('05/10/2026');
  });

  it('returns Release for null', () => {
    expect(formatDate(null)).toBe('Release');
  });

  it('returns Release for an unparsable value', () => {
    expect(formatDate('not-a-date')).toBe('Release');
  });
});

describe('truncate', () => {
  it('returns short text unchanged', () => {
    expect(truncate('short text', 150)).toBe('short text');
  });

  it('returns text exactly at the limit unchanged', () => {
    expect(truncate('abcde', 5)).toBe('abcde');
  });

  it('cuts at the last word boundary and appends an ellipsis', () => {
    expect(truncate('alpha beta gamma delta', 12)).toBe('alpha beta…');
  });

  it('strips trailing punctuation before the ellipsis', () => {
    expect(truncate('alpha, beta gamma', 7)).toBe('alpha…');
  });

  it('cuts mid-word when there is no space within the last 12 characters', () => {
    expect(truncate(`a ${'x'.repeat(30)}`, 20)).toBe('a xxxxxx…');
  });

  it('defaults to a 150 character limit', () => {
    const result = truncate('word '.repeat(60));
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(151);
  });
});

describe('splitParagraphs', () => {
  it('splits on blank lines and trims', () => {
    expect(splitParagraphs(' One.\n\nTwo. \n\nThree.')).toEqual(['One.', 'Two.', 'Three.']);
  });

  it('treats whitespace-only separator lines as blank lines', () => {
    expect(splitParagraphs('One.\n   \t\nTwo.')).toEqual(['One.', 'Two.']);
  });

  it('returns an empty list for null', () => {
    expect(splitParagraphs(null)).toEqual([]);
  });

  it('returns an empty list for whitespace-only content', () => {
    expect(splitParagraphs('  \n\n  ')).toEqual([]);
  });
});

describe('extractDomain', () => {
  it('returns the hostname without www.', () => {
    expect(extractDomain('https://www.coindesk.com/policy/x')).toBe('coindesk.com');
  });

  it('keeps other subdomains', () => {
    expect(extractDomain('https://blog.cloudflare.com/x')).toBe('blog.cloudflare.com');
  });

  it('returns an empty string for an invalid URL', () => {
    expect(extractDomain('not a url')).toBe('');
  });
});

describe('getHttpsImageUrl', () => {
  it('returns an https URL unchanged', () => {
    expect(getHttpsImageUrl('https://cdn.sanity.io/a.jpg?w=1&h=2')).toBe('https://cdn.sanity.io/a.jpg?w=1&h=2');
  });

  it.each([null, 'http://cdn.example.com/a.jpg', '/relative/a.jpg', 'garbage'])(
    'returns null for %s',
    (url) => {
      expect(getHttpsImageUrl(url)).toBeNull();
    },
  );
});
