import { useQuery } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";

import type { Entry } from "@/src/entities/entry/model";
import { entryQueryKeys } from "@/src/entities/entry/queries";
import { listEntries } from "@/src/entities/entry/repository";
import type { Question } from "@/src/entities/question/model";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { listQuestions } from "@/src/entities/question/repository";
import { toDayKey } from "@/src/shared/lib/date";
import { GlassCheckbox } from "@/src/shared/ui/glass/glass-checkbox";

import {
  GRID_COLUMNS,
  GRID_GAP,
  entryIsFilled,
  groupEntriesByQuestion,
  makeGridWeeks,
  valueOpacity,
  withAlpha,
} from "./entries-utils";

const SCREEN_HORIZONTAL_PADDING = 16;

function EntryControl({ question, value }: { question: Question; value: string | undefined }) {
  if (question.valueType === "boolean") {
    return <GlassCheckbox value={value === "true"} />;
  }

  return (
    <TextInput
      className="h-8 w-20 shrink-0 rounded-xl border-2 border-neutral-200 bg-transparent px-2 text-right text-sm text-neutral-950 dark:text-white"
      editable={false}
      keyboardType={question.valueType === "number" ? "decimal-pad" : "default"}
      placeholder={question.valueUnits ? question.valueUnits.slice(0, 3) : "0"}
      placeholderTextColor="#737373"
      value={value}
    />
  );
}

function EntryGrid({
  currentDayKey,
  entriesByDay,
  question,
  squareSize,
  weeks,
}: {
  currentDayKey: string;
  entriesByDay: Map<string, Entry> | undefined;
  question: Question;
  squareSize: number;
  weeks: Date[][];
}) {
  const currentValue = entriesByDay?.get(currentDayKey)?.value;

  return (
    <View className="gap-3 py-4">
      <View className="flex-row items-center justify-between">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <View className="size-8 items-center justify-center">
            <Text className="text-base">{question.icon}</Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text className="font-semibold text-slate-950 dark:text-white" numberOfLines={1}>
              {question.title}
            </Text>
          </View>
        </View>
        <View className="shrink-0 pl-3">
          <EntryControl question={question} value={currentValue} />
        </View>
      </View>

      <Pressable
        accessibilityHint="Opens the entry calendar editor"
        accessibilityLabel={`Edit entries for ${question.title}`}
        className="flex-row-reverse items-start"
        onPress={() => {
          router.push({
            pathname: "/entries-edit",
            params: { questionId: question.id },
          });
        }}
        style={{ gap: GRID_GAP }}
      >
        {weeks.map((week) => {
          const weekStart = week[0];

          if (!weekStart) {
            return null;
          }

          return (
            <View key={toDayKey(weekStart)} className="gap-[5px]">
              {week.map((day) => {
                const dayKey = toDayKey(day);
                const entry = entriesByDay?.get(dayKey);

                return (
                  <View
                    key={dayKey}
                    className="rounded-[5px]"
                    style={{
                      width: squareSize,
                      height: squareSize,
                      backgroundColor: entryIsFilled(entry)
                        ? withAlpha(question.color, valueOpacity(entry))
                        : withAlpha(question.color, "14"),
                    }}
                  />
                );
              })}
            </View>
          );
        })}
      </Pressable>
    </View>
  );
}

export function EntriesScreen() {
  const { width } = useWindowDimensions();
  const today = useMemo(() => new Date(), []);
  const currentDayKey = useMemo(() => toDayKey(today), [today]);
  const weeks = useMemo(() => makeGridWeeks(today, GRID_COLUMNS), [today]);
  const entriesQuery = useQuery({
    queryKey: entryQueryKeys.all,
    queryFn: listEntries,
  });
  const questionsQuery = useQuery({
    queryKey: questionQueryKeys.all,
    queryFn: listQuestions,
  });
  const entriesByQuestion = useMemo(
    () => groupEntriesByQuestion(entriesQuery.data ?? []),
    [entriesQuery.data],
  );
  const contentWidth = Math.max(width - SCREEN_HORIZONTAL_PADDING * 2, 0);
  const squareSize = (contentWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  const questions = questionsQuery.data ?? [];
  const isLoading = entriesQuery.isLoading || questionsQuery.isLoading;

  return (
    <>
      <Stack.Title>Entries</Stack.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="line.3.horizontal.decrease.circle" onPress={() => {}} />
      </Stack.Toolbar>

      <ScrollView
        className="flex-1 bg-white dark:bg-black"
        contentContainerStyle={{
          paddingBottom: 112,
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          paddingTop: 8,
        }}
      >
        {isLoading ? (
          <Text className="py-4 text-base text-neutral-500 dark:text-neutral-400">
            Loading entries...
          </Text>
        ) : questions.length === 0 ? (
          <Text className="py-4 text-base text-neutral-500 dark:text-neutral-400">
            No questions yet.
          </Text>
        ) : (
          questions.map((question) => (
            <EntryGrid
              key={question.id}
              currentDayKey={currentDayKey}
              entriesByDay={entriesByQuestion.get(question.id)}
              question={question}
              squareSize={squareSize}
              weeks={weeks}
            />
          ))
        )}
      </ScrollView>
    </>
  );
}
