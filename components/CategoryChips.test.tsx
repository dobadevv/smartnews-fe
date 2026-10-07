// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CategoryChips } from '@/components/CategoryChips';
import { createDefaultFilters } from '@/lib/filters';

const filters = createDefaultFilters();
const categories = [
  { value: 'frontend', label: 'frontend', articleCount: 4 },
  { value: 'crypto', label: 'crypto', articleCount: 6 },
];

describe('CategoryChips', () => {
  it('renders a labelled group with tất cả first, summed count and facet counts', () => {
    render(<CategoryChips filters={filters} categories={categories} onFiltersChange={vi.fn()} />);
    expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument();
    const chips = screen.getAllByRole('button');
    expect(chips.map((chip) => chip.textContent)).toEqual(['tất cả10', 'frontend4', 'crypto6']);
  });

  it('marks the active chip as pressed', () => {
    render(<CategoryChips filters={{ ...filters, category: 'crypto' }} categories={categories} onFiltersChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /crypto/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /tất cả/ })).toHaveAttribute('aria-pressed', 'false');
  });

  it('emits the new category when an inactive chip is clicked', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<CategoryChips filters={filters} categories={categories} onFiltersChange={onFiltersChange} />);
    await user.click(screen.getByRole('button', { name: /frontend/ }));
    expect(onFiltersChange).toHaveBeenCalledWith({ ...filters, category: 'frontend' });
  });

  it('does nothing when the active chip is clicked', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<CategoryChips filters={filters} categories={categories} onFiltersChange={onFiltersChange} />);
    await user.click(screen.getByRole('button', { name: /tất cả/ }));
    expect(onFiltersChange).not.toHaveBeenCalled();
  });

  it('keeps an active category that is missing from the list visible', () => {
    render(<CategoryChips filters={{ ...filters, category: 'runtime' }} categories={categories} onFiltersChange={vi.fn()} />);
    const runtime = screen.getByRole('button', { name: 'runtime' });
    expect(runtime).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows only tất cả without a count when the facet list is empty', () => {
    render(<CategoryChips filters={filters} categories={[]} onFiltersChange={vi.fn()} />);
    const chips = screen.getAllByRole('button');
    expect(chips).toHaveLength(1);
    expect(chips[0]).toHaveTextContent(/^tất cả$/);
  });
});
