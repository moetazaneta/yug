import { MenuView, type MenuAction } from "@expo/ui/community/menu";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SymbolView, type SFSymbol } from "expo-symbols";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
  useWindowDimensions,
} from "react-native";

import type { Entry } from "@/src/entities/entry/model";
import { entryQueryKeys } from "@/src/entities/entry/queries";
import { listEntries } from "@/src/entities/entry/repository";
import type { Question } from "@/src/entities/question/model";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { listQuestions } from "@/src/entities/question/repository";
import { toDayKey } from "@/src/shared/lib/date";

import { GRID_ROWS, entryIsFilled, startOfWeekMonday, withAlpha } from "../entries/entries-utils";

const ALL_QUESTIONS_ID = "all";
const CARD_BORDER = "#D7D7D7";
const EMPTY_COLOR = "#F4F0DE";
const FALLBACK_ACCENT = "#AF52DE";
const GRID_GAP = 5;
const SCREEN_HORIZONTAL_PADDING = 12;
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const CHART_LABELS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

type ChartSelection = typeof ALL_QUESTIONS_ID | string;

type DayAggregate = {
  completed: number;
  entries: Entry[];
};

export function ChartScreen() {
  const { width } = useWindowDimensions();
  const [selectedId, setSelectedId] = useState<ChartSelection>(ALL_QUESTIONS_ID);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const entriesQuery = useQuery({ queryKey: entryQueryKeys.all, queryFn: listEntries });
  const questionsQuery = useQuery({ queryKey: questionQueryKeys.all, queryFn: listQuestions });
  const questions = questionsQuery.data ?? [];
  const entries = entriesQuery.data ?? [];
  const selectedQuestion = questions.find((question) => question.id === selectedId);
  const isAllQuestions = selectedId === ALL_QUESTIONS_ID || !selectedQuestion;
  const selectedAccent = selectedQuestion?.color ?? FALLBACK_ACCENT;
  const selectedTitle = isAllQuestions ? "All questions" : selectedQuestion.title;
  const selectedIcon = isAllQuestions ? "✦" : selectedQuestion.icon;
  const filteredEntries = useMemo(
    () => filterEntriesForSelection(entries, selectedId, year),
    [entries, selectedId, year],
  );
  const dayAggregates = useMemo(() => aggregateEntriesByDay(filteredEntries), [filteredEntries]);
  const heatmapWeeks = useMemo(() => makeHeatmapWeeks(year), [year]);
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
    Math.min(13, (contentWidth - 40 - GRID_GAP * (heatmapWeeks.length - 1)) / heatmapWeeks.length),
  );
  const chartWidth = Math.max(contentWidth - 64, 240);

  useEffect(() => {
    if (
      selectedId !== ALL_QUESTIONS_ID &&
      !questions.some((question) => question.id === selectedId)
    ) {
      setSelectedId(ALL_QUESTIONS_ID);
    }
  }, [questions, selectedId]);

  return (
    <>
      <Stack.Title>Chart</Stack.Title>
      <ScrollView
        className="flex-1 bg-neutral-100 dark:bg-black"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <QuestionDropdown
          accent={selectedAccent}
          icon={selectedIcon}
          questions={questions}
          selectedId={isAllQuestions ? ALL_QUESTIONS_ID : selectedId}
          title={selectedTitle}
          onSelect={setSelectedId}
        />

        <YearSelector year={year} onChange={setYear} />

        <Panel style={styles.heatmapPanel}>
          {isLoading ? (
            <Text className="text-base text-neutral-500 dark:text-neutral-400">
              Loading chart...
            </Text>
          ) : questions.length === 0 ? (
            <Text className="text-base text-neutral-500 dark:text-neutral-400">
              No questions yet.
            </Text>
          ) : (
            <Heatmap
              accent={selectedAccent}
              dayAggregates={dayAggregates}
              questionCount={isAllQuestions ? Math.max(questions.length, 1) : 1}
              squareSize={heatmapSquareSize}
              weeks={heatmapWeeks}
            />
          )}
        </Panel>

        <View className="flex-row gap-2">
          <MetricCard
            accent={selectedAccent}
            icon="#"
            label="Completions"
            value={completionCount}
          />
          <MetricCard
            accent={selectedAccent}
            icon="%"
            label="Completion Rate"
            value={completionRate}
          />
        </View>

        <Panel style={styles.chartPanel}>
          <View className="mb-4 flex-row items-start justify-between">
            <Text className="flex-1 pr-3 text-3xl font-bold text-neutral-950 dark:text-white">
              Completions / Month
            </Text>
            <IconBadge accent={selectedAccent} symbol="chart.xyaxis.line" textFallback="⌁" />
          </View>
          <MonthlyAreaChart accent={selectedAccent} counts={monthCounts} width={chartWidth} />
        </Panel>

        <View className="flex-row items-start gap-4 px-6">
          <IconBadge accent={selectedAccent} symbol="exclamationmark" textFallback="!" />
          <Text className="flex-1 text-lg leading-6 text-neutral-950 dark:text-neutral-100">
            You need to set a streak goal on one of your questions to see streak data. You can do
            this when editing the question.
          </Text>
        </View>

        <View className="flex-row gap-2">
          <MetricCard accent={selectedAccent} icon="◌" label="Current Streak" value={0} />
          <MetricCard accent={selectedAccent} icon="◌" label="Longest Streak" value={0} />
        </View>
      </ScrollView>
    </>
  );
}

