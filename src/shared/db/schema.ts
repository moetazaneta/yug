import { defineRelations } from "drizzle-orm";

import { entries } from "@/src/entities/entry/schema";
import { questions } from "@/src/entities/question/schema";

export { entries, questions };

export const relations = defineRelations({ entries, questions }, (r) => ({
  entries: {
    question: r.one.questions({
      from: r.entries.questionId,
      to: r.questions.id,
    }),
  },
}));
