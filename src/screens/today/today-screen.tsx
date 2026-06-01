import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { router, Stack } from "expo-router";
import { useMemo } from "react";
import { ScrollView, Text } from "react-native";
import { ScrollEdgeBar } from "react-native-scroll-edge-bar";

import { useColorScheme } from "@/components/useColorScheme";
import { entryQueryKeys } from "@/src/entities/entry/queries";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { QuestionAnswerRow } from "@/src/features/answer-question/ui/question-answer-row";
import { toDayKey } from "@/src/shared/lib/date";
import { colors } from "@/src/shared/theme/colors";

import { EmptyTodayState } from "./empty-today-state";
import {
  answerTodayQuestion,
  applyAnswerToTodayViewModel,
  getTodayViewModel,
  todayQueryKeys,
  type TodayViewModel,
} from "./service";
import { TodaySummary } from "./today-summary";
import { TodayToolbar } from "./today-toolbar";

export function TodayScreen() {
  const colorScheme = useColorScheme();
  const tint = colors[colorScheme].tint;
  const queryClient = useQueryClient();
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
  const rows = todayQuery.data?.rows ?? [];

  return (
    <>
      <TodayToolbar />
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
    </>
  );
}
