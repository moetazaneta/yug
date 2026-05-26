import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ScrollView } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { createEntry, listEntriesToday } from "@/src/data/repositories/entries";
import {
  listQuestions,
  type QuestionValueType,
} from "@/src/data/repositories/questions";

import { QuestionRow } from "@/components/question-row";

export function TodayList() {
  const queryClient = useQueryClient();

  const questionsQuery = useQuery({
    queryKey: ["questions"],
    queryFn: listQuestions,
  });
  const questions = questionsQuery.data ?? [];

  const todayEntriesQuery = useQuery({
    queryKey: ["entries"],
    queryFn: listEntriesToday,
  });
  const todayEntriesMap = useMemo(() => {
    console.log(todayEntriesQuery.data);
    if (!todayEntriesQuery.data || todayEntriesQuery.data.length === 0) {
      return {};
    }

    console.log(
      Object.fromEntries(
        todayEntriesQuery.data.map((entry) => [entry.questionId, entry]),
      ),
    );

    return Object.fromEntries(
      todayEntriesQuery.data.map((entry) => [entry.questionId, entry]),
    );
  }, [todayEntriesQuery.data]);

  const answerMutation = useMutation({
    mutationFn: createEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  return questions.map((question) => (
    <QuestionRow
      key={question.id}
      question={question}
      value={todayEntriesMap[question.id]?.value}
      onChange={(value) =>
        value != null &&
        answerMutation.mutate({
          questionId: question.id,
          value: String(value),
        })
      }
    />
  ));
}
