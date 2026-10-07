// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ArticleLoading from '@/app/articles/[id]/loading';

describe('ArticleLoading', () => {
  it('renders a busy article skeleton', () => {
    render(<ArticleLoading />);
    expect(screen.getByRole('article')).toHaveAttribute('aria-busy', 'true');
  });
});
