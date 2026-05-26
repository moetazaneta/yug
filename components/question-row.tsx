import { Pressable, Switch, Text, TextInput, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { type Question } from "@/src/data/repositories/questions";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/src/lib/cn";
import { GlassCheckbox } from "./GlassCheckbox";

export function QuestionRow({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string | number | boolean | undefined;
  onChange: (value: string | number | boolean | undefined) => void;
}) {
  const theme = useTheme();

  return (
    <View className="flex-row items-center gap-3 py-2 ">
      <View
        className="size-8 items-center justify-center rounded-full"
        style={{ backgroundColor: `${question.color}22` }}
      >
        <Text className="text-base">{question.icon}</Text>
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className="font-semibold text-slate-950 dark:text-white"
          numberOfLines={1}
        >
          {question.title}
        </Text>
      </View>
      {question.valueType === "boolean" ? (
        <GlassCheckbox
          value={value === "true" || value === true}
          onValueChange={(checked) => {
            onChange(checked);
          }}
        />
      ) : // <Switch
      //   style={{
      //     backgroundColor: "lime",
      //     borderRadius: 0,
      //   }}
      //   value={value === "true" || value === true}
      //   trackColor={{ true: theme.primary }}
      //   ios_backgroundColor={theme.surface1}
      //   onValueChange={(checked) => {
      //     onChange(checked);
      //   }}
      // />
      question.valueType === "choice" ? (
        <View className="flex-row overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {["Yes", "No"].map((choice) => (
            <Pressable
              key={choice}
              className="px-3 py-2"
              onPress={() => {
                onChange(choice);
              }}
            >
              <Text className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                {choice}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : question.valueType === "number" ? (
        <TextInput
          className={cn(
            "w-16 h-8 rounded-full border-2 border-neutral-300 bg-white px-3 text-right text-neutral-900 dark:bg-slate-800 dark:text-white placeholder:text-black text-sm",
            {
              "border-2 border-sky-400 bg-white text-black":
                value !== undefined,
            },
          )}
          style={{ fontFamily: "SpaceMono" }}
          placeholder={
            question.valueUnits ? `${question.valueUnits.slice(0, 3)}` : "0"
          }
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
