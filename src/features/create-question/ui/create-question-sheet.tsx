import { SegmentedControl } from "@expo/ui/community/segmented-control";
import { GlassView } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  Keyboard,
  Modal,
  PlatformColor,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { QuestionValueType } from "@/src/entities/question/model";
import {
  questionColorOptions,
  questionPalette,
  questionValueTypes,
} from "@/src/features/create-question/model";
import { useCreateQuestionMutation } from "@/src/features/create-question/queries";

const valueTypeLabels: string[] = questionValueTypes.map((type) => labelValueType(type));

export function CreateQuestionSheet({
  visible,
  onClose,
  onCreated,
}: {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [valueType, setValueType] = useState<QuestionValueType>("boolean");
  const [valueUnits, setValueUnits] = useState("");
  const [icon, setIcon] = useState("✨");
  const [color, setColor] = useState(questionPalette[0]!);
  const mutation = useCreateQuestionMutation();
  const isDisabled = title.trim().length === 0 || mutation.isPending;

  function handleClose() {
    Keyboard.dismiss();
    onClose();
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setValueType("boolean");
    setValueUnits("");
    setIcon("✨");
    setColor(questionPalette[0]!);
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
        onSuccess: () => {
          resetForm();
          onCreated?.();
          onClose();
        },
        onError: (error) => {
          console.error("Could not save question", error);
        },
      },
    );
  }

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={visible}
      onRequestClose={handleClose}
    >
      <View
        className="flex-1 bg-slate-50 px-4 dark:bg-black"
        style={{ paddingBottom: Math.max(insets.bottom, 16), paddingTop: 10 }}
      >
        <View className="mb-3 min-h-11 justify-center">
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            hitSlop={8}
            style={styles.leftHeaderButton}
            onPress={handleClose}
          >
            <GlassView isInteractive glassEffectStyle="clear" style={styles.headerButton}>
              <SymbolView
                name="xmark"
                weight="semibold"
                tintColor={PlatformColor("secondaryLabel")}
                size={15}
              />
            </GlassView>
          </Pressable>
          <View pointerEvents="none" style={styles.headerTitle}>
            <Text className="text-lg font-bold text-slate-950 dark:text-white">New question</Text>
          </View>
          <Pressable
            accessibilityLabel="Save question"
            accessibilityRole="button"
            disabled={isDisabled}
            hitSlop={8}
            style={[styles.rightHeaderButton, isDisabled && styles.disabledButton]}
            onPress={save}
          >
            <GlassView
              isInteractive={!isDisabled}
              glassEffectStyle="clear"
              style={styles.headerButton}
            >
              <SymbolView
                name="checkmark"
                weight="semibold"
                tintColor={PlatformColor(isDisabled ? "tertiaryLabel" : "label")}
                size={16}
              />
            </GlassView>
          </Pressable>
        </View>
        <ScrollView
          contentContainerClassName="gap-3 pb-6"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          {mutation.error ? (
            <Text className="rounded-2xl bg-red-50 px-4 py-3 text-base text-red-600 dark:bg-red-950/40 dark:text-red-300">
              Could not save question. {mutation.error.message}
            </Text>
          ) : null}
          <View className="gap-4">
            <TextInput
              className="rounded-2xl bg-white px-4 text-base text-slate-950 dark:bg-slate-900 dark:text-white"
              placeholder="Title"
              placeholderTextColor="#94A3B8"
              returnKeyType="next"
              style={styles.singleLineInput}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="rounded-2xl bg-white px-4 text-base text-slate-950 dark:bg-slate-900 dark:text-white"
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
                className="w-20 rounded-2xl bg-white px-4 text-center text-base text-slate-950 dark:bg-slate-900 dark:text-white"
                maxLength={4}
                placeholder="Icon"
                placeholderTextColor="#94A3B8"
                style={styles.singleLineInput}
                value={icon}
                onChangeText={setIcon}
              />
              <TextInput
                className="flex-1 rounded-2xl bg-white px-4 text-base text-slate-950 dark:bg-slate-900 dark:text-white"
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
              <View className="flex-row flex-wrap gap-3">
                {questionColorOptions.map((swatch) => (
                  <Pressable
                    key={swatch.token}
                    accessibilityLabel={swatch.token}
                    accessibilityRole="button"
                    className="size-11 rounded-full"
                    style={{
                      backgroundColor: swatch.value,
                      borderColor: color === swatch.value ? PlatformColor("label") : "transparent",
                      borderWidth: 2,
                    }}
                    onPress={() => setColor(swatch.value)}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
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
  disabledButton: {
    opacity: 0.45,
  },
  headerButton: {
    alignItems: "center",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    overflow: "hidden",
    width: 36,
  },
  headerTitle: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 72,
    position: "absolute",
    right: 72,
    top: 0,
  },
  leftHeaderButton: {
    left: 0,
    position: "absolute",
    top: 4,
  },
  multilineInput: {
    minHeight: 96,
    paddingBottom: 12,
    paddingTop: 12,
  },
  rightHeaderButton: {
    position: "absolute",
    right: 0,
    top: 4,
  },
  segmentedControl: {
    height: 36,
    width: "100%",
  },
  singleLineInput: {
    height: 52,
    paddingVertical: 0,
  },
});
