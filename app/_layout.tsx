import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { Uniwind } from "uniwind";
import "@/global.css";

import { useColorScheme } from "@/components/useColorScheme";
import { AppProviders } from "@/src/providers/app-providers";
import { useAppStore } from "@/src/state/app-store";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const primaryColor = useAppStore((state) => state.primaryColor);
  const themePreference = useAppStore((state) => state.themePreference);
  const effectiveColorScheme = themePreference === "system" ? colorScheme : themePreference;
  const navigationTheme = useMemo(() => {
    const baseTheme = effectiveColorScheme === "dark" ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: primaryColor,
      },
    };
  }, [effectiveColorScheme, primaryColor]);

  useEffect(() => {
    Uniwind.setTheme(themePreference);
  }, [themePreference]);

  return (
    <AppProviders>
      <ThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen
            name="create-question"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.72],
            }}
          />
          <Stack.Screen
            name="entries-edit"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.8],
            }}
          />
        </Stack>
      </ThemeProvider>
    </AppProviders>
  );
}
