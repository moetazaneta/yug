import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, useWindowDimensions } from "react-native";

import { entryQueryKeys } from "@/src/entities/entry/queries";
import { listEntries } from "@/src/entities/entry/repository";
import type { Question } from "@/src/entities/question/model";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { listQuestions } from "@/src/entities/question/repository";
import type { Entry } from "@/src/entities/entry/model";

import { EntryGridBody } from "../entries/entry-grid";
import { GRID_COLUMNS, GRID_GAP, entryIsFilled } from "../entries/entries-utils";
import {
  ALL_QUESTIONS_ID,
  type ChartSelection,
  calculateCompletionRate,
  countEntriesByMonth,
  filterEntriesForSelection,
  groupFilledEntriesByDay,
  listEntryYearsForSelection,
  makeChartGridWeeks,
} from "./chart-data";
import { ChartSummaryMetrics, StreakGoalNotice, StreakMetrics } from "./chart-metrics";
import { ChartSection } from "./chart-section";
import { ChartToolbar } from "./chart-toolbar";
import { MonthlyAreaChart } from "./monthly-area-chart";

const FALLBACK_ACCENT = "#AF52DE";
const SCREEN_HORIZONTAL_PADDING = 16;
const EMPTY_ENTRIES: Entry[] = [];
const EMPTY_QUESTIONS: Question[] = [];

export function ChartScreen() {
  const { width } = useWindowDimensions();
  const [selectedId, setSelectedId] = useState<ChartSelection>(ALL_QUESTIONS_ID);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const entriesQuery = useQuery({
    queryKey: entryQueryKeys.all,
    queryFn: listEntries,
  });
  const questionsQuery = useQuery({
    queryKey: questionQueryKeys.all,
    queryFn: listQuestions,
  });
  const questions = questionsQuery.data ?? EMPTY_QUESTIONS;
  const entries = entriesQuery.data ?? EMPTY_ENTRIES;
  const selectedQuestion = questions.find((question) => question.id === selectedId);
  const isAllQuestions = selectedId === ALL_QUESTIONS_ID || !selectedQuestion;
  const selectedAccent = selectedQuestion?.color ?? FALLBACK_ACCENT;
  const selectedTitle = isAllQuestions
    ? "All questions"
    : `${selectedQuestion.icon} ${selectedQuestion.title}`;
  const availableYears = useMemo(
    () => listEntryYearsForSelection(entries, selectedId),
    [entries, selectedId],
  );
  const filteredEntries = useMemo(
    () => filterEntriesForSelection(entries, selectedId, year),
    [entries, selectedId, year],
  );
  const chartEntriesByDay = useMemo(
    () => groupFilledEntriesByDay(filteredEntries),
    [filteredEntries],
  );
  const heatmapWeeks = useMemo(() => makeChartGridWeeks(year), [year]);
  const monthCounts = useMemo(() => countEntriesByMonth(filteredEntries), [filteredEntries]);
  const completionCount = useMemo(
    () => filteredEntries.filter(entryIsFilled).length,
    [filteredEntries],
  );
  const completionRate = useMemo(
    () =>
      calculateCompletionRate({
        completionCount,
        questionCount: isAllQuestions ? Math.max(questions.length, 1) : 1,
        year,
      }),
    [completionCount, isAllQuestions, questions.length, year],
  );
  const isLoading = entriesQuery.isLoading || questionsQuery.isLoading;
  const contentWidth = Math.max(width - SCREEN_HORIZONTAL_PADDING * 2, 0);
  const heatmapSquareSize = Math.max(
    7,
    (contentWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS,
  );
  const chartWidth = Math.max(contentWidth, 240);

  useEffect(() => {
    if (
      selectedId !== ALL_QUESTIONS_ID &&
      !questions.some((question) => question.id === selectedId)
    ) {
      setSelectedId(ALL_QUESTIONS_ID);
    }
  }, [questions, selectedId]);

  useEffect(() => {
    const nextYear = availableYears[0];

    if (nextYear && !availableYears.includes(year)) {
      setYear(nextYear);
    }
  }, [availableYears, year]);

  return (
    <>
      <ChartToolbar
        availableYears={availableYears}
        isAllQuestions={isAllQuestions}
        onSelectQuestion={setSelectedId}
        onSelectYear={setYear}
        questions={questions}
        selectedId={selectedId}
        selectedTitle={selectedTitle}
        year={year}
      />
      <ScrollView
        className="flex-1 bg-white dark:bg-black"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ChartSection>
          {isLoading ? (
            <Text className="text-base text-neutral-500 dark:text-neutral-400">
              Loading chart...
            </Text>
          ) : questions.length === 0 ? (
            <Text className="text-base text-neutral-500 dark:text-neutral-400">
              No questions yet.
            </Text>
          ) : (
            <EntryGridBody
              entriesByDay={chartEntriesByDay}
              question={{ color: selectedAccent }}
              showMonthLabels
              squareSize={heatmapSquareSize}
              weeks={heatmapWeeks}
            />
          )}
        </ChartSection>

        <ChartSummaryMetrics completionCount={completionCount} completionRate={completionRate} />

        <ChartSection>
          <Text className="mb-5 text-lg font-semibold text-neutral-950 dark:text-white">
            Completions / Month
          </Text>
          <MonthlyAreaChart accent={selectedAccent} counts={monthCounts} width={chartWidth} />
        </ChartSection>

        <StreakGoalNotice accent={selectedAccent} />

        <ChartSection>
          <StreakMetrics />
        </ChartSection>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 0,
    paddingBottom: 112,
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    paddingTop: 10,
  },
});
