import { GlassView } from "expo-glass-effect";
import { Platform, StyleSheet, View, type ViewProps } from "react-native";

import { theme } from "@/src/shared/theme/tokens";

type GlassCardProps = ViewProps & {
  isInteractive?: boolean;
};

export function GlassCard({ children, isInteractive, style, ...props }: GlassCardProps) {
  if (Platform.OS === "ios") {
    const interactiveProps = isInteractive === undefined ? {} : { isInteractive };

    return (
      <GlassView
        glassEffectStyle="clear"
        style={[styles.card, style]}
        {...interactiveProps}
        {...props}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View style={[styles.fallbackCard, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.card,
    overflow: "hidden",
    padding: 20,
  },
  fallbackCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: theme.radius.card,
    padding: 20,
  },
});
