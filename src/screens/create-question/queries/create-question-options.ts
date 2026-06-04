import { mutationOptions } from "@tanstack/react-query";

import { questionQueryKeys } from "@/src/entities/question/queries";
import { createQuestion } from "@/src/entities/question/repository";
import { queryClient } from "@/src/providers/app-providers";
import { todayQueryKeys } from "@/src/screens/today/queries/query-keys";
import { toDayKey } from "@/src/shared/lib/date";

export function createQuestionMutationOptions() {
  return mutationOptions({
    mutationFn: createQuestion,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: questionQueryKeys.all }),
        queryClient.invalidateQueries({
          queryKey: todayQueryKeys.view(toDayKey(new Date())),
        }),
      ]);
    },
  });
}
