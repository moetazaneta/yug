import { GlassView } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/src/shared/lib/cn";

export function GlassCheckbox({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange?: (checked: boolean) => void;
}) {
  const theme = useTheme();

  return (
    <Pressable onPress={() => onValueChange?.(!value)}>
      <View
        className={cn(
          "size-8 items-center justify-center rounded-xl border-2 border-neutral-200",
          value && "border-transparent",
        )}
      >
        {value ? (
          <SymbolView name="checkmark" tintColor={theme.primary} size={16} weight="bold" />
        ) : null}
        <GlassView
          isInteractive
          glassEffectStyle={{ style: "clear" }}
          style={{
            opacity: value ? 1 : 0.1,
            borderRadius: 14,
            height: 36,
            padding: 8,
            position: "absolute",
            width: 36,
          }}
        >
          {value ? (
            <SymbolView name="checkmark" tintColor={theme.primary} size={20} weight="semibold" />
          ) : null}
        </GlassView>
      </View>
    </Pressable>
  );
}
