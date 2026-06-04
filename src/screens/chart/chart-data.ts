import type { Entry } from "@/src/entities/entry/model";
import { toDayKey } from "@/src/shared/lib/date";

import { GRID_COLUMNS, entryIsFilled, makeGridWeeks } from "../entries/entries-utils";

export const ALL_QUESTIONS_ID = "all";
export type ChartSelection = typeof ALL_QUESTIONS_ID | string;

export function filterEntriesForSelection(
  entries: Entry[],
  selectedId: ChartSelection,
  year: number,
) {
  return entries.filter((entry) => {
    const entryYear = new Date(entry.datetime).getFullYear();

    if (entryYear !== year) {
      return false;
    }

    return selectedId === ALL_QUESTIONS_ID || entry.questionId === selectedId;
  });
}

export function listEntryYearsForSelection(entries: Entry[], selectedId: ChartSelection) {
  const years = new Set<number>();

  for (const entry of entries) {
    if (selectedId !== ALL_QUESTIONS_ID && entry.questionId !== selectedId) {
      continue;
    }

    years.add(new Date(entry.datetime).getFullYear());
  }

  return Array.from(years).sort((left, right) => right - left);
}

export function groupFilledEntriesByDay(entries: Entry[]) {
  const entriesByDay = new Map<string, Entry>();

  for (const entry of entries) {
    if (!entryIsFilled(entry)) {
      continue;
    }

    const dayKey = toDayKey(entry.datetime);
    const existing = entriesByDay.get(dayKey);

    if (!existing || existing.datetime < entry.datetime) {
      entriesByDay.set(dayKey, entry);
    }
  }

  return entriesByDay;
}

export function countEntriesByMonth(entries: Entry[]) {
  const counts = Array.from({ length: 12 }, () => 0);

  for (const entry of entries) {
    if (entryIsFilled(entry)) {
      const monthIndex = new Date(entry.datetime).getMonth();

      counts[monthIndex] = (counts[monthIndex] ?? 0) + 1;
    }
  }

  return counts;
}

export function calculateCompletionRate({
  completionCount,
  questionCount,
  year,
}: {
  completionCount: number;
  questionCount: number;
  year: number;
}) {
  const today = new Date();
  const isCurrentYear = year === today.getFullYear();
  const end = isCurrentYear ? today : new Date(year, 11, 31);
  const start = new Date(year, 0, 1);
  const dayCount = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1);
  const possibleCount = Math.max(1, dayCount * questionCount);

  return Math.round((completionCount / possibleCount) * 100);
}

export function makeChartGridWeeks(year: number) {
  const today = new Date();
  const endDate = year === today.getFullYear() ? today : new Date(year, 11, 31);

  return makeGridWeeks(endDate, GRID_COLUMNS);
}
