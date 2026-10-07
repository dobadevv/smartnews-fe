// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ArticlePage, { generateMetadata, generateStaticParams, revalidate } from '@/app/articles/[id]/page';
import { getArticleById } from '@/lib/api/articles';
import { coindeskArticleDetail, releaseArticleDetail } from '@/test/fixtures/articles';

vi.mock('@/lib/api/articles', () => ({ getArticleById: vi.fn() }));
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

type SearchParams = Record<string, string | string[] | undefined>;

function createProps(id: string) {
  return { params: Promise.resolve({ id }), searchParams: Promise.resolve<SearchParams>({}) };
}

beforeEach(() => {
  vi.mocked(getArticleById).mockReset();
  vi.mocked(notFound).mockClear();
});

describe('article route config', () => {
  it('revalidates hourly and generates paths on first visit', async () => {
    expect(revalidate).toBe(3600);
    await expect(generateStaticParams()).resolves.toEqual([]);
  });
});

describe('ArticlePage', () => {
  it('renders the article for a valid id', async () => {
    vi.mocked(getArticleById).mockResolvedValue(releaseArticleDetail);
    render(await ArticlePage(createProps('130495')));
    expect(getArticleById).toHaveBeenCalledWith(130495);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Next.js v16.4.0-canary.61');
  });

  it.each(['abc', '0', '1.5', '99999999999999999999'])(
    'calls notFound for id %j without calling the API',
    async (id) => {
      await expect(ArticlePage(createProps(id))).rejects.toThrow('NEXT_NOT_FOUND');
      expect(getArticleById).not.toHaveBeenCalled();
    },
  );
});

describe('generateMetadata', () => {
  it('uses title, summary and the thumbnail for a normal article', async () => {
    vi.mocked(getArticleById).mockResolvedValue(coindeskArticleDetail);
    await expect(generateMetadata(createProps('130590'))).resolves.toEqual({
      title: coindeskArticleDetail.title,
      description: coindeskArticleDetail.summary,
      openGraph: {
        title: coindeskArticleDetail.title,
        description: coindeskArticleDetail.summary,
        images: [coindeskArticleDetail.thumbnail],
      },
    });
  });

  it('omits images for a release', async () => {
    vi.mocked(getArticleById).mockResolvedValue(releaseArticleDetail);
    const metadata = await generateMetadata(createProps('130495'));
    expect(metadata.title).toBe('Next.js v16.4.0-canary.61');
    expect(metadata.openGraph).toEqual({
      title: 'Next.js v16.4.0-canary.61',
      description: releaseArticleDetail.summary,
    });
  });

  it('omits images for an unusable thumbnail', async () => {
    vi.mocked(getArticleById).mockResolvedValue({ ...coindeskArticleDetail, thumbnail: '/relative.jpg' });
    const metadata = await generateMetadata(createProps('130590'));
    expect(metadata.openGraph).not.toHaveProperty('images');
  });

  it('calls notFound for an invalid id', async () => {
    await expect(generateMetadata(createProps('abc'))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(getArticleById).not.toHaveBeenCalled();
  });
});
