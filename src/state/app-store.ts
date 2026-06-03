import { create } from "zustand";

export type ThemePreference = "system" | "light" | "dark";

type AppState = {
  hasCompletedOnboarding: boolean;
  themePreference: ThemePreference;
  completeOnboarding: () => void;
  setThemePreference: (themePreference: ThemePreference) => void;
};

export const useAppStore = create<AppState>((set) => ({
  hasCompletedOnboarding: false,
  themePreference: "system",
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  setThemePreference: (themePreference) => set({ themePreference }),
}));
