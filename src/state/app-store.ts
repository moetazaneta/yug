import { create } from "zustand";

type AppState = {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  hasCompletedOnboarding: false,
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
}));
