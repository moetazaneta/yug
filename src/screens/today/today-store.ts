import { create } from "zustand";

import { useTabBarVisibilityStore } from "@/src/shared/ui/navigation/tab-bar-visibility-store";

type TodayState = {
  isEditing: boolean;
  selectedQuestionIds: string[];
  enterEdit: () => void;
  exitEdit: () => void;
  removeSelectedQuestionIds: (questionIds: string[]) => void;
  setSelectedQuestionIds: (questionIds: string[]) => void;
  toggleSelectedQuestionId: (questionId: string) => void;
  cleanup: () => void;
};

export const useTodayStore = create<TodayState>((set) => ({
  isEditing: false,
  selectedQuestionIds: [],
  enterEdit: () => {
    set({ isEditing: true });
    useTabBarVisibilityStore.getState().setTabBarHidden(true);
  },
  exitEdit: () => {
    set({ isEditing: false, selectedQuestionIds: [] });
    useTabBarVisibilityStore.getState().setTabBarHidden(false);
  },
  removeSelectedQuestionIds: (questionIds) =>
    set((state) => ({
      selectedQuestionIds: state.selectedQuestionIds.filter(
        (questionId) => !questionIds.includes(questionId),
      ),
    })),
  setSelectedQuestionIds: (selectedQuestionIds) => set({ selectedQuestionIds }),
  toggleSelectedQuestionId: (questionId) =>
    set((state) => ({
      selectedQuestionIds: state.selectedQuestionIds.includes(questionId)
        ? state.selectedQuestionIds.filter((id) => id !== questionId)
        : [...state.selectedQuestionIds, questionId],
    })),
  cleanup: () => useTabBarVisibilityStore.getState().setTabBarHidden(false),
}));
