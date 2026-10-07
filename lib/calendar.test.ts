import { describe, expect, it } from 'vitest';
import {
  WEEKDAY_LABELS,
  addDays,
  addMonths,
  buildMonthGrid,
  monthLabel,
  toDisplayDate,
  toYearMonth,
} from '@/lib/calendar';

describe('buildMonthGrid', () => {
  it('starts on the Monday before the 1st (October 2026 starts on a Thursday)', () => {
    const grid = buildMonthGrid(2026, 10);
    expect(grid).toHaveLength(42);
    expect(grid[0]).toEqual({ date: '2026-09-28', dayOfMonth: 28, isOutsideMonth: true });
    expect(grid[3]).toEqual({ date: '2026-10-01', dayOfMonth: 1, isOutsideMonth: false });
    expect(grid[41].date).toBe('2026-11-08');
  });

  it('starts on the 1st when the month begins on a Monday (June 2026)', () => {
    const grid = buildMonthGrid(2026, 6);
    expect(grid[0]).toEqual({ date: '2026-06-01', dayOfMonth: 1, isOutsideMonth: false });
    expect(grid[41]).toEqual({ date: '2026-07-12', dayOfMonth: 12, isOutsideMonth: true });
  });

  it('uses six leading days when the month begins on a Sunday (February 2026)', () => {
    const grid = buildMonthGrid(2026, 2);
    expect(grid[0].date).toBe('2026-01-26');
    expect(grid[6]).toEqual({ date: '2026-02-01', dayOfMonth: 1, isOutsideMonth: false });
    expect(grid[41].date).toBe('2026-03-08');
  });

  it('flags exactly the days of the requested month as inside', () => {
    expect(buildMonthGrid(2026, 10).filter((day) => !day.isOutsideMonth)).toHaveLength(31);
  });
});

describe('addDays', () => {
  it('crosses month boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-10-01', -1)).toBe('2026-09-30');
  });

  it('crosses year boundaries', () => {
    expect(addDays('2026-12-28', 7)).toBe('2027-01-04');
    expect(addDays('2027-01-03', -7)).toBe('2026-12-27');
  });
});

describe('addMonths', () => {
  it('moves forward and backward across years', () => {
    expect(addMonths({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(addMonths({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
  });
});

describe('formatting', () => {
  it('converts ISO dates to display dates', () => {
    expect(toDisplayDate('2026-10-07')).toBe('07/10/2026');
  });

  it('builds the Vietnamese month label', () => {
    expect(monthLabel(2026, 10)).toBe('Tháng 10 · 2026');
  });

  it('extracts the year and month', () => {
    expect(toYearMonth('2026-09-29')).toEqual({ year: 2026, month: 9 });
  });

  it('labels weekdays starting Monday', () => {
    expect(WEEKDAY_LABELS).toEqual(['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']);
  });
});
