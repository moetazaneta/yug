import { eq } from "drizzle-orm";
import { db } from "../db";
import { entries } from "../schema/entries";
import { questions } from "../schema/questions";

export type UserWithPosts = Awaited<
  ReturnType<typeof getTodayEntriesWithQuestion>
>[number];

export function getTodayEntriesWithQuestion() {
  return db
    .select()
    .from(questions)
    .leftJoin(entries, eq(questions.id, entries.questionId));
}
