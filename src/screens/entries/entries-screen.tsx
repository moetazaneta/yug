import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useMemo } from "react";
import { ScrollView, Text, useWindowDimensions } from "react-native";

import { entryQueryKeys } from "@/src/entities/entry/queries";
import { listEntries } from "@/src/entities/entry/repository";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { listQuestions } from "@/src/entities/question/repository";
import { toDayKey } from "@/src/shared/lib/date";

import { EntryGrid } from "./entry-grid";
import { GRID_COLUMNS, GRID_GAP, groupEntriesByQuestion, makeGridWeeks } from "./entries-utils";

const SCREEN_HORIZONTAL_PADDING = 16;

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
