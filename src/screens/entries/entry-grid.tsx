import { router } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

import type { Entry } from "@/src/entities/entry/model";
import type { Question } from "@/src/entities/question/model";
import { toDayKey } from "@/src/shared/lib/date";
import { GlassCheckbox } from "@/src/shared/ui/glass/glass-checkbox";

import { GRID_GAP, entryIsFilled, valueOpacity, withAlpha } from "./entries-utils";

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

export function EntryGridBody({
  entriesByDay,
  gap = GRID_GAP,
  question,
  showMonthLabels = false,
  squareSize,
  weeks,
}: {
  entriesByDay: Map<string, Entry> | undefined;
  gap?: number;
  question: Pick<Question, "color">;
  showMonthLabels?: boolean;
  squareSize: number;
  weeks: Date[][];
}) {
  const gridWidth = weeks.length * squareSize + Math.max(weeks.length - 1, 0) * gap;

  return (
    <View style={{ alignSelf: "center", width: gridWidth }}>
      {showMonthLabels ? (
        <View className="mb-2 h-4">
          {makeMonthLabels(weeks).map(({ index, label }) => (
            <Text
              key={`${label}-${index}`}
              className="absolute text-xs text-neutral-400 dark:text-neutral-500"
              numberOfLines={1}
              style={{
                left: visualColumnLeft(index, weeks.length, squareSize, gap),
                width: squareSize * 3 + gap * 2,
              }}
            >
              {label}
            </Text>
          ))}
        </View>
      ) : null}
      <View className="flex-row-reverse items-start" style={{ gap }}>
        {weeks.map((week) => {
          const weekStart = week[0];

          if (!weekStart) {
            return null;
          }

          return (
            <View key={toDayKey(weekStart)} style={{ gap }}>
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
    </View>
  );
}

function makeMonthLabels(weeks: Date[][]) {
  const labels: { index: number; label: string }[] = [];
  let lastVisualLabelIndex = Number.NEGATIVE_INFINITY;

  for (let index = weeks.length - 1; index >= 0; index -= 1) {
    const weekStart = weeks[index]?.[0];
    const previousVisualWeekStart = weeks[index + 1]?.[0];

    if (
      weekStart &&
      (!previousVisualWeekStart || weekStart.getMonth() !== previousVisualWeekStart.getMonth()) &&
      weeks.length - 1 - index - lastVisualLabelIndex >= 2
    ) {
      const visualIndex = weeks.length - 1 - index;
      const label = MONTH_LABELS[weekStart.getMonth()];

      if (!label) {
        continue;
      }

      labels.push({ index, label });
      lastVisualLabelIndex = visualIndex;
    }
  }

  return labels;
}

function visualColumnLeft(index: number, columnCount: number, squareSize: number, gap: number) {
  return (columnCount - 1 - index) * (squareSize + gap);
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
  gap = GRID_GAP,
  question,
  squareSize,
  weeks,
}: {
  entriesByDay: Map<string, Entry> | undefined;
  gap?: number;
  question: Question;
  squareSize: number;
  weeks: Date[][];
}) {
  const gridWidth = weeks.length * squareSize + Math.max(weeks.length - 1, 0) * gap;
  const gridHeight = 7 * squareSize + 6 * gap;
  const headerHeight = 32;
  const previewGap = 12;
  const previewPadding = 16;
  const previewHeight = headerHeight + previewGap + gridHeight + previewPadding * 2;

  return (
    <View
      className="gap-3 rounded-2xl bg-white p-4 dark:bg-black"
      style={{ height: previewHeight, width: gridWidth + previewPadding * 2 }}
    >
      <View className="h-8 flex-row items-center gap-2">
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
        gap={gap}
        question={question}
        squareSize={squareSize}
        weeks={weeks}
      />
    </View>
  );
}
