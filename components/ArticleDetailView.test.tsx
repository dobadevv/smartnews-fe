// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArticleDetailView } from '@/components/ArticleDetailView';
import { coindeskArticleDetail, releaseArticleDetail } from '@/test/fixtures/articles';

const NO_CONTENT = 'Chưa có nội dung chi tiết cho bài này — đọc bài gốc để xem đầy đủ.';

describe('ArticleDetailView', () => {
  it('renders a release with avatar heading, meta, paragraphs and source footer', () => {
    render(<ArticleDetailView article={releaseArticleDetail} />);
    expect(screen.getByRole('link', { name: '← quay lại feed' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Next.js v16.4.0-canary.61');
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('Release')).toBeInTheDocument();
    expect(screen.getByText('1 phút đọc')).toBeInTheDocument();
    expect(screen.getByText('Phiên bản này cải thiện cache trong Turbopack.')).toBeInTheDocument();
    expect(screen.getByText('github.com')).toBeInTheDocument();
    const original = screen.getByRole('link', { name: 'Đọc bài gốc ↗' });
    expect(original).toHaveAttribute('href', releaseArticleDetail.url);
    expect(original).toHaveAttribute('target', '_blank');
    expect(original).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a normal article with a high-priority hero image and the no-content note', () => {
    const { container } = render(<ArticleDetailView article={coindeskArticleDetail} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(coindeskArticleDetail.title);
    expect(screen.getByText(coindeskArticleDetail.summary)).toBeInTheDocument();
    expect(screen.getByText('06/10/2026')).toBeInTheDocument();
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('src', coindeskArticleDetail.thumbnail);
    expect(image).toHaveAttribute('fetchpriority', 'high');
    expect(screen.getByText(NO_CONTENT)).toBeInTheDocument();
  });

  it('treats whitespace-only content as no content', () => {
    render(<ArticleDetailView article={{ ...coindeskArticleDetail, content: ' \n\n  ' }} />);
    expect(screen.getByText(NO_CONTENT)).toBeInTheDocument();
  });

  it('shows only stripes for an unusable thumbnail', () => {
    const { container } = render(
      <ArticleDetailView article={{ ...coindeskArticleDetail, thumbnail: 'http://insecure.example.com/a.jpg' }} />,
    );
    expect(container.querySelector('img')).toBeNull();
  });
});
