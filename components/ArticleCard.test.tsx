// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArticleCard } from '@/components/ArticleCard';
import { coindeskArticle, createArticle, releaseArticle } from '@/test/fixtures/articles';

describe('ArticleCard', () => {
  it('renders a normal article as a link with image, meta, truncated summary and footer', () => {
    const { container } = render(<ArticleCard article={coindeskArticle} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/articles/130590');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(coindeskArticle.title);
    expect(screen.getByText('crypto')).toBeInTheDocument();
    expect(screen.getByText('06/10/2026')).toBeInTheDocument();
    expect(screen.getByText(/…$/)).toBeInTheDocument();
    expect(screen.getByText('CoinDesk · coindesk.com')).toBeInTheDocument();
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('src', coindeskArticle.thumbnail);
    expect(image).toHaveAttribute('data-fill', 'true');
    expect(image).toHaveAttribute('alt', '');
  });

  it('renders a release with the release thumb, prefixed title and Release date', () => {
    render(<ArticleCard article={releaseArticle} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Next.js v16.4.0-canary.61');
    expect(screen.getByText('Next.js · release')).toBeInTheDocument();
    expect(screen.getByText('v16.4.0-canary.61')).toBeInTheDocument();
    expect(screen.getByText('Release')).toBeInTheDocument();
    expect(screen.getByText('Next.js · github.com')).toBeInTheDocument();
  });

  it('shows only the stripes when the article has no thumbnail', () => {
    const { container } = render(<ArticleCard article={createArticle({ thumbnail: null })} />);
    expect(container.querySelector('img')).toBeNull();
  });

  it.each(['http://insecure.example.com/a.jpg', '/relative.jpg', 'not a url'])(
    'shows only the stripes for unusable thumbnail %j',
    (thumbnail) => {
      const { container } = render(<ArticleCard article={createArticle({ thumbnail })} />);
      expect(container.querySelector('img')).toBeNull();
    },
  );

  it('renders an empty avatar box for a release without thumbnail', () => {
    const { container } = render(<ArticleCard article={{ ...releaseArticle, thumbnail: null }} />);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('Next.js · release')).toBeInTheDocument();
  });
});
