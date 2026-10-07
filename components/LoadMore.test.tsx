// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoadMore } from '@/components/LoadMore';

describe('LoadMore', () => {
  it('calls onLoadMore when clicked', async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    render(<LoadMore onLoadMore={onLoadMore} isLoading={false} />);
    await user.click(screen.getByRole('button', { name: '↓ Tải thêm' }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('is disabled and busy while loading, keeping its label', () => {
    render(<LoadMore onLoadMore={vi.fn()} isLoading />);
    const button = screen.getByRole('button', { name: '↓ Tải thêm' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});
