// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RouteError from '@/app/error';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('RouteError', () => {
  it('logs the error, shows the message and retries', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('boom');
    const retry = vi.fn();
    render(<RouteError error={error} retry={retry} />);
    expect(screen.getByText('Không tải được dữ liệu')).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith('[smartnews] route render failed', error);
    await user.click(screen.getByRole('button', { name: 'Thử lại' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
