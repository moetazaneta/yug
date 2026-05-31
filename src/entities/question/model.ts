import type { questions } from "./schema";

export type Question = typeof questions.$inferSelect;
export type QuestionInsert = typeof questions.$inferInsert;
export type CreateQuestionInput = Pick<
  QuestionInsert,
  "icon" | "title" | "description" | "color" | "valueType" | "valueUnits" | "repeat"
>;

export type { QuestionRepeat, QuestionValueType } from "./schema";
