import { Button, Host } from "@expo/ui";
import { router } from "expo-router";
import { Text, View } from "react-native";

import { useAppStore } from "@/src/state/app-store";

export function TodayEmptyState() {
  const tintColor = useAppStore((state) => state.primaryColor);

  const openCreateQuestion = () => {
    router.push("/create-question");
  };

  return (
    <View className="z-10 flex-1 bg-white flex flex-col justify-center">
      <View className="items-center rounded-[28px] bg-white px-6 py-10 dark:bg-slate-900">
        <Text className="text-center text-2xl font-bold text-slate-950 dark:text-white">
          No questions yet
        </Text>
        <Text className="mt-3 mb-6 text-center text-base leading-6 text-slate-600 dark:text-slate-300">
          Create your first daily question. Answering it will start building your entries.
        </Text>
        <Host matchContents>
          <Button
            label="Create question"
            style={{
              backgroundColor: tintColor,
              borderRadius: 14,
              paddingHorizontal: 18,
              paddingVertical: 12,
            }}
            onPress={openCreateQuestion}
          />
        </Host>
      </View>
    </View>
  );
}
