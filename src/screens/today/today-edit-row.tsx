import { Pressable, Text, View } from "react-native";

import type { Question } from "@/src/entities/question/model";
import { cn } from "@/src/shared/lib/cn";

type TodayEditRowProps = {
  question: Question;
  isSelected: boolean;
  onToggle: () => void;
};

export function TodayEditRow({
  question,
  isSelected,
  onToggle,
}: TodayEditRowProps) {
  return (
    <Pressable
      className={cn(
        "flex-row items-center gap-3 rounded-lg py-2",
        isSelected && "bg-neutral-100",
      )}
      onPress={onToggle}
    >
      <View
        className={cn(
          "size-6 items-center justify-center rounded-full border-2",
          isSelected
            ? "border-neutral-950 bg-neutral-950"
            : "border-neutral-300",
        )}
      >
        {isSelected ? (
          <Text className="text-xs font-bold text-white">✓</Text>
        ) : null}
      </View>
      <View className="size-8 items-center justify-center">
        <Text className="text-base">{question.icon}</Text>
      </View>
      <View className="min-w-0 flex-1">
        <Text className="font-semibold text-slate-950" numberOfLines={1}>
          {question.title}
        </Text>
      </View>
      <Text className="text-xl text-neutral-400">≡</Text>
    </Pressable>
  );
}
