import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";
import { Alert, useWindowDimensions } from "react-native";

import {
  GRID_COLUMNS,
  GRID_GAP,
  groupEntriesByQuestion,
  makeGridWeeks,
} from "@/src/screens/entries/entries-utils";

import {
  answerTodayQuestionMutationOptions,
  archiveTodayQuestionsMutationOptions,
  softDeleteTodayQuestionsMutationOptions,
  uncheckTodayQuestionsMutationOptions,
} from "../queries/mutation-options";
import { todayEntriesQueryOptions, todayViewQueryOptions } from "../queries/query-options";
import { useTodayStore } from "../today-store";
import { TodayQuestionList } from "./today-question-list";

const ENTRY_PREVIEW_GRID_GAP = GRID_GAP;
const ENTRY_PREVIEW_HORIZONTAL_MARGIN = 18;
const ENTRY_PREVIEW_HORIZONTAL_PADDING = 32;

type TodayEditListProps = {
  today: Date;
};

export function TodayEditList({ today }: TodayEditListProps) {
  const { width } = useWindowDimensions();
  const isEditing = useTodayStore((state) => state.isEditing);
  const removeSelectedQuestionIds = useTodayStore((state) => state.removeSelectedQuestionIds);
  const selectedQuestionIds = useTodayStore((state) => state.selectedQuestionIds);
  const toggleSelectedQuestionId = useTodayStore((state) => state.toggleSelectedQuestionId);

  const todayQuery = useQuery(todayViewQueryOptions(today));
  const entriesQuery = useQuery(todayEntriesQueryOptions());
  const rows = todayQuery.data?.rows ?? [];

  const answerMutation = useMutation(answerTodayQuestionMutationOptions(today));
  const archiveMutation = useMutation(archiveTodayQuestionsMutationOptions({ today }));
  const softDeleteMutation = useMutation(
    softDeleteTodayQuestionsMutationOptions({
      onSuccess: removeSelectedQuestionIds,
      today,
    }),
  );
  const uncheckMutation = useMutation(uncheckTodayQuestionsMutationOptions({ today }));
  const entryGridWeeks = useMemo(() => makeGridWeeks(today, GRID_COLUMNS), [today]);
  const entriesByQuestion = useMemo(
    () => groupEntriesByQuestion(entriesQuery.data ?? []),
    [entriesQuery.data],
  );
  const entryGridSquareSize = getEntryGridSquareSize(width);
  const editQuestionEntries = useCallback((questionId: string) => {
    router.push({
      pathname: "/entries-edit",
      params: { questionId },
    });
  }, []);
  const deleteQuestion = useCallback(
    (questionId: string) => {
      Alert.alert(
        "Delete question?",
        "Deleted questions are hidden from Today but their entries stay in history.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => softDeleteMutation.mutate([questionId]),
          },
        ],
      );
    },
    [softDeleteMutation],
  );

  return (
    <TodayQuestionList
      entriesByQuestion={entriesByQuestion}
      entryGridGap={ENTRY_PREVIEW_GRID_GAP}
      entryGridSquareSize={entryGridSquareSize}
      entryGridWeeks={entryGridWeeks}
      isEditing={isEditing}
      rows={rows}
      selectedQuestionIds={selectedQuestionIds}
      onArchiveQuestion={(questionId) => {
        archiveMutation.mutate([questionId]);
      }}
      onAnswerChange={(questionId, value) => {
        answerMutation.mutate({ questionId, value });
      }}
      onDeleteQuestion={deleteQuestion}
      onEditEntries={editQuestionEntries}
      onToggleSelection={toggleSelectedQuestionId}
      onUncheckQuestion={(questionId) => {
        uncheckMutation.mutate([questionId]);
      }}
    />
  );
}

function getEntryGridSquareSize(width: number) {
  const targetPreviewWidth = Math.max(width - ENTRY_PREVIEW_HORIZONTAL_MARGIN, 0);
  const targetGridWidth = Math.max(targetPreviewWidth - ENTRY_PREVIEW_HORIZONTAL_PADDING, 0);
  const totalGapWidth = ENTRY_PREVIEW_GRID_GAP * Math.max(GRID_COLUMNS - 1, 0);

  return Math.max(7, Math.floor((targetGridWidth - totalGapWidth) / GRID_COLUMNS));
}
