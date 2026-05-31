import { and, desc, eq, gte, lt } from "drizzle-orm";

import { db } from "@/src/shared/db/client";
import { dayBounds } from "@/src/shared/lib/date";
import type { QuestionId } from "@/src/entities/question/schema";

import type { Entry } from "./model";
import { entries } from "./schema";

export async function listEntries(): Promise<Entry[]> {
  return db.select().from(entries).orderBy(desc(entries.datetime)).limit(500);
}

export async function listEntriesBetween(startIso: string, endIso: string): Promise<Entry[]> {
  return db
    .select()
    .from(entries)
    .where(and(gte(entries.datetime, startIso), lt(entries.datetime, endIso)))
    .orderBy(desc(entries.datetime));
}

export async function listEntriesToday(): Promise<Entry[]> {
  const today = dayBounds(new Date());
  return listEntriesBetween(today.start.toISOString(), today.end.toISOString());
}

export async function deleteEntryForQuestionOnDay({
  questionId,
  datetime = new Date(),
}: {
  questionId: string;
  datetime?: Date;
}): Promise<void> {
  const bounds = dayBounds(datetime);
  const typedQuestionId = questionId as QuestionId;

  await db
    .delete(entries)
    .where(
      and(
        eq(entries.questionId, typedQuestionId),
        gte(entries.datetime, bounds.start.toISOString()),
        lt(entries.datetime, bounds.end.toISOString()),
      ),
    );
}

export async function createOrUpdateEntry({
  questionId,
  value,
  datetime = new Date(),
}: {
  questionId: string;
  value: string | number | boolean;
  datetime?: Date;
}): Promise<Entry> {
  const bounds = dayBounds(datetime);
  const now = new Date().toISOString();
  const valueText = String(value);
  const typedQuestionId = questionId as QuestionId;

  const [existing] = await db
    .select()
    .from(entries)
    .where(
      and(
        eq(entries.questionId, typedQuestionId),
        gte(entries.datetime, bounds.start.toISOString()),
        lt(entries.datetime, bounds.end.toISOString()),
      ),
    )
    .orderBy(desc(entries.datetime))
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(entries)
      .set({
        value: valueText,
        datetime: datetime.toISOString(),
        updatedAt: now,
      })
      .where(eq(entries.id, existing.id))
      .returning();

    if (!updated) {
      throw new Error("Entry was not updated");
    }

    return updated;
  }

  const [created] = await db
    .insert(entries)
    .values({
      questionId: typedQuestionId,
      value: valueText,
      datetime: datetime.toISOString(),
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!created) {
    throw new Error("Entry was not created");
  }

  return created;
}

export const createEntry = createOrUpdateEntry;
