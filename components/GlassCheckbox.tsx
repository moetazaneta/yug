import { GlassContainer, GlassView } from "expo-glass-effect";
import { Pressable, View } from "react-native";

import {
  LiquidGlassView,
  LiquidGlassContainerView,
  isLiquidGlassSupported,
} from "@callstack/liquid-glass";
import { useState } from "react";
import { SymbolView } from "expo-symbols";
import { PlatformColor } from "react-native-reanimated";
import { cn } from "@/src/lib/cn";
import { useTheme } from "@/hooks/use-theme";

export function GlassCheckbox({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange?: (checked: boolean) => void;
}) {
  const theme = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  return (
    <Pressable
      onPressIn={() => onValueChange?.(!value)}
      // onPressOut={() => value && onValueChange?.(!value)}
      // onPress={() => onValueChange?.(!value)}
      // onPressIn={() => setIsPressed(true)}
      // onPressOut={() => setIsPressed(false)}
    >
      <View
        className={cn(
          `size-8 flex items-center justify-center border-2 border-neutral-200 rounded-xl`,
          value && "border-transparent",
        )}
      >
        <View
        // className={` ${value ? "bg-emerald-100 size-8" : ""}`}
        >
          {value && (
            <SymbolView
              name="checkmark"
              tintColor={theme.primary}
              size={16}
              weight={"bold"}
            />
          )}
        </View>
        <GlassView
          isInteractive
          glassEffectStyle={{
            // style: isPressed || value ? "clear" : "none",
            style: "clear",
            // animate: true,
          }}
          style={{
            opacity: isPressed || value ? 1 : 0.1,
            borderRadius: 14,
            position: "absolute",
            // top: -4,
            // left: -9,
            // right: -4,
            // bottom: -4,
            padding: 8,
            width: 36,
            height: 36,
          }}
        >
          {(isPressed || value) && (
            <SymbolView
              name="checkmark"
              tintColor={theme.primary}
              size={20}
              weight={"semibold"}
            />
          )}
        </GlassView>
        {/*</GlassContainer>*/}
      </View>
    </Pressable>
  );
}
