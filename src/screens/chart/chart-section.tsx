import type { ReactNode } from "react";
import { View } from "react-native";

export function ChartSection({ children }: { children: ReactNode }) {
  return (
    <View className="border-t border-neutral-200 py-5 dark:border-neutral-800">{children}</View>
  );
}
