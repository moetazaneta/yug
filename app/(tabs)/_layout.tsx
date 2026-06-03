import { NativeTabs } from "expo-router/unstable-native-tabs";
import { AndroidSymbol, SFSymbol } from "expo-symbols";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useTabBarVisibilityStore } from "@/src/shared/ui/navigation/tab-bar-visibility-store";

const icons = {
  index: { sf: "sun.max.fill", md: "wb_sunny" },
  entries: { sf: "list.bullet", md: "format_list_bulleted" },
  chart: { sf: "chart.pie", md: "pie_chart" },
  settings: { sf: "gearshape.fill", md: "settings" },
  playground: { sf: "dice", md: "games" },
} as const satisfies Record<string, { md: AndroidSymbol; sf: SFSymbol }>;

export default function TabLayout() {
  const isTabBarHidden = useTabBarVisibilityStore((state) => state.isTabBarHidden);
  const stagedTabBarHidden = useStagedNativeTabBarHidden(isTabBarHidden);

  return (
    <SafeAreaProvider>
      <NativeTabs hidden={stagedTabBarHidden}>
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
        <NativeTabs.Trigger name="playground">
          <NativeTabs.Trigger.Label>Playground</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={icons.playground.sf} md={icons.playground.md} />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings" role="search">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={icons.settings.sf} md={icons.settings.md} />
        </NativeTabs.Trigger>
      </NativeTabs>
    </SafeAreaProvider>
  );
}

function useStagedNativeTabBarHidden(shouldHide: boolean) {
  const [hidden, setHidden] = useState(shouldHide);

  useEffect(() => {
    if (!shouldHide) {
      setHidden(false);
      return;
    }

    const timeout = setTimeout(() => {
      setHidden(true);
    }, 180);

    return () => {
      clearTimeout(timeout);
    };
  }, [shouldHide]);

  return hidden;
}
