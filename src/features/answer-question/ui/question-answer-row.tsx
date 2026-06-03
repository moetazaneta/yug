import { Pressable, Text, TextInput, View } from "react-native";

import type { AnswerQuestionProps } from "@/src/features/answer-question/model";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/src/shared/lib/cn";
import { GlassCheckbox } from "@/src/shared/ui/glass/glass-checkbox";

export function QuestionAnswerRow({ question, value, onChange }: AnswerQuestionProps) {
  return (
    <View className="flex-row items-center gap-2 py-2">
      <View className="size-8 items-center justify-center">
        <Text className="text-base">{question.icon}</Text>
      </View>
      <View className="min-w-0 flex-1">
        <Text className="font-semibold text-slate-950 dark:text-white" numberOfLines={1}>
          {question.title}
        </Text>
      </View>
      <QuestionAnswerControl question={question} value={value} onChange={onChange} />
    </View>
  );
}

export function QuestionAnswerControl({ question, value, onChange }: AnswerQuestionProps) {
  const checked = value === "true" || value === true;
  const theme = useTheme();
  const inputClassName =
    "h-8 rounded-xl border-2 border-neutral-200 bg-transparent px-2 text-right text-sm text-neutral-950 placeholder:text-neutral-500 dark:text-white";

  if (question.valueType === "boolean") {
    return (
      <GlassCheckbox
        value={checked}
        onValueChange={(nextChecked) => {
          onChange(nextChecked);
        }}
      />
    );
  }

  if (question.valueType === "choice") {
    return (
      <View className="h-8 flex-row overflow-hidden rounded-xl border-2 border-neutral-200 bg-transparent">
        {["Yes", "No"].map((choice) => (
          <Pressable
            key={choice}
            className="items-center justify-center px-2"
            onPress={() => onChange(choice)}
          >
            <Text
              className="text-xs font-semibold text-neutral-600 dark:text-neutral-300"
              style={value === choice ? { color: theme.primary } : undefined}
            >
              {choice}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  }

  if (question.valueType === "number") {
    return (
      <TextInput
        className={cn(inputClassName, "w-16")}
        style={{ fontFamily: "SpaceMono" }}
        placeholder={question.valueUnits ? question.valueUnits.slice(0, 3) : "0"}
        placeholderTextColor={theme.textDim}
        selectionColor={theme.primary}
        keyboardType="decimal-pad"
        returnKeyType="done"
        value={value !== undefined ? String(value) : undefined}
        onChangeText={onChange}
      />
    );
  }

  return (
    <TextInput
      className={cn(inputClassName, "min-w-24")}
      placeholder={question.valueUnits || "Value"}
      placeholderTextColor={theme.textDim}
      selectionColor={theme.primary}
      returnKeyType="done"
      value={value !== undefined ? String(value) : undefined}
      onChangeText={onChange}
    />
  );
}
