import { and, asc, eq, inArray, isNull } from "drizzle-orm";

import { db } from "@/src/shared/db/client";

import type { CreateQuestionInput, Question } from "./model";
import type { QuestionId } from "./schema";
import { questions } from "./schema";

export async function listQuestions(): Promise<Question[]> {
  return db
    .select()
    .from(questions)
    .where(isNull(questions.deletedAt))
    .orderBy(asc(questions.sortOrder), asc(questions.createdAt));
}

export async function listQuestionsForToday(): Promise<Question[]> {
  return db
    .select()
    .from(questions)
    .where(
      and(eq(questions.repeat, "daily"), isNull(questions.archivedAt), isNull(questions.deletedAt)),
    )
    .orderBy(asc(questions.sortOrder), asc(questions.createdAt));
}

export async function createQuestion(input: CreateQuestionInput): Promise<Question> {
  const now = new Date().toISOString();
  const values = {
    ...input,
    description: input.description ?? "",
    valueUnits: input.valueUnits ?? "",
    repeat: input.repeat ?? "daily",
    sortOrder: Date.now(),
    createdAt: now,
    updatedAt: now,
  };

  const [question] = await db.insert(questions).values(values).returning();

  if (!question) {
    throw new Error("Question was not created");
  }

  return question;
}

export async function archiveQuestions(questionIds: string[]): Promise<void> {
  if (questionIds.length === 0) {
    return;
  }

  await db
    .update(questions)
    .set({ archivedAt: new Date().toISOString() })
    .where(inArray(questions.id, questionIds as QuestionId[]));
}

export async function softDeleteQuestions(questionIds: string[]): Promise<void> {
  if (questionIds.length === 0) {
    return;
  }

  await db
    .update(questions)
    .set({ deletedAt: new Date().toISOString() })
    .where(inArray(questions.id, questionIds as QuestionId[]));
}

export async function reorderQuestions(questionIdsInOrder: string[]): Promise<void> {
  const now = new Date().toISOString();

  await Promise.all(
    questionIdsInOrder.map((questionId, sortOrder) =>
      db
        .update(questions)
        .set({ sortOrder, updatedAt: now })
        .where(eq(questions.id, questionId as QuestionId)),
    ),
  );
}
