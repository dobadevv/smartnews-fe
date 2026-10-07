// @vitest-environment jsdom
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SearchBox } from './SearchBox';
import { createDefaultFilters } from '@/lib/filters';

const filters = createDefaultFilters('2026-10-07');

function getInput() {
  return screen.getByRole('searchbox', { name: 'Tìm theo tiêu đề hoặc summary' });
}

function advance(milliseconds: number) {
  act(() => {
    vi.advanceTimersByTime(milliseconds);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('SearchBox', () => {
  it('renders the placeholder and initial query', () => {
    render(<SearchBox filters={{ ...filters, q: 'rust' }} onFiltersChange={vi.fn()} />);
    expect(getInput()).toHaveValue('rust');
    expect(getInput()).toHaveAttribute('placeholder', 'Tìm theo tiêu đề hoặc summary…');
  });

  it('emits the trimmed query once, 300 ms after the last keystroke', () => {
    const onFiltersChange = vi.fn();
    render(<SearchBox filters={filters} onFiltersChange={onFiltersChange} />);
    fireEvent.change(getInput(), { target: { value: 'ru' } });
    advance(200);
    fireEvent.change(getInput(), { target: { value: ' rust ' } });
    advance(299);
    expect(onFiltersChange).not.toHaveBeenCalled();
    advance(1);
    expect(onFiltersChange).toHaveBeenCalledTimes(1);
    expect(onFiltersChange).toHaveBeenCalledWith({ ...filters, q: 'rust' });
  });

  it('does not emit when the trimmed value equals the current query', () => {
    const onFiltersChange = vi.fn();
    render(<SearchBox filters={{ ...filters, q: 'rust' }} onFiltersChange={onFiltersChange} />);
    fireEvent.change(getInput(), { target: { value: '  rust  ' } });
    advance(500);
    expect(onFiltersChange).not.toHaveBeenCalled();
  });

  it('syncs to an external query change and cancels the pending debounce', () => {
    const onFiltersChange = vi.fn();
    const { rerender } = render(<SearchBox filters={{ ...filters, q: 'rust' }} onFiltersChange={onFiltersChange} />);
    fireEvent.change(getInput(), { target: { value: 'vue' } });
    rerender(<SearchBox filters={filters} onFiltersChange={onFiltersChange} />);
    expect(getInput()).toHaveValue('');
    advance(500);
    expect(onFiltersChange).not.toHaveBeenCalled();
  });

  it('clears the pending debounce on unmount', () => {
    const onFiltersChange = vi.fn();
    const { unmount } = render(<SearchBox filters={filters} onFiltersChange={onFiltersChange} />);
    fireEvent.change(getInput(), { target: { value: 'rust' } });
    unmount();
    advance(500);
    expect(onFiltersChange).not.toHaveBeenCalled();
  });
});
