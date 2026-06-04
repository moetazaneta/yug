import {
  Button,
  ColorPicker,
  Form,
  Host,
  LabeledContent,
  Picker,
  Section,
  Text,
} from "@expo/ui/swift-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pickerStyle, tag, tint } from "@expo/ui/swift-ui/modifiers";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { useMemo } from "react";

import { entryQueryKeys } from "@/src/entities/entry/queries";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { seedRandomEntries, seedRandomQuestions } from "@/src/shared/db/seed";
import { useAppStore, type ThemePreference } from "@/src/state/app-store";

const themeOptions = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
] as const satisfies readonly { label: string; value: ThemePreference }[];

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
      <Host style={{ flex: 1 }} useViewportSizeMeasurement>
        <Form
          modifiers={[
            // headerProminence("increased"),
            tint(primaryColor),
            // scrollContentBackground("hidden"),
            // background("white"),
          ]}
        >
          <Section title="Appearance">
            <Picker
              label="Theme"
              modifiers={[pickerStyle("menu")]}
              selection={themePreference}
              onSelectionChange={setThemePreference}
            >
              {themeOptions.map((option) => (
                <Text key={option.value} modifiers={[tag(option.value)]}>
                  {option.label}
                </Text>
              ))}
            </Picker>
            <ColorPicker
              label="Primary Color"
              selection={primaryColor}
              onSelectionChange={setPrimaryColor}
            />
          </Section>
          <Section title="Developer">
            <Button
              label={seedQuestionsMutation.isPending ? "Seeding questions..." : "Seed 5 Questions"}
              onPress={() => seedQuestionsMutation.mutate()}
            />
            <Button
              label={seedEntriesMutation.isPending ? "Seeding entries..." : "Seed 25 Entries"}
              onPress={() => seedEntriesMutation.mutate()}
            />
            {seedQuestionsMutation.error ? (
              <Text>Could not seed questions. {seedQuestionsMutation.error.message}</Text>
            ) : null}
            {seedEntriesMutation.error ? (
              <Text>Could not seed entries. {seedEntriesMutation.error.message}</Text>
            ) : null}
          </Section>
          <Section title="About">
            <LabeledContent label="App Version">
              <Text>{appVersion}</Text>
            </LabeledContent>
          </Section>
        </Form>
      </Host>
    </>
  );
}

function getAppVersion() {
  const version = Constants.expoConfig?.version ?? "1.0.0";
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ?? Constants.expoConfig?.android?.versionCode;

  return buildNumber ? `${version} (${buildNumber})` : version;
}
