import { SymbolView } from "expo-symbols";
import { Text, TouchableOpacity, View } from "react-native";

export function EmptyTodayState({ tint, onCreate }: { tint: string; onCreate: () => void }) {
  return (
    <View className="items-center rounded-[28px] bg-white px-6 py-10 dark:bg-slate-900">
      <View className="mb-5 size-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <SymbolView name="sparkles" tintColor={tint} size={36} />
      </View>
      <Text className="text-center text-2xl font-bold text-slate-950 dark:text-white">
        No questions yet
      </Text>
      <Text className="mt-3 text-center text-base leading-6 text-slate-600 dark:text-slate-300">
        Create your first daily question. Answering it will start building your entries.
      </Text>
      <TouchableOpacity
        activeOpacity={0.85}
        className="mt-6 rounded-full px-6 py-3"
        style={{ backgroundColor: tint }}
        onPress={onCreate}
      >
        <Text className="font-bold text-white">Create question</Text>
      </TouchableOpacity>
    </View>
  );
}
