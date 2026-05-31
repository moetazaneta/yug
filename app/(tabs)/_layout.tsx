import { NativeTabs } from "expo-router/unstable-native-tabs";
import { AndroidSymbol, SFSymbol } from "expo-symbols";
import { SafeAreaProvider } from "react-native-safe-area-context";

const icons = {
  index: { sf: "sun.max.fill", md: "wb_sunny" },
  entries: { sf: "list.bullet", md: "format_list_bulleted" },
  chart: { sf: "chart.pie", md: "pie_chart" },
  settings: { sf: "gearshape.fill", md: "settings" },
  playground: { sf: "dice", md: "games" },
} as const satisfies Record<string, { md: AndroidSymbol; sf: SFSymbol }>;

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <NativeTabs>
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
        {/*<NativeTabs.Trigger name="settings" role="search">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={icons.settings.sf}
            md={icons.settings.md}
          />
        </NativeTabs.Trigger>*/}
        <NativeTabs.Trigger name="playground" role="search">
          <NativeTabs.Trigger.Label>Playground</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={icons.playground.sf} md={icons.playground.md} />
        </NativeTabs.Trigger>
      </NativeTabs>
    </SafeAreaProvider>
  );
}
