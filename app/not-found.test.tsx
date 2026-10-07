// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from '@/app/not-found';

describe('NotFound', () => {
  it('shows the message and a link back to the feed', () => {
    render(<NotFound />);
    expect(screen.getByText('Không tìm thấy bài viết')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← quay lại feed' })).toHaveAttribute('href', '/');
  });
});
