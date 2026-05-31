import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createQuestion } from "@/src/entities/question/repository";
import { questionQueryKeys } from "@/src/entities/question/queries";

export function useCreateQuestionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestion,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: questionQueryKeys.all });
    },
  });
}
