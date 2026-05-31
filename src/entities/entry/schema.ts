import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { QuestionId } from "@/src/entities/question/schema";
import { createId } from "@/src/shared/lib/id";

export type EntryId = string & { __brand: "entry_id" };

export const entries = sqliteTable("entries", {
  id: text()
    .$type<EntryId>()
    .$defaultFn(() => createId("entry") as EntryId)
    .primaryKey(),
  questionId: text().$type<QuestionId>().notNull(),
  value: text().notNull(),
  datetime: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text()
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});
