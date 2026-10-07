// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useFeedNavigation } from './useFeedNavigation';

const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

describe('useFeedNavigation', () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it('replaces the URL with the canonical href without scrolling', () => {
    const today = '2026-10-07';
    const { result } = renderHook(() => useFeedNavigation({ today }));

    act(() => {
      result.current.applyFilters({
        q: 'rust',
        category: 'all',
        source: 'infoq',
        from: today,
        to: null,
      });
    });

    expect(mockReplace).toHaveBeenCalledWith('/?q=rust&source=infoq&to=', { scroll: false });
  });

  it('resets to /', () => {
    const today = '2026-10-07';
    const { result } = renderHook(() => useFeedNavigation({ today }));

    act(() => {
      result.current.resetFilters();
    });

    expect(mockReplace).toHaveBeenCalledWith('/', { scroll: false });
  });
});
