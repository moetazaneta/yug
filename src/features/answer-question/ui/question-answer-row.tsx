import { Pressable, Text, TextInput, View } from "react-native";

import type { AnswerQuestionProps } from "@/src/features/answer-question/model";
import { cn } from "@/src/shared/lib/cn";
import { GlassCheckbox } from "@/src/shared/ui/glass/glass-checkbox";

export function QuestionAnswerRow({ question, value, onChange }: AnswerQuestionProps) {
  const checked = value === "true" || value === true;

  return (
    <View className="flex-row items-center gap-3 py-2">
      <View
        className="size-8 items-center justify-center rounded-full"
        style={{ backgroundColor: `${question.color}22` }}
      >
        <Text className="text-base">{question.icon}</Text>
      </View>
      <View className="min-w-0 flex-1">
        <Text className="font-semibold text-slate-950 dark:text-white" numberOfLines={1}>
          {question.title}
        </Text>
      </View>
      {question.valueType === "boolean" ? (
        <GlassCheckbox
          value={checked}
          onValueChange={(nextChecked) => {
            onChange(nextChecked);
          }}
        />
      ) : question.valueType === "choice" ? (
        <View className="flex-row overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {["Yes", "No"].map((choice) => (
            <Pressable key={choice} className="px-3 py-2" onPress={() => onChange(choice)}>
              <Text className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                {choice}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : question.valueType === "number" ? (
        <TextInput
          className={cn(
            "h-8 w-16 rounded-full border-2 border-neutral-300 bg-white px-3 text-right text-sm text-neutral-900 placeholder:text-black dark:bg-slate-800 dark:text-white",
            value !== undefined && "border-sky-400 bg-white text-black",
          )}
          style={{ fontFamily: "SpaceMono" }}
          placeholder={question.valueUnits ? question.valueUnits.slice(0, 3) : "0"}
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
          returnKeyType="done"
          value={value !== undefined ? String(value) : undefined}
          onChangeText={onChange}
        />
      ) : (
        <TextInput
          className="min-w-24 rounded-full bg-slate-100 px-3 py-1.5 text-right text-slate-950 dark:bg-slate-800 dark:text-white"
          placeholder={question.valueUnits || "Value"}
          placeholderTextColor="#94A3B8"
          returnKeyType="done"
          value={value !== undefined ? String(value) : undefined}
          onChangeText={onChange}
        />
      )}
    </View>
  );
}
