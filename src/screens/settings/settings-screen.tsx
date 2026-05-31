import { Text, View } from "react-native";

import { GlassCard } from "@/src/shared/ui/glass/glass-card";

export function SettingsScreen() {
  return (
    <View className="flex-1 bg-slate-50 px-5 pt-20 dark:bg-black">
      <Text className="mb-5 text-3xl font-bold text-slate-950 dark:text-white">Settings</Text>
      <GlassCard>
        <Text className="text-base text-slate-700 dark:text-slate-200">
          Reminder scheduling and PostHog configuration are scaffolded behind app-owned boundaries.
        </Text>
      </GlassCard>
    </View>
  );
}