function QuestionDropdown({
  accent,
  icon,
  questions,
  selectedId,
  title,
  onSelect,
}: {
  accent: string;
  icon: string;
  questions: Question[];
  selectedId: ChartSelection;
  title: string;
  onSelect: (questionId: ChartSelection) => void;
}) {
  const actions = useMemo<MenuAction[]>(
    () => [
      {
        id: ALL_QUESTIONS_ID,
        title: "All questions",
        state: selectedId === ALL_QUESTIONS_ID ? ("on" as const) : ("off" as const),
      },
      ...questions.map((question) => ({
        id: question.id,
        title: `${question.icon} ${question.title}`,
        state: selectedId === question.id ? ("on" as const) : ("off" as const),
      })),
    ],
    [questions, selectedId],
  );

  return (
    <MenuView
      actions={actions}
      title="Question"
      onPressAction={(event) => {
        onSelect(event.nativeEvent.event);
      }}
    >
      <Pressable
        accessibilityRole="button"
        className="flex-row items-center gap-4 rounded-2xl border bg-white px-4 py-3 dark:bg-neutral-950"
        style={styles.panelBorder}
      >
        <View
          className="size-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: withAlpha(accent, "18") }}
        >
          <Text className="text-2xl">{icon}</Text>
        </View>
        <Text className="min-w-0 flex-1 text-xl text-neutral-950 dark:text-white" numberOfLines={1}>
          {title}
        </Text>
        <SymbolView
          fallback={<Text className="text-xl text-neutral-500">⌄</Text>}
          name="chevron.down"
          size={18}
          tintColor="#6B7280"
          weight="semibold"
        />
      </Pressable>
    </MenuView>
  );
}

function YearSelector({ year, onChange }: { year: number; onChange: (year: number) => void }) {
  return (
    <Panel style={styles.yearPanel}>
      <Pressable
        accessibilityLabel="Previous year"
        accessibilityRole="button"
        className="size-12 items-center justify-center"
        onPress={() => onChange(year - 1)}
      >
        <SymbolView
          fallback={<Text className="text-4xl text-neutral-950 dark:text-white">‹</Text>}
          name="chevron.left"
          size={30}
          tintColor="#111111"
          weight="medium"
        />
      </Pressable>
      <Text className="text-3xl text-neutral-950 dark:text-white">{year}</Text>
      <Pressable
        accessibilityLabel="Next year"
        accessibilityRole="button"
        className="size-12 items-center justify-center"
        onPress={() => onChange(year + 1)}
      >
        <SymbolView
          fallback={<Text className="text-4xl text-neutral-950 dark:text-white">›</Text>}
          name="chevron.right"
          size={30}
          tintColor="#6B7280"
          weight="medium"
        />
      </Pressable>
    </Panel>
  );
}

