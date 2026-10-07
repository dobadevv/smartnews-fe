// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';

const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

describe('EmptyState', () => {
  it('shows the message and resets filters to /', async () => {
    const user = userEvent.setup();
    render(<EmptyState />);

    expect(screen.getByText('Không có bài viết phù hợp')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Đặt về mặc định' }));
    expect(mockReplace).toHaveBeenCalledWith('/', { scroll: false });
  });
});
