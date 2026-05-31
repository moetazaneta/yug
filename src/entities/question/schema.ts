import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { createId } from "@/src/shared/lib/id";

export type QuestionId = string & { __brand: "question_id" };
export type QuestionValueType = "text" | "number" | "boolean" | "choice";
export type QuestionRepeat = "daily";

export const questions = sqliteTable("questions", {
  id: text()
    .$type<QuestionId>()
    .$defaultFn(() => createId("question") as QuestionId)
    .primaryKey(),
  icon: text().notNull(),
  title: text().notNull(),
  description: text().notNull().default(""),
  color: text().notNull(),
  valueType: text().$type<QuestionValueType>().notNull(),
  valueUnits: text().notNull().default(""),
  repeat: text().$type<QuestionRepeat>().notNull().default("daily"),
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text()
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});
