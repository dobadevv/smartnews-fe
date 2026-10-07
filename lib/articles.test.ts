import { describe, expect, it } from 'vitest';
import {
  estimateReadMinutes,
  getDisplayTitle,
  getReleaseVersion,
  mergeArticles,
  parseArticleId,
} from '@/lib/articles';
import { bunReleaseArticle, coindeskArticle, createArticle, releaseArticle } from '@/test/fixtures/articles';

describe('getDisplayTitle', () => {
  it('prefixes a release title that starts with a version', () => {
    expect(getDisplayTitle(releaseArticle)).toBe('Next.js v16.4.0-canary.61');
  });

  it('keeps a release title that already names the project', () => {
    expect(getDisplayTitle(bunReleaseArticle)).toBe('Bun v1.3.13');
  });

  it('keeps a normal article title unchanged', () => {
    expect(getDisplayTitle(coindeskArticle)).toBe(coindeskArticle.title);
  });

  it('does not prefix a normal article whose title starts with v and a digit', () => {
    expect(getDisplayTitle(createArticle({ title: 'v2 của giao thức mới' }))).toBe('v2 của giao thức mới');
  });
});

describe('getReleaseVersion', () => {
  it('strips the leading source label', () => {
    expect(getReleaseVersion(bunReleaseArticle)).toBe('v1.3.13');
  });

  it('keeps a bare version unchanged', () => {
    expect(getReleaseVersion(releaseArticle)).toBe('v16.4.0-canary.61');
  });

  it('matches the label case-insensitively and escapes regex characters', () => {
    expect(getReleaseVersion({ title: 'next.js v16.0.0', source: 'nextjs-releases' })).toBe('v16.0.0');
    expect(getReleaseVersion({ title: 'Nextxjs v16.0.0', source: 'nextjs-releases' })).toBe('Nextxjs v16.0.0');
  });
});

describe('estimateReadMinutes', () => {
  it('divides the content word count by 220 and rounds', () => {
    expect(estimateReadMinutes({ content: 'từ '.repeat(440), summary: 'ngắn' })).toBe(2);
  });

  it('falls back to the summary when content is null', () => {
    expect(estimateReadMinutes({ content: null, summary: 'từ '.repeat(660) })).toBe(3);
  });

  it('falls back to the summary when content is whitespace only', () => {
    expect(estimateReadMinutes({ content: '  \n\n ', summary: 'từ '.repeat(660) })).toBe(3);
  });

  it('never returns less than 1', () => {
    expect(estimateReadMinutes({ content: 'một hai', summary: '' })).toBe(1);
  });
});

describe('parseArticleId', () => {
  it('parses a positive integer string', () => {
    expect(parseArticleId('130495')).toBe(130495);
  });

  it.each(['0', '-1', 'abc', '12abc', '1.5', '', ' 12', '99999999999999999999'])(
    'returns null for %j',
    (raw) => {
      expect(parseArticleId(raw)).toBeNull();
    },
  );
});

describe('mergeArticles', () => {
  it('appends incoming articles and skips ids already present', () => {
    const first = createArticle({ id: 1 });
    const second = createArticle({ id: 2 });
    const third = createArticle({ id: 3 });
    expect(mergeArticles([first, second], [second, third]).map((article) => article.id)).toEqual([1, 2, 3]);
  });

  it('skips duplicates inside the incoming page', () => {
    const first = createArticle({ id: 1 });
    const second = createArticle({ id: 2 });
    expect(mergeArticles([first], [second, second]).map((article) => article.id)).toEqual([1, 2]);
  });
});
