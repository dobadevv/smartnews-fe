// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SourceSelect } from '@/components/SourceSelect';
import { createDefaultFilters } from '@/lib/filters';
import type { ArticleFilters } from '@/lib/types';

const filters = createDefaultFilters();
const sources = [
  { value: 'infoq', label: 'InfoQ', articleCount: 5 },
  { value: 'coindesk', label: 'CoinDesk', articleCount: 3 },
];

function ControlledSourceSelect({
  initialFilters = filters,
  onFiltersChange = vi.fn(),
  onOpenChange,
}: {
  initialFilters?: ArticleFilters;
  onFiltersChange?: (next: ArticleFilters) => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <SourceSelect
        filters={initialFilters}
        sources={sources}
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          onOpenChange?.(open);
        }}
        onFiltersChange={onFiltersChange}
      />
      <p>outside</p>
    </div>
  );
}

function getTrigger() {
  return screen.getByRole('button', { name: /^Source/ });
}

function getHighlightedOption() {
  const listbox = screen.getByRole('listbox');
  return document.getElementById(listbox.getAttribute('aria-activedescendant') ?? '');
}

describe('SourceSelect', () => {
  it('shows Tất cả nguồn and opens a listbox with options on click', async () => {
    const user = userEvent.setup();
    render(<ControlledSourceSelect />);
    expect(getTrigger()).toHaveAccessibleName('Source Tất cả nguồn');
    expect(getTrigger()).toHaveAttribute('aria-haspopup', 'listbox');
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    await user.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toHaveFocus();
    const options = screen.getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual(['Tất cả nguồn8✓', 'InfoQ5', 'CoinDesk3']);
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(getHighlightedOption()).toBe(options[0]);
  });

  it('moves the highlight with arrows, Home and End, clamped at the ends', async () => {
    const user = userEvent.setup();
    render(<ControlledSourceSelect />);
    await user.click(getTrigger());
    await user.keyboard('{ArrowUp}');
    expect(getHighlightedOption()).toHaveTextContent('Tất cả nguồn');
    await user.keyboard('{ArrowDown}');
    expect(getHighlightedOption()).toHaveTextContent('InfoQ');
    await user.keyboard('{End}');
    expect(getHighlightedOption()).toHaveTextContent('CoinDesk');
    await user.keyboard('{ArrowDown}');
    expect(getHighlightedOption()).toHaveTextContent('CoinDesk');
    await user.keyboard('{Home}');
    expect(getHighlightedOption()).toHaveTextContent('Tất cả nguồn');
  });

  it('selects the highlighted option with Enter, closes and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<ControlledSourceSelect onFiltersChange={onFiltersChange} />);
    await user.click(getTrigger());
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onFiltersChange).toHaveBeenCalledWith({ ...filters, source: 'infoq' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(getTrigger()).toHaveFocus();
  });

  it('selects an option on click', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<ControlledSourceSelect onFiltersChange={onFiltersChange} />);
    await user.click(getTrigger());
    await user.click(screen.getByRole('option', { name: /CoinDesk/ }));
    expect(onFiltersChange).toHaveBeenCalledWith({ ...filters, source: 'coindesk' });
  });

  it('does not emit when the already selected option is chosen', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<ControlledSourceSelect onFiltersChange={onFiltersChange} />);
    await user.click(getTrigger());
    await user.keyboard('{Enter}');
    expect(onFiltersChange).not.toHaveBeenCalled();
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<ControlledSourceSelect />);
    await user.click(getTrigger());
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(getTrigger()).toHaveFocus();
  });

  it('opens from the keyboard with ArrowDown, highlighting the selected option', async () => {
    const user = userEvent.setup();
    render(<ControlledSourceSelect initialFilters={{ ...filters, source: 'coindesk' }} />);
    getTrigger().focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toHaveFocus();
    expect(getHighlightedOption()).toHaveTextContent('CoinDesk');
  });

  it('opens from the keyboard with Enter', async () => {
    const user = userEvent.setup();
    render(<ControlledSourceSelect />);
    getTrigger().focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('requests close on pointer down outside', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<ControlledSourceSelect onOpenChange={onOpenChange} />);
    await user.click(getTrigger());
    fireEvent.pointerDown(screen.getByText('outside'));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('labels an active source missing from the list with its humanized slug', () => {
    render(<ControlledSourceSelect initialFilters={{ ...filters, source: 'rust-lang-releases' }} />);
    expect(getTrigger()).toHaveAccessibleName('Source Rust Lang');
  });
});
