import { NativeTabs } from "expo-router/unstable-native-tabs";
import { AndroidSymbol, SFSymbol } from "expo-symbols";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAppStore } from "@/src/state/app-store";
import { useTabBarVisibilityStore } from "@/src/shared/ui/navigation/tab-bar-visibility-store";

const icons = {
  index: { sf: "sun.max.fill", md: "wb_sunny" },
  entries: { sf: "list.bullet", md: "format_list_bulleted" },
  chart: { sf: "chart.pie", md: "pie_chart" },
  settings: { sf: "gearshape.fill", md: "settings" },
} as const satisfies Record<string, { md: AndroidSymbol; sf: SFSymbol }>;

export default function TabLayout() {
  const primaryColor = useAppStore((state) => state.primaryColor);
  const isTabBarHidden = useTabBarVisibilityStore((state) => state.isTabBarHidden);

  return (
    <SafeAreaProvider>
      <NativeTabs hidden={isTabBarHidden} tintColor={primaryColor}>
        <NativeTabs.Trigger name="today">
          <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={icons.index.sf} md={icons.index.md} />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="entries">
          <NativeTabs.Trigger.Label>Entries</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={icons.entries.sf} md={icons.entries.md} />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="chart">
          <NativeTabs.Trigger.Label>Chart</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={icons.chart.sf} md={icons.chart.md} />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={icons.settings.sf} md={icons.settings.md} />
        </NativeTabs.Trigger>
      </NativeTabs>
    </SafeAreaProvider>
  );
}
