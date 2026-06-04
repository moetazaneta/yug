import { Text, View } from "react-native";

export function ChartSummaryMetrics({
  completionCount,
  completionRate,
}: {
  completionCount: number;
  completionRate: number;
}) {
  return (
    <View className="flex-row py-2">
      <MetricColumn label="Completions" value={completionCount} />
      <View className="w-px bg-neutral-200 dark:bg-neutral-800" />
      <MetricColumn label="Completion rate" suffix="%" value={completionRate} />
    </View>
  );
}

export function StreakGoalNotice({ accent }: { accent: string }) {
  return (
    <View className="flex-row items-start gap-3 py-2">
      <Text className="text-base font-semibold" style={{ color: accent }}>
        !
      </Text>
      <Text className="flex-1 text-[15px] leading-5 text-neutral-600 dark:text-neutral-300">
        Set a streak goal on a question to see streak data.
      </Text>
    </View>
  );
}

export function StreakMetrics() {
  return (
    <>
      <CompactMetric label="Current streak" value={0} />
      <View className="h-px bg-neutral-200 dark:bg-neutral-800" />
      <CompactMetric label="Longest streak" value={0} />
    </>
  );
}

function MetricColumn({ label, suffix, value }: { label: string; suffix?: string; value: number }) {
  return (
    <View className="flex-1 py-3">
      <Text className="text-center text-4xl font-semibold text-neutral-950 dark:text-white">
        {value}
        {suffix}
      </Text>
      <Text className="mt-1 text-center text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400">
        {label}
      </Text>
    </View>
  );
}

function CompactMetric({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-row items-center justify-between py-4">
      <Text className="text-[15px] text-neutral-600 dark:text-neutral-300">{label}</Text>
      <Text className="text-lg font-semibold text-neutral-950 dark:text-white">{value}</Text>
    </View>
  );
}
