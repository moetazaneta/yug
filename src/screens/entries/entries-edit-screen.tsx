import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import type { Entry } from "@/src/entities/entry/model";
import { entryQueryKeys } from "@/src/entities/entry/queries";
import {
  createOrUpdateEntry,
  deleteEntryForQuestionOnDay,
  listEntries,
} from "@/src/entities/entry/repository";
import type { Question } from "@/src/entities/question/model";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { listQuestions } from "@/src/entities/question/repository";
import { toDayKey } from "@/src/shared/lib/date";

import {
  GRID_GAP,
  entryIsFilled,
  groupEntriesByQuestion,
  makeMonthCalendar,
  valueOpacity,
  withAlpha,
} from "./entries-utils";

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function sameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

function monthTitle(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(date);
}

function questionPlaceholder(question: Question) {
  if (question.valueType === "number") {
    return question.valueUnits || "0";
  }

  if (question.valueType === "choice") {
    return "Value";
  }

  return "Text";
}

function dayCellLabel(day: Date, question: Question, entry: Entry | undefined) {
  const value = entryIsFilled(entry) ? `, value ${entry?.value}` : ", empty";
  return `${question.title}, ${day.toLocaleDateString()}${value}`;
}

function DayCell({
  day,
  entry,
  isCurrentMonth,
  isMutating,
  onPress,
  question,
}: {
  day: Date;
  entry: Entry | undefined;
  isCurrentMonth: boolean;
  isMutating: boolean;
  onPress: (day: Date) => void;
  question: Question;
}) {
  const filled = entryIsFilled(entry);

  return (
    <Pressable
      accessibilityLabel={dayCellLabel(day, question, entry)}
      accessibilityRole="button"
      disabled={isMutating}
      onPress={() => onPress(day)}
      className="aspect-square flex-1 items-center justify-center rounded-md"
      style={{
        backgroundColor: filled
          ? withAlpha(question.color, valueOpacity(entry))
          : withAlpha(question.color, isCurrentMonth ? "16" : "08"),
        opacity: isCurrentMonth ? 1 : 0.36,
      }}
    >
      <Text className="text-sm font-medium text-neutral-950 dark:text-white">{day.getDate()}</Text>
    </Pressable>
  );
}

