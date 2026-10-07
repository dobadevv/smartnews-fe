export type CalendarDay = { date: string; dayOfMonth: number; isOutsideMonth: boolean };

/** `month` is 1–12. */
export type YearMonth = { year: number; month: number };

export const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;

const DAYS_IN_GRID = 42;
const MONTHS_PER_YEAR = 12;

function toUtcDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const mondayOffset = (firstOfMonth.getUTCDay() + 6) % 7;
  return Array.from({ length: DAYS_IN_GRID }, (_, index) => {
    const day = new Date(Date.UTC(year, month - 1, 1 - mondayOffset + index));
    return {
      date: toIsoDate(day),
      dayOfMonth: day.getUTCDate(),
      isOutsideMonth: day.getUTCMonth() !== month - 1,
    };
  });
}

export function addDays(date: string, amount: number): string {
  const day = toUtcDate(date);
  day.setUTCDate(day.getUTCDate() + amount);
  return toIsoDate(day);
}

export function addMonths({ year, month }: YearMonth, amount: number): YearMonth {
  const monthIndex = year * MONTHS_PER_YEAR + (month - 1) + amount;
  return {
    year: Math.floor(monthIndex / MONTHS_PER_YEAR),
    month: (((monthIndex % MONTHS_PER_YEAR) + MONTHS_PER_YEAR) % MONTHS_PER_YEAR) + 1,
  };
}

export function toYearMonth(date: string): YearMonth {
  const [year, month] = date.split('-').map(Number);
  return { year, month };
}

export function toDisplayDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

export function monthLabel(year: number, month: number): string {
  return `Tháng ${month} · ${year}`;
}
