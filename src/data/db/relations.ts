import { defineRelations } from "drizzle-orm";
import { entries } from "./schema/entries";
import { questions } from "./schema/questions";

export const relations = defineRelations({ entries, questions }, (r) => ({
  entries: {
    question: r.one.questions({
      from: r.entries.questionId,
      to: r.questions.id,
    }),
  },
}));
