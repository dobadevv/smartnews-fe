// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from '@/components/DatePicker';
import { createDefaultFilters } from '@/lib/filters';
import type { ArticleFilters, DateRange } from '@/lib/types';

const TODAY = '2026-10-07';
const defaults = createDefaultFilters(TODAY);

function ControlledDatePicker({
  field = 'from',
  filters = defaults,
  onFiltersChange = vi.fn(),
}: {
  field?: keyof DateRange;
  filters?: ArticleFilters;
  onFiltersChange?: (next: ArticleFilters) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <DatePicker
        label={field === 'from' ? 'Từ ngày' : 'Đến ngày'}
        field={field}
        filters={filters}
        today={TODAY}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onFiltersChange={onFiltersChange}
      />
      <p>outside</p>
    </div>
  );
}

function getTrigger(label = 'Từ ngày') {
  return screen.getByRole('button', { name: new RegExp(`^${label}`) });
}

describe('DatePicker', () => {
  it('shows the value and opens a dialog focused on the selected day', async () => {
    const user = userEvent.setup();
    render(<ControlledDatePicker />);
    expect(getTrigger()).toHaveAccessibleName('Từ ngày 07/10/2026');
    await user.click(getTrigger());
    expect(screen.getByRole('dialog', { name: 'Từ ngày' })).toBeInTheDocument();
    expect(screen.getByText('Tháng 10 · 2026')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^\d{2}\/\d{2}\/\d{4}$/ })).toHaveLength(42);
    const selectedDay = screen.getByRole('button', { name: '07/10/2026' });
    expect(selectedDay).toHaveFocus();
    expect(selectedDay).toHaveAttribute('aria-pressed', 'true');
    expect(selectedDay).toHaveAttribute('aria-current', 'date');
  });

  it('shows the placeholder and opens on today when the value is cleared', async () => {
    const user = userEvent.setup();
    render(<ControlledDatePicker filters={{ ...defaults, from: null }} />);
    expect(getTrigger()).toHaveAccessibleName('Từ ngày dd/mm/yyyy');
    expect(screen.queryByRole('button', { name: 'Bỏ lọc ngày' })).toBeNull();
    await user.click(getTrigger());
    expect(screen.getByRole('button', { name: '07/10/2026' })).toHaveFocus();
  });

  it('moves focus with arrow keys and switches month when leaving it', async () => {
    const user = userEvent.setup();
    render(<ControlledDatePicker />);
    await user.click(getTrigger());
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: '06/10/2026' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('button', { name: '29/09/2026' })).toHaveFocus();
    expect(screen.getByText('Tháng 9 · 2026')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{ArrowRight}');
    expect(screen.getByRole('button', { name: '07/10/2026' })).toHaveFocus();
    expect(screen.getByText('Tháng 10 · 2026')).toBeInTheDocument();
  });

  it('selects the focused day with Enter, closes and focuses the trigger', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<ControlledDatePicker onFiltersChange={onFiltersChange} />);
    await user.click(getTrigger());
    await user.keyboard('{ArrowLeft}{Enter}');
    expect(onFiltersChange).toHaveBeenCalledWith({ ...defaults, from: '2026-10-06' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(getTrigger()).toHaveFocus();
  });

  it('navigates months with the header buttons', async () => {
    const user = userEvent.setup();
    render(<ControlledDatePicker />);
    await user.click(getTrigger());
    await user.click(screen.getByRole('button', { name: 'Tháng sau' }));
    expect(screen.getByText('Tháng 11 · 2026')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tháng trước' }));
    await user.click(screen.getByRole('button', { name: 'Tháng trước' }));
    expect(screen.getByText('Tháng 9 · 2026')).toBeInTheDocument();
  });

  it('ignores a blocked day after the "to" date in the from picker', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<ControlledDatePicker onFiltersChange={onFiltersChange} />);
    await user.click(getTrigger());
    const blockedDay = screen.getByRole('button', { name: '08/10/2026' });
    expect(blockedDay).toHaveAttribute('aria-disabled', 'true');
    await user.click(blockedDay);
    expect(onFiltersChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('marks days in the selected range', async () => {
    const user = userEvent.setup();
    render(<ControlledDatePicker filters={{ ...defaults, from: '2026-10-02', to: '2026-10-07' }} />);
    await user.click(getTrigger());
    expect(screen.getByRole('button', { name: '02/10/2026' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '05/10/2026' })).toHaveClass('text-accent');
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<ControlledDatePicker />);
    await user.click(getTrigger());
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(getTrigger()).toHaveFocus();
  });

  it('sets today with Hôm nay', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<ControlledDatePicker filters={{ ...defaults, from: '2026-10-01' }} onFiltersChange={onFiltersChange} />);
    await user.click(getTrigger());
    await user.click(screen.getByRole('button', { name: 'Hôm nay' }));
    expect(onFiltersChange).toHaveBeenCalledWith({ ...defaults, from: TODAY });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('ignores Hôm nay when today is blocked', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(
      <ControlledDatePicker
        field="to"
        filters={{ ...defaults, from: '2026-10-10', to: '2026-10-12' }}
        onFiltersChange={onFiltersChange}
      />,
    );
    await user.click(getTrigger('Đến ngày'));
    await user.click(screen.getByRole('button', { name: 'Hôm nay' }));
    expect(onFiltersChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('clears the value with Bỏ chọn', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<ControlledDatePicker onFiltersChange={onFiltersChange} />);
    await user.click(getTrigger());
    await user.click(screen.getByRole('button', { name: 'Bỏ chọn' }));
    expect(onFiltersChange).toHaveBeenCalledWith({ ...defaults, from: null });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('clears the value with the × button', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<ControlledDatePicker field="to" onFiltersChange={onFiltersChange} />);
    await user.click(screen.getByRole('button', { name: 'Bỏ lọc ngày' }));
    expect(onFiltersChange).toHaveBeenCalledWith({ ...defaults, to: null });
  });

  it('closes on pointer down outside', async () => {
    const user = userEvent.setup();
    render(<ControlledDatePicker />);
    await user.click(getTrigger());
    fireEvent.pointerDown(screen.getByText('outside'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
