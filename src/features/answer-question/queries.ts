import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createOrUpdateEntry } from "@/src/entities/entry/repository";
import { entryQueryKeys } from "@/src/entities/entry/queries";

export function useAnswerQuestionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrUpdateEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: entryQueryKeys.all });
    },
  });
}
