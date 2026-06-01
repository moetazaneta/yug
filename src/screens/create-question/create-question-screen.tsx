import { SegmentedControl } from "@expo/ui/community/segmented-control";
import { useQueryClient } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  PlatformColor,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { QuestionValueType } from "@/src/entities/question/model";
import {
  questionColorOptions,
  questionPalette,
  questionValueTypes,
} from "@/src/features/create-question/model";
import { useCreateQuestionMutation } from "@/src/features/create-question/queries";
import { toDayKey } from "@/src/shared/lib/date";
import { todayQueryKeys } from "@/src/screens/today/service";

const valueTypeLabels: string[] = questionValueTypes.map((type) =>
  labelValueType(type),
);

export function CreateQuestionScreen() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [valueType, setValueType] = useState<QuestionValueType>("boolean");
  const [valueUnits, setValueUnits] = useState("");
  const [icon, setIcon] = useState("✨");
  const [color, setColor] = useState(questionPalette[0]!);
  const mutation = useCreateQuestionMutation();
  const isDisabled = title.trim().length === 0 || mutation.isPending;

  function close() {
    Keyboard.dismiss();
    router.back();
  }

  function save() {
    Keyboard.dismiss();
    mutation.mutate(
      {
        icon,
        title: title.trim(),
        description: description.trim(),
        color,
        valueType,
        valueUnits: valueUnits.trim(),
        repeat: "daily",
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: todayQueryKeys.view(toDayKey(new Date())),
          });
          router.back();
        },
        onError: (error) => {
          console.error("Could not save question", error);
        },
      },
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Header transparent />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="xmark" onPress={close} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          disabled={isDisabled}
          icon="checkmark"
          tintColor="primary"
          variant="done"
          onPress={save}
        />
      </Stack.Toolbar>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {mutation.error ? (
          <Text className="rounded-2xl bg-red-50 px-4 py-3 text-base text-red-600 dark:bg-red-950/40 dark:text-red-300">
            Could not save question. {mutation.error.message}
          </Text>
        ) : null}
        <TextInput
          className="rounded-2xl bg-gray-100 px-4 text-base text-slate-950 dark:bg-slate-900 dark:text-white"
          placeholder="Title"
          placeholderTextColor="#94A3B8"
          returnKeyType="next"
          style={styles.singleLineInput}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="rounded-2xl bg-gray-100 px-4 text-base text-slate-950 dark:bg-slate-900 dark:text-white"
          multiline
          placeholder="Description"
          placeholderTextColor="#94A3B8"
          style={styles.multilineInput}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
        <View className="flex-row gap-2">
          <TextInput
            className="w-20 rounded-2xl bg-gray-100 px-4 text-center text-base text-slate-950 dark:bg-slate-900 dark:text-white"
            maxLength={4}
            placeholder="Icon"
            placeholderTextColor="#94A3B8"
            style={styles.singleLineInput}
            value={icon}
            onChangeText={setIcon}
          />
          <TextInput
            className="flex-1 rounded-2xl bg-gray-100 px-4 text-base text-slate-950 dark:bg-slate-900 dark:text-white"
            placeholder="Units, optional"
            placeholderTextColor="#94A3B8"
            style={styles.singleLineInput}
            value={valueUnits}
            onChangeText={setValueUnits}
          />
        </View>
        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Type
          </Text>
          <SegmentedControl
            selectedIndex={questionValueTypes.indexOf(valueType)}
            style={styles.segmentedControl}
            values={valueTypeLabels}
            onValueChange={(nextValue) => {
              const nextIndex = valueTypeLabels.indexOf(nextValue);
              const nextType = questionValueTypes[nextIndex];

              if (nextType) {
                setValueType(nextType);
              }
            }}
          />
        </View>
        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Color
          </Text>
          <View className="flex-row flex-wrap gap-2 justify-between">
            {questionColorOptions.map((swatch) => (
              <Pressable
                key={swatch.token}
                accessibilityLabel={swatch.token}
                accessibilityRole="button"
                className="size-11 rounded-3xl"
                style={{
                  backgroundColor: swatch.value,
                  borderColor:
                    color === swatch.value
                      ? PlatformColor("label")
                      : "transparent",
                  borderWidth: 2,
                }}
                onPress={() => setColor(swatch.value)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function labelValueType(valueType: QuestionValueType) {
  switch (valueType) {
    case "boolean":
      return "Yes/No";
    case "number":
      return "Number";
    case "text":
      return "Text";
    case "choice":
      return "Choice";
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  content: {
    gap: 16,
    paddingBottom: 32,
    paddingHorizontal: 18,
    paddingTop: 80,
  },
  multilineInput: {
    minHeight: 96,
    paddingBottom: 12,
    paddingTop: 12,
  },
  segmentedControl: {
    height: 36,
    width: "100%",
  },
  singleLineInput: {
    height: 52,
    paddingVertical: 0,
  },
  scrollView: {
    flex: 1,
  },
});
