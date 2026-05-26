import { GlassContainer, GlassView } from "expo-glass-effect";
import { Pressable, View } from "react-native";

import {
  LiquidGlassView,
  LiquidGlassContainerView,
  isLiquidGlassSupported,
} from "@callstack/liquid-glass";
import { useState } from "react";
import { cn } from "@/src/lib/cn";

export function Checkbox({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (checked: boolean) => void;
}) {
  return (
    <Pressable onPress={() => onValueChange(!value)}>
      <View
        className={cn(
          "transition-colors w-8 h-8 flex border-2 border-gray-300 rounded-xl items-center justify-center",
          value && `border-sky-600`,
        )}
      >
        <View
          className={cn("size-4 rounded transition-colors", {
            "bg-sky-600": value,
            "bg-transparent": !value,
          })}
        />
      </View>
    </Pressable>
  );
}
