import { create } from "zustand";

type TabBarVisibilityState = {
  isTabBarHidden: boolean;
  setTabBarHidden: (isTabBarHidden: boolean) => void;
};

export const useTabBarVisibilityStore = create<TabBarVisibilityState>((set) => ({
  isTabBarHidden: false,
  setTabBarHidden: (isTabBarHidden) => set({ isTabBarHidden }),
}));
