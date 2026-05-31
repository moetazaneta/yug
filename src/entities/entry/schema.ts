import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

import type { QuestionId } from "@/src/entities/question/schema";

export type EntryId = string & { __brand: "entry_id" };

export const entries = sqliteTable("entries", {
  id: text()
    .$type<EntryId>()
    .$defaultFn(() => uuidv4() as EntryId)
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