function Heatmap({
  accent,
  dayAggregates,
  questionCount,
  squareSize,
  weeks,
}: {
  accent: string;
  dayAggregates: Map<string, DayAggregate>;
  questionCount: number;
  squareSize: number;
  weeks: Date[][];
}) {
  return (
    <View>
      <View className="mb-2 flex-row" style={{ gap: GRID_GAP }}>
        {weeks.map((week, index) => {
          const firstDay = week[0];
          const previousWeek = weeks[index - 1]?.[0];
          const shouldShowMonth =
            firstDay &&
            (!previousWeek || firstDay.getMonth() !== previousWeek.getMonth() || index === 0);

          return (
            <View key={`label-${firstDay?.toISOString()}`} style={{ width: squareSize }}>
              {shouldShowMonth ? (
                <Text className="text-center text-xs text-neutral-400">
                  {MONTH_LABELS[firstDay.getMonth()]}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
      <View className="flex-row" style={{ gap: GRID_GAP }}>
        {weeks.map((week) => (
          <View key={toDayKey(week[0]!)} style={{ gap: GRID_GAP }}>
            {week.map((day) => {
              const aggregate = dayAggregates.get(toDayKey(day));
              const intensity = aggregate ? Math.min(aggregate.completed / questionCount, 1) : 0;

              return (
                <View
                  key={toDayKey(day)}
                  className="rounded"
                  style={{
                    backgroundColor:
                      intensity > 0 ? withAlpha(accent, heatmapAlpha(intensity)) : EMPTY_COLOR,
                    height: squareSize,
                    width: squareSize,
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

function MetricCard({
  accent,
  icon,
  label,
  value,
}: {
  accent: string;
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <Panel style={styles.metricCard}>
      <View className="items-end">
        <View
          className="size-16 items-center justify-center rounded-xl"
          style={{ backgroundColor: withAlpha(accent, "18") }}
        >
          <Text className="text-4xl text-neutral-950" style={{ color: accent }}>
            {icon}
          </Text>
        </View>
      </View>
      <View className="flex-1 justify-end">
        <Text className="text-5xl font-bold text-neutral-950 dark:text-white">{value}</Text>
        <Text className="mt-1 text-lg text-neutral-950 dark:text-neutral-100">{label}</Text>
      </View>
    </Panel>
  );
}

function MonthlyAreaChart({
  accent,
  counts,
  width,
}: {
  accent: string;
  counts: number[];
  width: number;
}) {
  const height = 126;
  const maxValue = Math.max(...counts, 1);
  const step = width / (counts.length - 1);
  const points = counts.map((count, index) => ({
    x: index * step,
    y: height - (count / maxValue) * (height - 10),
  }));

  return (
    <View>
      <View style={{ height, width }}>
        {Array.from({ length: 7 }).map((_, rowIndex) =>
          Array.from({ length: 12 }).map((__, columnIndex) => (
            <View
              key={`${rowIndex}-${columnIndex}`}
              className="absolute size-1 rounded-full bg-neutral-300/60"
              style={{
                left: columnIndex * (width / 11),
                top: rowIndex * (height / 6),
              }}
            />
          )),
        )}
        {points.map((point, index) => (
          <View
            key={`area-${index}`}
            className="absolute bottom-0"
            style={{
              backgroundColor: withAlpha(accent, "20"),
              height: height - point.y,
              left: Math.max(point.x - step / 2, 0),
              width: index === 0 || index === points.length - 1 ? step / 2 : step,
            }}
          />
        ))}
        {points.map((point, index) => {
          const nextPoint = points[index + 1];

          if (!nextPoint) {
            return null;
          }

          const lineWidth = Math.hypot(nextPoint.x - point.x, nextPoint.y - point.y);
          const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);

          return (
            <View
              key={`line-${index}`}
              className="absolute h-[3px] rounded-full"
              style={{
                backgroundColor: accent,
                left: point.x,
                top: point.y,
                transform: [{ rotateZ: `${angle}rad` }],
                transformOrigin: "left center",
                width: lineWidth,
              }}
            />
          );
        })}
      </View>
      <View className="mt-1 flex-row justify-between" style={{ width }}>
        {CHART_LABELS.map((label) => (
          <Text key={label} className="text-base text-neutral-950 dark:text-neutral-100">
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function IconBadge({
  accent,
  symbol,
  textFallback,
}: {
  accent: string;
  symbol: SFSymbol;
  textFallback: string;
}) {
  return (
    <View
      className="size-16 items-center justify-center rounded-xl"
      style={{ backgroundColor: withAlpha(accent, "18") }}
    >
      <SymbolView
        fallback={
          <Text className="text-4xl font-semibold" style={{ color: accent }}>
            {textFallback}
          </Text>
        }
        name={symbol}
        size={34}
        tintColor={accent}
        weight="medium"
      />
    </View>
  );
}

function Panel({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return (
    <View
      className="rounded-2xl border bg-white dark:bg-neutral-950"
      style={[styles.panelBorder, style]}
    >
      {children}
    </View>
  );
}

function filterEntriesForSelection(entries: Entry[], selectedId: ChartSelection, year: number) {
  return entries.filter((entry) => {
    const entryYear = new Date(entry.datetime).getFullYear();

    if (entryYear !== year) {
      return false;
    }

    return selectedId === ALL_QUESTIONS_ID || entry.questionId === selectedId;
  });
}

function aggregateEntriesByDay(entries: Entry[]) {
  const aggregates = new Map<string, DayAggregate>();

  for (const entry of entries) {
    const dayKey = toDayKey(entry.datetime);
    const aggregate = aggregates.get(dayKey) ?? { completed: 0, entries: [] };

    aggregate.entries.push(entry);

    if (entryIsFilled(entry)) {
      aggregate.completed += 1;
    }

    aggregates.set(dayKey, aggregate);
  }

  return aggregates;
}

function countEntriesByMonth(entries: Entry[]) {
  const counts = Array.from({ length: 12 }, () => 0);

  for (const entry of entries) {
    if (entryIsFilled(entry)) {
      const monthIndex = new Date(entry.datetime).getMonth();

      counts[monthIndex] = (counts[monthIndex] ?? 0) + 1;
    }
  }

  return counts;
}

function calculateCompletionRate({
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

function makeHeatmapWeeks(year: number) {
  const firstDay = new Date(year, 0, 1);
  const start = startOfWeekMonday(firstDay);
  const today = new Date();
  const currentYear = today.getFullYear();
  const displayEnd =
    year === currentYear ? new Date(currentYear, today.getMonth() + 1, 0) : new Date(year, 6, 31);
  const weekCount = Math.max(
    1,
    Math.ceil((displayEnd.getTime() - start.getTime()) / (86_400_000 * GRID_ROWS)),
  );

  return Array.from({ length: weekCount }, (_, weekIndex) =>
    Array.from({ length: GRID_ROWS }, (__, dayIndex) => {
      const day = new Date(start);
      day.setDate(start.getDate() + weekIndex * GRID_ROWS + dayIndex);
      return day;
    }),
  );
}

function heatmapAlpha(intensity: number) {
  if (intensity >= 0.85) {
    return "F0";
  }

  if (intensity >= 0.55) {
    return "C8";
  }

  if (intensity >= 0.25) {
    return "90";
  }

  return "55";
}

const styles = StyleSheet.create({
  chartPanel: {
    paddingBottom: 18,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  content: {
    gap: 8,
    paddingBottom: 112,
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    paddingTop: 8,
  },
  heatmapPanel: {
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  metricCard: {
    flex: 1,
    minHeight: 218,
    padding: 22,
  },
  panelBorder: {
    borderColor: CARD_BORDER,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { height: 1, width: 0 },
  },
  yearPanel: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 70,
    paddingHorizontal: 16,
  },
});
