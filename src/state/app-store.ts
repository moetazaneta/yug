import { create } from "zustand";

import { APP_PRIMARY_COLOR_DEFAULT } from "@/src/shared/theme/colors";

export type ThemePreference = "system" | "light" | "dark";

type AppState = {
  hasCompletedOnboarding: boolean;
  primaryColor: string;
  themePreference: ThemePreference;
  completeOnboarding: () => void;
  setPrimaryColor: (primaryColor: string) => void;
  setThemePreference: (themePreference: ThemePreference) => void;
};

export const useAppStore = create<AppState>((set) => ({
  hasCompletedOnboarding: false,
  primaryColor: APP_PRIMARY_COLOR_DEFAULT,
  themePreference: "system",
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  setPrimaryColor: (primaryColor) => set({ primaryColor }),
  setThemePreference: (themePreference) => set({ themePreference }),
}));