function InputEntryModal({
  day,
  entry,
  isSaving,
  onCancel,
  onSubmit,
  question,
}: {
  day: Date | null;
  entry: Entry | undefined;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (value: string) => void;
  question: Question;
}) {
  const [value, setValue] = useState(entry?.value ?? "");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setValue(entry?.value ?? "");
  }, [day, entry?.value]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      onShow={() => inputRef.current?.focus()}
      transparent
      visible={day !== null}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end bg-black/25 px-4 pb-8"
      >
        <View className="rounded-3xl bg-white p-4 dark:bg-neutral-950">
          <Text className="text-base font-semibold text-neutral-950 dark:text-white">
            {day ? day.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
          </Text>
          <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {question.title}
          </Text>

          <TextInput
            ref={inputRef}
            className="mt-4 h-12 rounded-2xl bg-neutral-100 px-4 text-base text-neutral-950 dark:bg-neutral-900 dark:text-white"
            keyboardType={question.valueType === "number" ? "decimal-pad" : "default"}
            onChangeText={setValue}
            placeholder={questionPlaceholder(question)}
            placeholderTextColor="#737373"
            returnKeyType="done"
            value={value}
          />

          <View className="mt-4 flex-row justify-end gap-3">
            <Pressable
              accessibilityRole="button"
              className="h-11 justify-center px-3"
              disabled={isSaving}
              onPress={onCancel}
            >
              <Text className="text-base text-neutral-500 dark:text-neutral-400">Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="h-11 justify-center rounded-full px-5"
              disabled={isSaving || value.trim().length === 0}
              onPress={() => onSubmit(value.trim())}
              style={{ backgroundColor: withAlpha(question.color, "E6") }}
            >
              <Text className="font-semibold text-white">Submit</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function EntriesEditScreen() {
  const queryClient = useQueryClient();
  const { questionId } = useLocalSearchParams<{ questionId?: string }>();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [inputDay, setInputDay] = useState<Date | null>(null);
  const questionsQuery = useQuery({
    queryKey: questionQueryKeys.all,
    queryFn: listQuestions,
  });
  const entriesQuery = useQuery({
    queryKey: entryQueryKeys.all,
    queryFn: listEntries,
  });
  const entriesByQuestion = useMemo(
    () => groupEntriesByQuestion(entriesQuery.data ?? []),
    [entriesQuery.data],
  );
  const question = questionsQuery.data?.find((item) => item.id === questionId);
  const entriesByDay = question ? entriesByQuestion.get(question.id) : undefined;
  const calendarWeeks = useMemo(() => makeMonthCalendar(visibleMonth), [visibleMonth]);
  const inputEntry = inputDay ? entriesByDay?.get(toDayKey(inputDay)) : undefined;
  const saveMutation = useMutation({
    mutationFn: createOrUpdateEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: entryQueryKeys.all });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteEntryForQuestionOnDay,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: entryQueryKeys.all });
    },
  });
  const isMutating = saveMutation.isPending || deleteMutation.isPending;

  function shiftMonth(delta: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  function handleDayPress(day: Date) {
    if (!question || isMutating) {
      return;
    }

    if (question.valueType !== "boolean") {
      setInputDay(day);
      return;
    }

    const entry = entriesByDay?.get(toDayKey(day));

    if (entryIsFilled(entry)) {
      deleteMutation.mutate({ questionId: question.id, datetime: day });
      return;
    }

    saveMutation.mutate({ questionId: question.id, value: true, datetime: day });
  }

  function submitInput(value: string) {
    if (!question || !inputDay) {
      return;
    }

    saveMutation.mutate(
      { questionId: question.id, value, datetime: inputDay },
      {
        onSuccess: () => {
          setInputDay(null);
        },
      },
    );
  }

  return (
    <>
      <Stack.Title>Edit entries</Stack.Title>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="xmark" onPress={() => router.back()} />
      </Stack.Toolbar>

      <ScrollView
        className="flex-1 bg-white dark:bg-black"
        contentContainerStyle={{ paddingBottom: 36, paddingHorizontal: 16, paddingTop: 8 }}
      >
        {!question ? (
          <Text className="py-4 text-base text-neutral-500 dark:text-neutral-400">
            Loading entries...
          </Text>
        ) : (
          <View>
            <View className="flex-row items-center gap-3 py-3">
              <View className="size-10 items-center justify-center">
                <Text className="text-2xl">{question.icon}</Text>
              </View>
              <View className="min-w-0 flex-1">
                <Text
                  className="text-xl font-semibold text-neutral-950 dark:text-white"
                  numberOfLines={1}
                >
                  {question.title}
                </Text>
                <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {question.valueType === "boolean" ? "Tap a day to toggle" : "Tap a day to edit"}
                </Text>
              </View>
            </View>

            <View className="mt-2 flex-row items-center justify-between">
              <Pressable
                accessibilityLabel="Previous month"
                accessibilityRole="button"
                className="size-11 items-center justify-center rounded-full"
                onPress={() => shiftMonth(-1)}
              >
                <Text className="text-2xl text-neutral-950 dark:text-white">{"<"}</Text>
              </Pressable>
              <Text className="text-lg font-semibold text-neutral-950 dark:text-white">
                {monthTitle(visibleMonth)}
              </Text>
              <Pressable
                accessibilityLabel="Next month"
                accessibilityRole="button"
                className="size-11 items-center justify-center rounded-full"
                onPress={() => shiftMonth(1)}
              >
                <Text className="text-2xl text-neutral-950 dark:text-white">{">"}</Text>
              </Pressable>
            </View>

            <View className="mt-3 flex-row" style={{ gap: GRID_GAP }}>
              {WEEKDAY_LABELS.map((label, index) => (
                <Text
                  key={`${label}-${index}`}
                  className="flex-1 text-center text-xs font-semibold text-neutral-400"
                >
                  {label}
                </Text>
              ))}
            </View>

            <View className="mt-2 gap-[5px]">
              {calendarWeeks.map((week) => {
                const firstDay = week[0];

                if (!firstDay) {
                  return null;
                }

                return (
                  <View key={toDayKey(firstDay)} className="flex-row" style={{ gap: GRID_GAP }}>
                    {week.map((day) => {
                      const dayKey = toDayKey(day);

                      return (
                        <DayCell
                          key={dayKey}
                          day={day}
                          entry={entriesByDay?.get(dayKey)}
                          isCurrentMonth={sameMonth(day, visibleMonth)}
                          isMutating={isMutating}
                          onPress={handleDayPress}
                          question={question}
                        />
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {question ? (
        <InputEntryModal
          day={inputDay}
          entry={inputEntry}
          isSaving={saveMutation.isPending}
          onCancel={() => setInputDay(null)}
          onSubmit={submitInput}
          question={question}
        />
      ) : null}
    </>
  );
}
