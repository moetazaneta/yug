import { InferSelectModel, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
// import * as Crypto from "expo-crypto";
import { v4 as uuidv4 } from "uuid";
import { QuestionId } from "./questions";

export type EntryId = string & { __brand: "entry_id" };

export type Entry = InferSelectModel<typeof entries>;
export type EntryNew = typeof entries.$inferInsert;

export const entries = sqliteTable("entries", {
  id: text()
    .$type<EntryId>()
    .$defaultFn(() => uuidv4() as EntryId)
    .primaryKey(),
  questionId: text().$type<QuestionId>().notNull(),
  // question: text("question_id")
  //   .notNull()
  //   .references(() => questions.id),
  value: text().notNull(),
  createdAt: text().default(sql`(current_timestamp)`),
  updatedAt: text()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});
