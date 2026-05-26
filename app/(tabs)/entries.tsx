import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";

import { GlassCard } from "@/src/components/glass/GlassCard";
import { listEntries } from "@/src/data/repositories/entries";

export default function EntriesScreen() {
  const entries = useQuery({ queryKey: ["entries"], queryFn: listEntries });

  return (
    <View className="flex-1 bg-slate-50 px-5 pt-20 dark:bg-black">
      <Text className="mb-5 text-3xl font-bold text-slate-950 dark:text-white">Entries</Text>
      <GlassCard>
        <Text className="text-base text-slate-700 dark:text-slate-200">
          {entries.data?.length
            ? `${entries.data.length} entries stored locally.`
            : "No entries yet."}
        </Text>
      </GlassCard>
    </View>
  );
}
