import type { Entry } from "@/src/entities/entry/model";
import { toDayKey } from "@/src/shared/lib/date";

export const GRID_GAP = 5;
export const GRID_COLUMNS = 21;
export const GRID_ROWS = 7;

export function startOfWeekMonday(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysFromMonday);

  return start;
}

export function makeGridWeeks(date: Date, columnCount: number) {
  const currentWeekStart = startOfWeekMonday(date);
  const weeks: Date[][] = [];

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() - columnIndex * GRID_ROWS);

    const week: Date[] = [];

    for (let rowIndex = 0; rowIndex < GRID_ROWS; rowIndex += 1) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + rowIndex);
      week.push(day);
    }

    weeks.push(week);
  }

  return weeks;
}

export function makeMonthCalendar(date: Date) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const calendarStart = startOfWeekMonday(monthStart);
  const weeks: Date[][] = [];

  for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
    const week: Date[] = [];

    for (let dayIndex = 0; dayIndex < GRID_ROWS; dayIndex += 1) {
      const day = new Date(calendarStart);
      day.setDate(calendarStart.getDate() + weekIndex * GRID_ROWS + dayIndex);
      week.push(day);
    }

    weeks.push(week);
  }

  const lastWeek = weeks.at(-1);
  const lastWeekIsOutsideMonth = lastWeek?.every((day) => day > monthEnd) ?? false;

  return lastWeekIsOutsideMonth ? weeks.slice(0, -1) : weeks;
}

export function withAlpha(color: string, alpha: string) {
  if (!/^#[\dA-Fa-f]{6}$/.test(color)) {
    return color;
  }

  return `${color}${alpha}`;
}

export function entryIsFilled(entry: Entry | undefined) {
  if (!entry) {
    return false;
  }

  const normalized = entry.value.trim().toLowerCase();

  if (normalized === "false" || normalized === "0" || normalized === "") {
    return false;
  }

  return true;
}

export function valueOpacity(entry: Entry | undefined) {
  if (!entryIsFilled(entry)) {
    return "18";
  }

  const numericValue = Number(entry?.value);

  if (!Number.isFinite(numericValue)) {
    return "E6";
  }

  if (numericValue >= 5) {
    return "F2";
  }

  if (numericValue >= 2) {
    return "CC";
  }

  return "99";
}

export function groupEntriesByQuestion(entries: Entry[]) {
  const groups = new Map<string, Map<string, Entry>>();

  for (const entry of entries) {
    const dayKey = toDayKey(entry.datetime);
    const questionEntries = groups.get(entry.questionId) ?? new Map<string, Entry>();
    const existing = questionEntries.get(dayKey);

    if (!existing || existing.datetime < entry.datetime) {
      questionEntries.set(dayKey, entry);
    }

    groups.set(entry.questionId, questionEntries);
  }

  return groups;
}
