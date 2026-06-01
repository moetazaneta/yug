import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        // headerShown: false,
        // headerShadowVisible: false,
        // headerTransparent: true,
      }}
    />
  );
}
