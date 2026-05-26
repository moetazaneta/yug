import { NativeTabs } from "expo-router/unstable-native-tabs";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { AndroidSymbol, SFSymbol } from "expo-symbols";
import { ScrollEdgeBar } from "react-native-scroll-edge-bar";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Host } from "@expo/ui/swift-ui";

const icons = {
  index: { sf: "sun.max.fill", md: "wb_sunny" },
  entries: { sf: "list.bullet", md: "format_list_bulleted" },
  chart: { sf: "chart.pie", md: "pie_chart" },
  settings: { sf: "gearshape.fill", md: "settings" },
  playground: { sf: "dice", md: "games" },
} as const satisfies Record<string, { md: AndroidSymbol; sf: SFSymbol }>;

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // <SafeAreaProvider>
    //   <ScrollEdgeBar
    //     style={{ flex: 1, backgroundColor: "white" }}
    //     estimatedTopBarHeight={94}
    //     topEdgeEffectStyle="soft"
    //   >
    //     <ScrollEdgeBar.TopBar
    //       style={{
    //         paddingHorizontal: 16,
    //         paddingVertical: 8,
    //         backgroundColor: "transparent",
    //       }}
    //     >
    //       {/*<SegmentedControl values={['Free', 'Paid']} selectedIndex={0} />*/}
    //       <Text>Top Bar</Text>
    //     </ScrollEdgeBar.TopBar>

    //     <ScrollView>
    //       {Array.from({ length: 30 }).map((_, index) => (
    //         <View key={index} style={{ padding: 20 }}>
    //           <Text>Item {index + 1}</Text>
    //         </View>
    //       ))}
    //     </ScrollView>

    //     <ScrollEdgeBar.BottomBar
    //       style={{ paddingHorizontal: 16, paddingVertical: 12 }}
    //     >
    //       <Text>Bottom Bar</Text>
    //     </ScrollEdgeBar.BottomBar>
    //   </ScrollEdgeBar>
    // </SafeAreaProvider>
    <SafeAreaProvider>
      <NativeTabs
      // tintColor={Colors[colorScheme].tint}
      // Native tabs render as the iOS 26 Liquid Glass tab bar automatically.
      // On older iOS versions this falls back to the matching native material blur.
      // blurEffect={
      //   colorScheme === "dark"
      //     ? "systemChromeMaterialDark"
      //     : "systemChromeMaterialLight"
      // }
      // backgroundColor="tomato"
      // shadowColor="transparent"
      // minimizeBehavior="onScrollDown"
      >
        <NativeTabs.Trigger name="today">
          <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={icons.index.sf} md={icons.index.md} />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="entries">
          <NativeTabs.Trigger.Label>Entries</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={icons.entries.sf}
            md={icons.entries.md}
          />
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
          <NativeTabs.Trigger.Icon
            sf={icons.playground.sf}
            md={icons.playground.md}
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    </SafeAreaProvider>
  );
}
