// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FilterPanel } from '@/components/FilterPanel';
import { createDefaultFilters } from '@/lib/filters';

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));

const TODAY = '2026-10-07';
const facets = {
  categories: [{ value: 'frontend', label: 'frontend', articleCount: 2 }],
  sources: [{ value: 'infoq', label: 'InfoQ', articleCount: 2 }],
};

function renderPanel(filters = createDefaultFilters(TODAY)) {
  return render(<FilterPanel filters={filters} facets={facets} today={TODAY} />);
}

beforeEach(() => {
  replace.mockReset();
});

describe('FilterPanel', () => {
  it('renders search, categories, source, both date pickers and reset', () => {
    renderPanel();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Source/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Từ ngày/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Đến ngày/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '↺ Đặt về mặc định' })).toBeInTheDocument();
  });

  it('opening a date picker closes Source and vice versa', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /^Source/ }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Từ ngày/ }));
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Từ ngày' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Source/ }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('opening the to picker closes the from picker', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /^Từ ngày/ }));
    await user.click(screen.getByRole('button', { name: /^Đến ngày/ }));
    expect(screen.queryByRole('dialog', { name: 'Từ ngày' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Đến ngày' })).toBeInTheDocument();
  });

  it('reset navigates to /', async () => {
    const user = userEvent.setup();
    renderPanel({ ...createDefaultFilters(TODAY), category: 'frontend' });
    await user.click(screen.getByRole('button', { name: '↺ Đặt về mặc định' }));
    expect(replace).toHaveBeenCalledWith('/', { scroll: false });
  });

  it('clearing the from date navigates to an href with from=', async () => {
    const user = userEvent.setup();
    renderPanel();
    const [clearFrom] = screen.getAllByRole('button', { name: 'Bỏ lọc ngày' });
    await user.click(clearFrom);
    expect(replace).toHaveBeenCalledWith('/?from=', { scroll: false });
  });

  it('choosing a category navigates with the category param', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /frontend/ }));
    expect(replace).toHaveBeenCalledWith('/?category=frontend', { scroll: false });
  });
});
