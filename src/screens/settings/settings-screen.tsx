import { SegmentedControl } from "@expo/ui/community/segmented-control";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppStore, type ThemePreference } from "@/src/state/app-store";

const themeValues = ["System", "Light", "Dark"] as const;
const themePreferences = ["system", "light", "dark"] as const satisfies readonly ThemePreference[];

export function SettingsScreen() {
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const appVersion = useMemo(() => getAppVersion(), []);

  return (
    <>
      <Stack.Title>Settings</Stack.Title>
      <View className="flex-1 bg-neutral-100 px-5 pt-16 dark:bg-black">
        <Text className="mb-6 text-3xl font-bold text-neutral-950 dark:text-white">Settings</Text>

        <View className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <View className="gap-3 border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
            <View>
              <Text className="text-base font-semibold text-neutral-950 dark:text-white">
                Theme
              </Text>
              <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Follow the system setting or choose an app appearance.
              </Text>
            </View>
            <SegmentedControl
              selectedIndex={themePreferences.indexOf(themePreference)}
              style={styles.segmentedControl}
              values={[...themeValues]}
              onValueChange={(value) => {
                const nextIndex = themeValues.indexOf(value as (typeof themeValues)[number]);
                const nextPreference = themePreferences[nextIndex];

                if (nextPreference) {
                  setThemePreference(nextPreference);
                }
              }}
            />
          </View>

          <View className="flex-row items-center justify-between px-4 py-4">
            <Text className="text-base font-semibold text-neutral-950 dark:text-white">
              App Version
            </Text>
            <Text className="text-base text-neutral-500 dark:text-neutral-400">{appVersion}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

function getAppVersion() {
  const version = Constants.expoConfig?.version ?? "1.0.0";
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ?? Constants.expoConfig?.android?.versionCode;

  return buildNumber ? `${version} (${buildNumber})` : version;
}

const styles = StyleSheet.create({
  segmentedControl: {
    height: 36,
  },
});
