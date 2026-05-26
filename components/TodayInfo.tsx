import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { listEntriesBetween } from "@/src/data/repositories/entries";
import { listQuestions } from "@/src/data/repositories/questions";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@/hooks/use-theme";
import ClearLiquidGlassView from "@/modules/ClearLiquidGlassView/src/ClearLiquidGlassView.web";

import {
  LiquidGlassView,
  LiquidGlassContainerView,
  isLiquidGlassSupported,
} from "@callstack/liquid-glass";
import {
  Button,
  Host,
  Picker,
  Text as ExpoText,
  VStack,
} from "@expo/ui/swift-ui";
import {
  background,
  backgroundOverlay,
  buttonStyle,
  clipShape,
  controlSize,
  frame,
  labelStyle,
  pickerStyle,
  shapes,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import { SymbolView } from "expo-symbols";
import SegmentedControl from "@expo/ui/community/segmented-control";

function dayBounds(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function monthBounds(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

function toDayKey(value: string) {
  return value.slice(0, 10);
}

export function TodayInfo({ onNew }: { onNew?: () => void }) {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme].tint;
  const now = useMemo(() => new Date(), []);
  const today = dayBounds(now);
  const month = monthBounds(now);

  const questionsQuery = useQuery({
    queryKey: ["questions"],
    queryFn: listQuestions,
  });
  const todayEntriesQuery = useQuery({
    queryKey: ["entries", "today", today.start.toISOString()],
    queryFn: () =>
      listEntriesBetween(today.start.toISOString(), today.end.toISOString()),
  });
  const monthEntriesQuery = useQuery({
    queryKey: ["entries", "month", month.start.toISOString()],
    queryFn: () =>
      listEntriesBetween(month.start.toISOString(), month.end.toISOString()),
  });

  const questions = questionsQuery.data ?? [];
  const todayEntries = todayEntriesQuery.data ?? [];
  const monthEntries = monthEntriesQuery.data ?? [];
  const answeredQuestionIds = new Set(
    todayEntries.map((entry) => entry.questionId),
  );
  const answered = answeredQuestionIds.size;
  const total = questions.length;
  const completion = total === 0 ? 0 : Math.round((answered / total) * 100);
  const daysWithEntries = new Set(
    monthEntries.map((entry) => toDayKey(entry.datetime)),
  ).size;
  const monthDayCount = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const monthPercent = Math.round((daysWithEntries / monthDayCount) * 100);

  const stats = [
    { label: "Answers", value: `${answered}/${total}` },
    { label: "Streak", value: `1${daysWithEntries}` },
    // { label: "Today", value: `${completion}%` },
    // { label: "Month", value: `${daysWithEntries} days` },
    { label: "Month", value: `3${monthPercent}%` },
    { label: "Total", value: `26${daysWithEntries}` },
  ];

  const todayReadable = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const theme = useTheme();

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <View className="flex flex-col gap-2 items-center">
      <View className="flex flex-row justify-between w-full gap-4 items-center ">
        <GlassView
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            gap: 2,
            height: 44,
            borderRadius: 99,
          }}
          isInteractive
          glassEffectStyle={{
            style: "clear",
          }}
        >
          <Text className="text-lg text-neutral-950 dark:text-white">Edit</Text>
        </GlassView>
        <Text className="text-lg text-neutral-950 dark:text-white font-bold">
          {todayReadable}
        </Text>
        <GlassView
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            gap: 2,
            height: 44,
            width: 84,
            borderRadius: 99,
          }}
          isInteractive
          glassEffectStyle={{
            style: "clear",
          }}
        >
          <Pressable>
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
              style={{ marginBottom: 4 }}
            />
          </Pressable>
        </GlassView>
        {/*<Host matchContents>
          <Button
            label="Settings"
            systemImage="plus"
            modifiers={[
              labelStyle("iconOnly"),
              // controlSize("large"),
              buttonStyle("glass"),
              frame({ width: 40, height: 40 }),
              // clipShape("circle"),
              // shapes.circle()
            ]}
            role="cancel"
            onPress={() => alert("Settings")}
          />
        </Host>*/}
      </View>
      {/*<SegmentedControl
        values={["Today", "Month", "Year"]}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />*/}
      <LiquidGlassView
        style={{
          borderRadius: 24,
          justifyContent: "center",
          alignItems: "center",
          borderColor: "white",
          borderStyle: "solid",
          display: "flex",
          padding: 20,
          gap: 2,
          width: "100%",
        }}
      >
        {/*<Host matchContents>
          <Picker
            modifiers={[
              pickerStyle("segmented"),
              background("transparent"),
            ]}
          >
            <ExpoText modifiers={[tag("day")]}>Today</ExpoText>
            <ExpoText modifiers={[tag("week")]}>Today</ExpoText>
            <ExpoText modifiers={[tag("month")]}>Month</ExpoText>
            <ExpoText modifiers={[tag("year")]}>Year</ExpoText>
          </Picker>
        </Host>*/}
        {/*<SegmentedControl
          style={{}}
          tintColor="red"
          values={["Today 2", "Month", "Year"]}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />*/}
        <View className="flex flex-row gap-1 justify-evenly">
          {/*<View className="flex-row flex-wrap gap-2">*/}
          {stats.map((stat) => (
            <View
              key={stat.label}
              className="flex items-center flex-1 rounded-2xl px-2"
            >
              <Text className="text-lg font-bold text-slate-950 dark:text-white whitespace-nowrap">
                {stat.value}
              </Text>
              <Text className="mt-1 text text-neutral-500 dark:text-neutral-400">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
        {/*</View>*/}
      </LiquidGlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  glassView: {
    // position: "absolute",
    // zIndex: 100,
    // top: 100,
    // left: 0,
    // right: 0,
    // left: 50,
    // width: 200,
    // height: 92,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // boxShadow: "inset 0 2px 4px red",
    // boxShadow: "0 10px 50px 5px rgb(0 0 0 / 0.1)",
    // borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
  },
  glass2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 20,
  },
  glass3: {
    width: 60,
    height: 40,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
