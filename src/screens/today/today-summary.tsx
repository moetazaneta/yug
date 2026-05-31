import { GlassView } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import { PlatformColor, Pressable, Text, View } from "react-native";

import { GlassCard } from "@/src/shared/ui/glass/glass-card";

import type { TodayViewModel } from "./service";

const emptySummary: TodayViewModel["summary"] = {
  answered: 0,
  daysWithEntries: 0,
  monthPercent: 0,
  todayReadable: "",
  total: 0,
};

export function TodaySummary({
  summary = emptySummary,
  onCreate,
}: {
  summary?: TodayViewModel["summary"] | undefined;
  onCreate?: () => void;
}) {
  const stats = [
    { label: "Answers", value: `${summary.answered}/${summary.total}` },
    { label: "Month", value: `${summary.monthPercent}%` },
    { label: "Days", value: String(summary.daysWithEntries) },
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
        <Text className="text-lg font-bold text-neutral-950 dark:text-white">
          {summary.todayReadable}
        </Text>
        <GlassView
          isInteractive
          glassEffectStyle={{ style: "clear" }}
          style={{
            alignItems: "center",
            borderRadius: 99,
            flexDirection: "row",
            height: 44,
            justifyContent: "space-between",
            overflow: "hidden",
            width: 84,
          }}
        >
          <Pressable
            accessibilityLabel="Create question"
            accessibilityRole="button"
            className="h-full flex-1 items-center justify-center"
            onPress={onCreate}
          >
            <SymbolView
              name="plus.circle"
              weight="light"
              tintColor={PlatformColor("label")}
              size={24}
            />
          </Pressable>
          <Pressable
            accessibilityLabel="Edit questions"
            accessibilityRole="button"
            className="h-full flex-1 items-center justify-center"
          >
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
            <View key={stat.label} className="flex-1 flex flex-col items-center gap-1">
              <Text className="text-lg font-bold text-neutral-950 dark:text-white">
                {stat.value}
              </Text>
              <Text className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>
    </View>
  );
}
