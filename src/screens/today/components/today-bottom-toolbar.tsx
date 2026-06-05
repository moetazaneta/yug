import { useMutation, useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useMemo } from "react";
import { Alert } from "react-native";

import {
  archiveTodayQuestionsMutationOptions,
  softDeleteTodayQuestionsMutationOptions,
  uncheckTodayQuestionsMutationOptions,
} from "../queries/mutation-options";
import { todayViewQueryOptions } from "../queries/query-options";
import { useTodayStore } from "../today-store";

export function TodayBottomToolbar() {
  const today = useMemo(() => new Date(), []);
  const todayQuery = useQuery(todayViewQueryOptions(today));
  const isEditing = useTodayStore((state) => state.isEditing);
  const selectedQuestionIds = useTodayStore(
    (state) => state.selectedQuestionIds,
  );

  const exitEdit = useTodayStore((state) => state.exitEdit);
  const setSelectedQuestionIds = useTodayStore(
    (state) => state.setSelectedQuestionIds,
  );

  const hasSelection = selectedQuestionIds.length > 0;
  const rows = todayQuery.data?.rows ?? [];
  const visibleQuestionIds = rows.map((row) => row.question.id);
  const selectedOrAllQuestionIds = hasSelection
    ? selectedQuestionIds
    : visibleQuestionIds;

  const uncheckMutation = useMutation(
    uncheckTodayQuestionsMutationOptions({
      onSuccess: () => setSelectedQuestionIds([]),
      today,
    }),
  );
  const archiveMutation = useMutation(
    archiveTodayQuestionsMutationOptions({ onSuccess: exitEdit, today }),
  );
  const softDeleteMutation = useMutation(
    softDeleteTodayQuestionsMutationOptions({ onSuccess: exitEdit, today }),
  );

  const archiveSelectedQuestions = () => {
    if (selectedQuestionIds.length === 0) return;
    archiveMutation.mutate(selectedQuestionIds);
  };

  const deleteSelectedQuestions = () => {
    if (selectedQuestionIds.length === 0) return;

    Alert.alert(
      "Delete questions?",
      "Deleted questions are hidden from Today but their entries stay in history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => softDeleteMutation.mutate(selectedQuestionIds),
        },
      ],
    );
  };

  if (!isEditing) {
    return null;
  }

  return (
    <Stack.Toolbar placement="bottom">
      <Stack.Toolbar.Button
        key="uncheck"
        onPress={() => uncheckMutation.mutate(selectedOrAllQuestionIds)}
      >
        {hasSelection ? "Uncheck" : "Uncheck All"}
      </Stack.Toolbar.Button>
      <Stack.Toolbar.Spacer key="archive-spacer" />
      <Stack.Toolbar.Button
        key="archive"
        disabled={!hasSelection}
        onPress={archiveSelectedQuestions}
      >
        Archive
      </Stack.Toolbar.Button>
      <Stack.Toolbar.Spacer key="delete-spacer" />
      <Stack.Toolbar.Button
        key="delete"
        disabled={!hasSelection}
        tintColor="red"
        onPress={deleteSelectedQuestions}
      >
        Delete
      </Stack.Toolbar.Button>
    </Stack.Toolbar>
  );
}
