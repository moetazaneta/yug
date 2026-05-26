import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";
// import * as Crypto from "expo-crypto";
import { v4 as uuidv4 } from "uuid";

export type QuestionId = string & { __brand: "question_id" };

export const questions = sqliteTable(
  "questions",
  {
    id: text()
      .$type<QuestionId>()
      .$defaultFn(() => uuidv4() as QuestionId)
      .primaryKey(),
    icon: text().notNull(),
    title: text().notNull(),
    description: text(),
    color: text().notNull(),
    valueType: text().notNull(),
    valueUnits: text().notNull(),
    repeat: text().notNull(),
    createdAt: text().default(sql`(current_timestamp)`),
    updatedAt: text()
      .default(sql`(current_timestamp)`)
      .$onUpdate(() => sql`(current_timestamp)`),
  },
  // (table) => index("createdAtIndex").on(table.createdAt),
);
