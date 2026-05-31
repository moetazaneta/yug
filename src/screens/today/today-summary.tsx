import { useQuery } from "@tanstack/react-query";
import { GlassView } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { PlatformColor, Pressable, Text, View } from "react-native";

import { listEntriesBetween } from "@/src/entities/entry/repository";
import { entryQueryKeys } from "@/src/entities/entry/queries";
import { listQuestions } from "@/src/entities/question/repository";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { dayBounds, monthBounds, toDayKey, toMonthKey } from "@/src/shared/lib/date";
import { GlassCard } from "@/src/shared/ui/glass/glass-card";

export function TodaySummary({ onCreate }: { onCreate?: () => void }) {
  const now = useMemo(() => new Date(), []);
  const today = dayBounds(now);
  const month = monthBounds(now);

  const questionsQuery = useQuery({
    queryKey: questionQueryKeys.all,
    queryFn: listQuestions,
  });
  const todayEntriesQuery = useQuery({
    queryKey: entryQueryKeys.today(toDayKey(today.start)),
    queryFn: () => listEntriesBetween(today.start.toISOString(), today.end.toISOString()),
  });
  const monthEntriesQuery = useQuery({
    queryKey: entryQueryKeys.month(toMonthKey(now)),
    queryFn: () => listEntriesBetween(month.start.toISOString(), month.end.toISOString()),
  });

  const questions = questionsQuery.data ?? [];
  const todayEntries = todayEntriesQuery.data ?? [];
  const monthEntries = monthEntriesQuery.data ?? [];
  const answered = new Set(todayEntries.map((entry) => entry.questionId)).size;
  const total = questions.length;
  const daysWithEntries = new Set(monthEntries.map((entry) => toDayKey(entry.datetime))).size;
  const monthDayCount = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthPercent = Math.round((daysWithEntries / monthDayCount) * 100);
  const todayReadable = now.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    weekday: "long",
  });

  const stats = [
    { label: "Answers", value: `${answered}/${total}` },
    { label: "Month", value: `${monthPercent}%` },
    { label: "Days", value: String(daysWithEntries) },
  ];

  return (
    <View className="items-center gap-2">
      <View className="w-full flex-row items-center justify-between gap-4">
        <GlassView
          isInteractive
          glassEffectStyle={{ style: "clear" }}
          style={{
            alignItems: "center",
            borderRadius: 99,
            height: 44,
            justifyContent: "center",
            paddingHorizontal: 16,
          }}
        >
          <Text className="text-lg text-neutral-950 dark:text-white">Edit</Text>
        </GlassView>
        <Text className="text-lg font-bold text-neutral-950 dark:text-white">{todayReadable}</Text>
        <GlassView
          isInteractive
          glassEffectStyle={{ style: "clear" }}
          style={{
            alignItems: "center",
            borderRadius: 99,
            flexDirection: "row",
            gap: 10,
            height: 44,
            justifyContent: "space-between",
            paddingHorizontal: 10,
            width: 84,
          }}
        >
          <Pressable onPress={onCreate}>
            <SymbolView
              name="plus.circle"
              weight="light"
              tintColor={PlatformColor("label")}
              size={24}
            />
          </Pressable>
          <Pressable>
            <SymbolView
              name="square.and.pencil"
              weight="light"
              tintColor={PlatformColor("label")}
              size={24}
            />
          </Pressable>
        </GlassView>
      </View>
      <GlassCard style={{ width: "100%" }}>
        <View className="flex-row justify-between gap-2">
          {stats.map((stat) => (
            <View key={stat.label} className="flex-1 items-center">
              <Text className="text-2xl font-bold text-neutral-950 dark:text-white">
                {stat.value}
              </Text>
              <Text className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>
    </View>
  );
}
