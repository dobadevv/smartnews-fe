'use client';

import { type KeyboardEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import { FIELD_LABEL_CLASS } from '@/components/fieldStyles';
import { useOutsidePointerDown } from '@/hooks/useOutsidePointerDown';
import {
  WEEKDAY_LABELS,
  type YearMonth,
  addDays,
  addMonths,
  buildMonthGrid,
  monthLabel,
  toDisplayDate,
  toYearMonth,
} from '@/lib/calendar';
import { joinClassNames } from '@/lib/classNames';
import type { ArticleFilters, DateRange } from '@/lib/types';

const DATE_PLACEHOLDER = 'dd/mm/yyyy';
const DAY_KEY_OFFSETS: Readonly<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
const MONTH_NAV_CLASS =
  'size-8 cursor-pointer rounded-[6px] border border-border bg-transparent text-accent hover:bg-accent-dim';

type DatePickerProps = {
  label: string;
  field: keyof DateRange;
  filters: ArticleFilters;
  today: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange: (next: ArticleFilters) => void;
};

type DayState = {
  isSelected: boolean;
  isInRange: boolean;
  isBlocked: boolean;
  isOutsideMonth: boolean;
  isToday: boolean;
};

export function DatePicker({ label, field, filters, today, isOpen, onOpenChange, onFiltersChange }: DatePickerProps) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const valueId = `${baseId}-value`;
  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const value = filters[field];
  const [viewMonth, setViewMonth] = useState<YearMonth>(() => toYearMonth(value ?? today));
  const [focusedDate, setFocusedDate] = useState(value ?? today);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  useOutsidePointerDown(fieldRef, { isActive: isOpen, onOutsidePointerDown: close });

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusedDate}"]`)?.focus();
  }, [isOpen, focusedDate]);

  function isBlocked(day: string): boolean {
    if (field === 'from') return filters.to !== null && day > filters.to;
    return filters.from !== null && day < filters.from;
  }

  function isInRange(day: string): boolean {
    return filters.from !== null && filters.to !== null && filters.from <= day && day <= filters.to;
  }

  function toggle() {
    if (isOpen) {
      close();
      return;
    }
    const anchor = value ?? today;
    setViewMonth(toYearMonth(anchor));
    setFocusedDate(anchor);
    onOpenChange(true);
  }

  function closeAndFocusTrigger() {
    close();
    triggerRef.current?.focus();
  }

  function commit(next: string | null) {
    closeAndFocusTrigger();
    if (next !== value) onFiltersChange({ ...filters, [field]: next });
  }

  function pickDay(day: string) {
    if (!isBlocked(day)) commit(day);
  }

  function pickToday() {
    if (!isBlocked(today)) commit(today);
  }

  function clear() {
    commit(null);
  }

  function handleDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, day: string) {
    const offset = DAY_KEY_OFFSETS[event.key];
    if (offset === undefined) return;
    event.preventDefault();
    const nextDate = addDays(day, offset);
    setFocusedDate(nextDate);
    setViewMonth(toYearMonth(nextDate));
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    closeAndFocusTrigger();
  }

  return (
    <div ref={fieldRef} className="relative flex flex-col gap-2">
      <span id={labelId} className={FIELD_LABEL_CLASS}>
        {label}
      </span>
      <div
        className={joinClassNames(
          'flex items-center rounded-control border bg-bg transition-colors duration-150 ease-[ease] hover:border-accent-hover-border motion-reduce:transition-none',
          isOpen ? 'border-accent-hover-border' : 'border-border',
        )}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-labelledby={`${labelId} ${valueId}`}
          onClick={toggle}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-[10px] border-none bg-transparent px-3 py-[10px] text-left font-mono text-[13px]"
        >
          <span aria-hidden="true" className="text-[12px] text-accent">
            ◷
          </span>
          <span id={valueId} className={joinClassNames('whitespace-nowrap', value === null ? 'text-faint' : 'text-text')}>
            {value === null ? DATE_PLACEHOLDER : toDisplayDate(value)}
          </span>
        </button>
        {value !== null && (
          <button
            type="button"
            aria-label="Bỏ lọc ngày"
            onClick={clear}
            className="cursor-pointer border-none bg-transparent px-3 py-2 font-mono text-[14px] leading-none text-muted hover:text-text-bright"
          >
            ×
          </button>
        )}
      </div>
      {isOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-label={label}
          onKeyDown={handleDialogKeyDown}
          className="absolute top-[calc(100%+6px)] left-0 z-20 flex w-[284px] max-w-[calc(100vw-40px)] flex-col gap-[10px] rounded-card border border-border-strong bg-surface p-[14px] font-mono shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center justify-between">
            <button type="button" aria-label="Tháng trước" onClick={() => setViewMonth(addMonths(viewMonth, -1))} className={MONTH_NAV_CLASS}>
              ‹
            </button>
            <span className="text-[13px] uppercase tracking-[0.04em] text-text-bright">
              {monthLabel(viewMonth.year, viewMonth.month)}
            </span>
            <button type="button" aria-label="Tháng sau" onClick={() => setViewMonth(addMonths(viewMonth, 1))} className={MONTH_NAV_CLASS}>
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-[2px] text-center text-[11px] uppercase text-muted">
            {WEEKDAY_LABELS.map((weekday) => (
              <span key={weekday} className="py-1">
                {weekday}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-[2px]">
            {buildMonthGrid(viewMonth.year, viewMonth.month).map((day) => {
              const state: DayState = {
                isSelected: day.date === value,
                isInRange: isInRange(day.date),
                isBlocked: isBlocked(day.date),
                isOutsideMonth: day.isOutsideMonth,
                isToday: day.date === today,
              };
              return (
                <button
                  key={day.date}
                  type="button"
                  data-date={day.date}
                  tabIndex={day.date === focusedDate ? 0 : -1}
                  aria-label={toDisplayDate(day.date)}
                  aria-pressed={state.isSelected}
                  aria-current={state.isToday ? 'date' : undefined}
                  aria-disabled={state.isBlocked ? true : undefined}
                  onClick={() => pickDay(day.date)}
                  onKeyDown={(event) => handleDayKeyDown(event, day.date)}
                  className={getDayClassName(state)}
                >
                  {day.dayOfMonth}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between gap-2 border-t border-border pt-[10px]">
            <button
              type="button"
              onClick={pickToday}
              className="cursor-pointer rounded-full border-none bg-accent-dim px-3 py-[5px] font-mono text-[12px] text-accent"
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={clear}
              className="cursor-pointer border-none bg-transparent px-1 py-[5px] font-mono text-[12px] text-muted hover:text-text-bright"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getDayClassName(state: DayState): string {
  return joinClassNames(
    'h-[34px] rounded-[6px] border p-0 font-mono text-[12px]',
    getDayBackgroundClass(state),
    getDayTextClass(state),
    state.isToday && !state.isSelected ? 'border-[rgba(216,165,72,0.55)]' : 'border-transparent',
    state.isBlocked ? 'cursor-not-allowed' : 'cursor-pointer',
  );
}

function getDayBackgroundClass(state: DayState): string {
  if (state.isSelected) return 'bg-accent';
  if (state.isInRange) return 'bg-[rgba(216,165,72,0.10)]';
  return 'bg-transparent';
}

function getDayTextClass(state: DayState): string {
  if (state.isSelected) return 'text-bg';
  if (state.isBlocked) return 'text-disabled';
  if (state.isOutsideMonth) return 'text-faint';
  if (state.isInRange) return 'text-accent';
  return 'text-text';
}
