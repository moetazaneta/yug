import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, StyleSheet, View, type ViewProps } from "react-native";

import { theme } from "@/src/theme/tokens";

type GlassCardProps = ViewProps & {
  intensity?: number;
};

export function GlassCard({ children, intensity = 34, style, ...props }: GlassCardProps) {
  return (
    <View style={[styles.shadow, style]} {...props}>
      <BlurView
        intensity={Platform.OS === "ios" ? intensity : 18}
        tint="systemChromeMaterial"
        style={styles.card}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.72)", "rgba(255,255,255,0.18)", "rgba(91,140,255,0.10)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: theme.radius.card,
    overflow: "hidden",
    shadowColor: "#4f5dff",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
  },
  card: {
    borderRadius: theme.radius.card,
    overflow: "hidden",
  },
  content: {
    borderColor: "rgba(255,255,255,0.42)",
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
});
