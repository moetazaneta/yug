import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import { entryQueryKeys } from "@/src/entities/entry/queries";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { QuestionAnswerRow } from "@/src/features/answer-question/ui/question-answer-row";
import { toDayKey } from "@/src/shared/lib/date";
import { colors } from "@/src/shared/theme/colors";
import { useTabBarVisibilityStore } from "@/src/shared/ui/navigation/tab-bar-visibility-store";

import { EmptyTodayState } from "./empty-today-state";
import {
  answerTodayQuestion,
  applyAnswerToTodayViewModel,
  archiveTodayQuestions,
  getTodayViewModel,
  reorderTodayQuestions,
  softDeleteTodayQuestions,
  todayQueryKeys,
  type TodayQuestionRow,
  type TodayViewModel,
  uncheckTodayQuestions,
} from "./service";
import { TodayEditList } from "./today-edit-list";
import { TodayToolbar } from "./today-toolbar";

const emptyTodayRows: TodayQuestionRow[] = [];

export function TodayScreen() {
  const colorScheme = useColorScheme();
  const tint = colors[colorScheme].tint;
  const queryClient = useQueryClient();
  const setTabBarHidden = useTabBarVisibilityStore(
    (state) => state.setTabBarHidden,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [orderedRows, setOrderedRows] = useState<TodayQuestionRow[]>([]);
  const today = useMemo(() => new Date(), []);
  const todayKey = toDayKey(today);
  const openCreateQuestion = () => {
    router.push("/create-question");
  };
  const todayQuery = useQuery({
    queryKey: todayQueryKeys.view(todayKey),
    queryFn: () => getTodayViewModel(today),
  });
  const answerMutation = useMutation({
    mutationFn: answerTodayQuestion,
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: todayQueryKeys.view(todayKey),
      });

      const previousToday = queryClient.getQueryData<TodayViewModel>(
        todayQueryKeys.view(todayKey),
      );

      queryClient.setQueryData<TodayViewModel>(
        todayQueryKeys.view(todayKey),
        (current) => applyAnswerToTodayViewModel(current, input),
      );

      return { previousToday };
    },
    onError: (_error, _input, context) => {
      if (context?.previousToday) {
        queryClient.setQueryData(
          todayQueryKeys.view(todayKey),
          context.previousToday,
        );
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: todayQueryKeys.view(todayKey),
        }),
        queryClient.invalidateQueries({ queryKey: entryQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: questionQueryKeys.all }),
      ]);
    },
  });
  const rows = todayQuery.data?.rows ?? emptyTodayRows;
  useEffect(() => {
    setOrderedRows(rows);
  }, [rows]);
  const visibleQuestionIds = useMemo(
    () => orderedRows.map((row) => row.question.id),
    [orderedRows],
  );
  const invalidateTodayData = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: todayQueryKeys.view(todayKey),
      }),
      queryClient.invalidateQueries({ queryKey: entryQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: questionQueryKeys.all }),
    ]);
  }, [queryClient, todayKey]);
  const exitEdit = useCallback(() => {
    setIsEditing(false);
    setSelectedQuestionIds([]);
  }, []);
  const selectedOrAllQuestionIds =
    selectedQuestionIds.length > 0 ? selectedQuestionIds : visibleQuestionIds;
  const uncheckMutation = useMutation({
    mutationFn: (questionIds: string[]) =>
      uncheckTodayQuestions({ questionIds, datetime: today }),
    onSuccess: async () => {
      setSelectedQuestionIds([]);
      await invalidateTodayData();
    },
  });
  const archiveMutation = useMutation({
    mutationFn: archiveTodayQuestions,
    onSuccess: async () => {
      exitEdit();
      await invalidateTodayData();
    },
  });
  const softDeleteSelectedMutation = useMutation({
    mutationFn: softDeleteTodayQuestions,
    onSuccess: async () => {
      exitEdit();
      await invalidateTodayData();
    },
  });
  const softDeleteRowsMutation = useMutation({
    mutationFn: softDeleteTodayQuestions,
    onSuccess: async (_data, questionIds) => {
      setSelectedQuestionIds((current) =>
        current.filter((questionId) => !questionIds.includes(questionId)),
      );
      await invalidateTodayData();
    },
  });
  const reorderMutation = useMutation({
    mutationFn: reorderTodayQuestions,
    onSuccess: invalidateTodayData,
    onError: async () => {
      await queryClient.invalidateQueries({
        queryKey: todayQueryKeys.view(todayKey),
      });
    },
  });
  const moveRows = useCallback(
    (sourceIndices: number[], destination: number) => {
      if (sourceIndices.length === 0) {
        return;
      }

      const nextRows = reorderRows(orderedRows, sourceIndices, destination);
      setOrderedRows(nextRows);
      reorderMutation.mutate(nextRows.map((row) => row.question.id));
    },
    [orderedRows, reorderMutation],
  );
  const deleteRowsAtIndices = useCallback(
    (indices: number[]) => {
      const questionIds = indices.flatMap((index) => {
        const questionId = orderedRows[index]?.question.id;
        return questionId ? [questionId] : [];
      });

      if (questionIds.length === 0) {
        return;
      }

      softDeleteRowsMutation.mutate(questionIds);
    },
    [orderedRows, softDeleteRowsMutation],
  );

  useEffect(() => {
    setTabBarHidden(isEditing);

    return () => {
      setTabBarHidden(false);
    };
  }, [isEditing, setTabBarHidden]);

  return (
    <>
      <TodayToolbar
        isEditing={isEditing}
        onEnterEdit={() => setIsEditing(true)}
        onExitEdit={exitEdit}
      />
      {isEditing ? (
        <Stack.Toolbar placement="bottom">
          <Stack.Toolbar.Button
            onPress={() => uncheckMutation.mutate(selectedOrAllQuestionIds)}
          >
            {selectedQuestionIds.length > 0 ? "Uncheck" : "Uncheck All"}
          </Stack.Toolbar.Button>
          <Stack.Toolbar.Spacer />
          <Stack.Toolbar.Button
            onPress={() => {
              if (selectedQuestionIds.length > 0) {
                archiveMutation.mutate(selectedQuestionIds);
              }
            }}
          >
            Archive
          </Stack.Toolbar.Button>
          <Stack.Toolbar.Spacer />
          <Stack.Toolbar.Button
            tintColor="red"
            onPress={() => {
              if (selectedQuestionIds.length === 0) {
                return;
              }

              Alert.alert(
                "Delete questions?",
                "Deleted questions are hidden from Today but their entries stay in history.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () =>
                      softDeleteSelectedMutation.mutate(selectedQuestionIds),
                  },
                ],
              );
            }}
          >
            Delete
          </Stack.Toolbar.Button>
        </Stack.Toolbar>
      ) : null}
      {isEditing ? (
        <TodayEditList
          rows={orderedRows}
          selectedQuestionIds={selectedQuestionIds}
          onSelectionChange={setSelectedQuestionIds}
          onMove={moveRows}
          onDelete={deleteRowsAtIndices}
        />
      ) : (
        <ScrollView
          className="z-10 flex-1 bg-white"
          contentContainerClassName="relative px-3 pb-28 pt-2"
        >
          {todayQuery.isLoading ? (
            <Text className="text-slate-600 dark:text-slate-300">
              Loading questions...
            </Text>
          ) : rows.length === 0 ? (
            <EmptyTodayState tint={tint} onCreate={openCreateQuestion} />
          ) : (
            rows.map(({ question, value }) => (
              <QuestionAnswerRow
                key={question.id}
                question={question}
                value={value}
                onChange={(value) => {
                  answerMutation.mutate({ questionId: question.id, value });
                }}
              />
            ))
          )}
        </ScrollView>
      )}
    </>
  );
}

function reorderRows(
  rows: TodayQuestionRow[],
  sourceIndices: number[],
  destination: number,
) {
  const movingIndexSet = new Set(sourceIndices);
  const movingRows = rows.filter((_row, index) => movingIndexSet.has(index));
  const remainingRows = rows.filter(
    (_row, index) => !movingIndexSet.has(index),
  );
  const precedingMovedCount = sourceIndices.filter(
    (index) => index < destination,
  ).length;
  const adjustedDestination = Math.max(0, destination - precedingMovedCount);

  return [
    ...remainingRows.slice(0, adjustedDestination),
    ...movingRows,
    ...remainingRows.slice(adjustedDestination),
  ];
}
