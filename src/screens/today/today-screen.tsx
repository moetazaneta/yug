import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { useMemo, useState } from "react";
import { ScrollView, Text } from "react-native";
import { ScrollEdgeBar } from "react-native-scroll-edge-bar";

import { useColorScheme } from "@/components/useColorScheme";
import { entryQueryKeys } from "@/src/entities/entry/queries";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { QuestionAnswerRow } from "@/src/features/answer-question/ui/question-answer-row";
import { CreateQuestionSheet } from "@/src/features/create-question/ui/create-question-sheet";
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

export function TodayScreen() {
  const colorScheme = useColorScheme();
  const tint = colors[colorScheme].tint;
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();
  const today = useMemo(() => new Date(), []);
  const todayKey = toDayKey(today);
  const todayQuery = useQuery({
    queryKey: todayQueryKeys.view(todayKey),
    queryFn: () => getTodayViewModel(today),
  });
  const answerMutation = useMutation({
    mutationFn: answerTodayQuestion,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: todayQueryKeys.view(todayKey) });

      const previousToday = queryClient.getQueryData<TodayViewModel>(todayQueryKeys.view(todayKey));

      queryClient.setQueryData<TodayViewModel>(todayQueryKeys.view(todayKey), (current) =>
        applyAnswerToTodayViewModel(current, input),
      );

      return { previousToday };
    },
    onError: (_error, _input, context) => {
      if (context?.previousToday) {
        queryClient.setQueryData(todayQueryKeys.view(todayKey), context.previousToday);
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: todayQueryKeys.view(todayKey) }),
        queryClient.invalidateQueries({ queryKey: entryQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: questionQueryKeys.all }),
      ]);
    },
  });
  const rows = todayQuery.data?.rows ?? [];

  return (
    <ScrollEdgeBar style={{ backgroundColor: "#FEFEFE", flex: 1 }} topEdgeEffectStyle="soft">
      <ScrollEdgeBar.TopBar style={{ backgroundColor: "transparent" }}>
        <BlurView
          intensity={5}
          style={{
            experimental_backgroundImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.01) 75%, transparent)",
            height: 150,
            paddingHorizontal: 16,
            paddingTop: 100,
            top: -100,
          }}
        >
          <TodaySummary
            summary={todayQuery.data?.summary ?? undefined}
            onCreate={() => setIsCreating(true)}
          />
        </BlurView>
      </ScrollEdgeBar.TopBar>
      <ScrollView className="z-10 flex-1" contentContainerClassName="relative px-3 pb-28 pt-2">
        {todayQuery.isLoading ? (
          <Text className="text-slate-600 dark:text-slate-300">Loading questions...</Text>
        ) : rows.length === 0 ? (
          <EmptyTodayState tint={tint} onCreate={() => setIsCreating(true)} />
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
      <CreateQuestionSheet
        visible={isCreating}
        onClose={() => setIsCreating(false)}
        onCreated={() => {
          void queryClient.invalidateQueries({ queryKey: todayQueryKeys.view(todayKey) });
        }}
      />
    </ScrollEdgeBar>
  );
}
