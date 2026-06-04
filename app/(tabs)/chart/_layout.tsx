import { Stack } from "expo-router";

export default function ChartLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTransparent: true,
      }}
    />
  );
}
