import { ScrollView, Text } from "react-native";

export function TodayLoadingState() {
  return (
    <ScrollView
      className="z-10 flex-1 bg-white"
      contentContainerClassName="relative px-3 pb-28 pt-2"
    >
      <Text className="text-slate-600 dark:text-slate-300">Loading questions...</Text>
    </ScrollView>
  );
}
