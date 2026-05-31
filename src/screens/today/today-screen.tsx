import { useQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { useMemo, useState } from "react";
import { ScrollView, Text } from "react-native";
import { ScrollEdgeBar } from "react-native-scroll-edge-bar";

import { useColorScheme } from "@/components/useColorScheme";
import { listEntriesToday } from "@/src/entities/entry/repository";
import { entryQueryKeys } from "@/src/entities/entry/queries";
import { listQuestions } from "@/src/entities/question/repository";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { QuestionAnswerRow } from "@/src/features/answer-question/ui/question-answer-row";
import { useAnswerQuestionMutation } from "@/src/features/answer-question/queries";
import { CreateQuestionSheet } from "@/src/features/create-question/ui/create-question-sheet";
import { colors } from "@/src/shared/theme/colors";

import { EmptyTodayState } from "./empty-today-state";
import { TodaySummary } from "./today-summary";

export function TodayScreen() {
  const colorScheme = useColorScheme();
  const tint = colors[colorScheme].tint;
  const [isCreating, setIsCreating] = useState(false);
  const questionsQuery = useQuery({
    queryKey: questionQueryKeys.all,
    queryFn: listQuestions,
  });
  const todayEntriesQuery = useQuery({
    queryKey: entryQueryKeys.today(new Date().toISOString().slice(0, 10)),
    queryFn: listEntriesToday,
  });
  const answerMutation = useAnswerQuestionMutation();
  const questions = questionsQuery.data ?? [];
  const todayEntriesByQuestion = useMemo(
    () =>
      Object.fromEntries((todayEntriesQuery.data ?? []).map((entry) => [entry.questionId, entry])),
    [todayEntriesQuery.data],
  );

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
          <TodaySummary onCreate={() => setIsCreating(true)} />
        </BlurView>
      </ScrollEdgeBar.TopBar>
      <ScrollView className="z-10 flex-1" contentContainerClassName="relative px-3 pb-28 pt-2">
        {questionsQuery.isLoading ? (
          <Text className="text-slate-600 dark:text-slate-300">Loading questions...</Text>
        ) : questions.length === 0 ? (
          <EmptyTodayState tint={tint} onCreate={() => setIsCreating(true)} />
        ) : (
          questions.map((question) => (
            <QuestionAnswerRow
              key={question.id}
              question={question}
              value={todayEntriesByQuestion[question.id]?.value}
              onChange={(value) => {
                if (value != null) {
                  answerMutation.mutate({ questionId: question.id, value });
                }
              }}
            />
          ))
        )}
      </ScrollView>
      <CreateQuestionSheet visible={isCreating} onClose={() => setIsCreating(false)} />
    </ScrollEdgeBar>
  );
}
