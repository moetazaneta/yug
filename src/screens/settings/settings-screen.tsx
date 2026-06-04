import { SegmentedControl } from "@expo/ui/community/segmented-control";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { entryQueryKeys } from "@/src/entities/entry/queries";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { seedRandomEntries, seedRandomQuestions } from "@/src/shared/db/seed";
import { useAppStore, type ThemePreference } from "@/src/state/app-store";
import { appPrimaryColorOptions } from "@/src/shared/theme/colors";

const themeValues = ["System", "Light", "Dark"] as const;
const themePreferences = ["system", "light", "dark"] as const satisfies readonly ThemePreference[];

export function SettingsScreen() {
  const primaryColor = useAppStore((state) => state.primaryColor);
  const setPrimaryColor = useAppStore((state) => state.setPrimaryColor);
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const appVersion = useMemo(() => getAppVersion(), []);
  const queryClient = useQueryClient();

  const invalidateSeededData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: questionQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: entryQueryKeys.all }),
    ]);
  };

  const seedQuestionsMutation = useMutation({
    mutationFn: () => seedRandomQuestions(5),
    onSuccess: invalidateSeededData,
  });
  const seedEntriesMutation = useMutation({
    mutationFn: () => seedRandomEntries(25),
    onSuccess: invalidateSeededData,
  });

  return (
    <>
      <Stack.Title>Settings</Stack.Title>
      <ScrollView
        className="flex-1 bg-white dark:bg-black"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title="Appearance">
          <View className="gap-3 py-4">
            <Text className="text-base font-medium text-neutral-950 dark:text-white">Theme</Text>
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
          <Separator />
          <View className="gap-3 py-4">
            <Text className="text-base font-medium text-neutral-950 dark:text-white">
              Primary Color
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {appPrimaryColorOptions.map((color) => (
                <Pressable
                  key={color}
                  accessibilityRole="button"
                  accessibilityState={{ selected: color === primaryColor }}
                  className="size-10 rounded-full"
                  style={[
                    { backgroundColor: color },
                    color === primaryColor ? styles.selectedSwatch : null,
                  ]}
                  onPress={() => setPrimaryColor(color)}
                />
              ))}
            </View>
          </View>
        </SettingsSection>

        <SettingsSection title="Developer">
          <SettingsButton
            isPending={seedQuestionsMutation.isPending}
            label={seedQuestionsMutation.isPending ? "Seeding questions..." : "Seed 5 Questions"}
            onPress={() => seedQuestionsMutation.mutate()}
          />
          <Separator />
          <SettingsButton
            isPending={seedEntriesMutation.isPending}
            label={seedEntriesMutation.isPending ? "Seeding entries..." : "Seed 25 Entries"}
            onPress={() => seedEntriesMutation.mutate()}
          />
          {seedQuestionsMutation.error ? (
            <Text className="pb-4 text-sm text-red-600 dark:text-red-400">
              Could not seed questions. {seedQuestionsMutation.error.message}
            </Text>
          ) : null}
          {seedEntriesMutation.error ? (
            <Text className="pb-4 text-sm text-red-600 dark:text-red-400">
              Could not seed entries. {seedEntriesMutation.error.message}
            </Text>
          ) : null}
        </SettingsSection>

        <SettingsSection title="About">
          <View className="flex-row items-center justify-between py-4">
            <Text className="text-base font-medium text-neutral-950 dark:text-white">
              App Version
            </Text>
            <Text className="text-base text-neutral-500 dark:text-neutral-400">{appVersion}</Text>
          </View>
        </SettingsSection>
      </ScrollView>
    </>
  );
}

function SettingsButton({
  isPending,
  label,
  onPress,
}: {
  isPending: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isPending}
      className="flex-row items-center justify-between py-4"
      onPress={onPress}
    >
      <Text className="text-base font-medium text-neutral-950 dark:text-white">{label}</Text>
      <Text className="text-base text-neutral-500 dark:text-neutral-400">Run</Text>
    </Pressable>
  );
}

function SettingsSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <View className="border-t border-neutral-200 dark:border-neutral-800">
      <Text className="pt-5 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Separator() {
  return <View className="h-px bg-neutral-200 dark:bg-neutral-800" />;
}

function getAppVersion() {
  const version = Constants.expoConfig?.version ?? "1.0.0";
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ?? Constants.expoConfig?.android?.versionCode;

  return buildNumber ? `${version} (${buildNumber})` : version;
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 112,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  segmentedControl: {
    height: 36,
  },
  selectedSwatch: {
    borderColor: "#111111",
    borderWidth: 3,
  },
});
