import { mutationOptions } from "@tanstack/react-query";

import { entryQueryKeys } from "@/src/entities/entry/queries";
import { questionQueryKeys } from "@/src/entities/question/queries";
import { queryClient } from "@/src/providers/app-providers";
import { toDayKey } from "@/src/shared/lib/date";

import {
  answerTodayQuestion,
  applyAnswerToTodayViewModel,
  archiveTodayQuestions,
  reorderTodayQuestions,
  softDeleteTodayQuestions,
  type TodayViewModel,
  uncheckTodayQuestions,
} from "../service";
import { todayQueryKeys } from "./query-keys";

type TodayMutationSuccessInput = {
  onSuccess?: ((questionIds: string[]) => void) | undefined;
  today?: Date;
};

export function answerTodayQuestionMutationOptions(today = new Date()) {
  const todayKey = toDayKey(today);

  return mutationOptions({
    mutationFn: answerTodayQuestion,
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: todayQueryKeys.view(todayKey),
      });

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
      await invalidateTodayData(todayKey);
    },
  });
}

export function uncheckTodayQuestionsMutationOptions({
  onSuccess,
  today = new Date(),
}: TodayMutationSuccessInput = {}) {
  const todayKey = toDayKey(today);

  return mutationOptions({
    mutationFn: (questionIds: string[]) => uncheckTodayQuestions({ questionIds, datetime: today }),
    onSuccess: async (_data, questionIds) => {
      onSuccess?.(questionIds);
      await invalidateTodayData(todayKey);
    },
  });
}

export function archiveTodayQuestionsMutationOptions({
  onSuccess,
  today = new Date(),
}: TodayMutationSuccessInput = {}) {
  const todayKey = toDayKey(today);

  return mutationOptions({
    mutationFn: archiveTodayQuestions,
    onSuccess: async (_data, questionIds) => {
      onSuccess?.(questionIds);
      await invalidateTodayData(todayKey);
    },
  });
}

export function softDeleteTodayQuestionsMutationOptions({
  onSuccess,
  today = new Date(),
}: TodayMutationSuccessInput = {}) {
  const todayKey = toDayKey(today);

  return mutationOptions({
    mutationFn: softDeleteTodayQuestions,
    onSuccess: async (_data, questionIds) => {
      onSuccess?.(questionIds);
      await invalidateTodayData(todayKey);
    },
  });
}

export function reorderTodayQuestionsMutationOptions(today = new Date()) {
  const todayKey = toDayKey(today);

  return mutationOptions({
    mutationFn: reorderTodayQuestions,
    onSuccess: async () => {
      await invalidateTodayData(todayKey);
    },
    onError: async () => {
      await queryClient.invalidateQueries({
        queryKey: todayQueryKeys.view(todayKey),
      });
    },
  });
}

async function invalidateTodayData(todayKey: string) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: todayQueryKeys.view(todayKey),
    }),
    queryClient.invalidateQueries({ queryKey: entryQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: questionQueryKeys.all }),
  ]);
}
