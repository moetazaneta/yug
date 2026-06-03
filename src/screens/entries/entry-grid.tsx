import { router } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

import type { Entry } from "@/src/entities/entry/model";
import type { Question } from "@/src/entities/question/model";
import { toDayKey } from "@/src/shared/lib/date";
import { GlassCheckbox } from "@/src/shared/ui/glass/glass-checkbox";

import { GRID_GAP, entryIsFilled, valueOpacity, withAlpha } from "./entries-utils";

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

function EntryGridBody({
  entriesByDay,
  question,
  squareSize,
  weeks,
}: {
  entriesByDay: Map<string, Entry> | undefined;
  question: Question;
  squareSize: number;
  weeks: Date[][];
}) {
  return (
    <View className="flex-row-reverse items-start" style={{ gap: GRID_GAP }}>
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
    </View>
  );
}

export function EntryGrid({
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
        onPress={() => {
          router.push({
            pathname: "/entries-edit",
            params: { questionId: question.id },
          });
        }}
      >
        <EntryGridBody
          entriesByDay={entriesByDay}
          question={question}
          squareSize={squareSize}
          weeks={weeks}
        />
      </Pressable>
    </View>
  );
}

export function EntryGridPreview({
  entriesByDay,
  question,
  squareSize,
  weeks,
}: {
  entriesByDay: Map<string, Entry> | undefined;
  question: Question;
  squareSize: number;
  weeks: Date[][];
}) {
  return (
    <View className="gap-3 rounded-2xl bg-white p-4 dark:bg-black">
      <View className="flex-row items-center gap-2">
        <View className="size-8 items-center justify-center">
          <Text className="text-base">{question.icon}</Text>
        </View>
        <Text
          className="min-w-0 flex-1 font-semibold text-slate-950 dark:text-white"
          numberOfLines={1}
        >
          {question.title}
        </Text>
      </View>
      <EntryGridBody
        entriesByDay={entriesByDay}
        question={question}
        squareSize={squareSize}
        weeks={weeks}
      />
    </View>
  );
}
