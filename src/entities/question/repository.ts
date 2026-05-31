import { asc, eq } from "drizzle-orm";

import { db } from "@/src/shared/db/client";

import type { CreateQuestionInput, Question } from "./model";
import { questions } from "./schema";

export async function listQuestions(): Promise<Question[]> {
  return db.select().from(questions).orderBy(asc(questions.createdAt));
}

export async function listQuestionsForToday(): Promise<Question[]> {
  return db
    .select()
    .from(questions)
    .where(eq(questions.repeat, "daily"))
    .orderBy(asc(questions.createdAt));
}

export async function createQuestion(input: CreateQuestionInput): Promise<Question> {
  const now = new Date().toISOString();
  const values = {
    ...input,
    description: input.description ?? "",
    valueUnits: input.valueUnits ?? "",
    repeat: input.repeat ?? "daily",
    createdAt: now,
    updatedAt: now,
  };

  const [question] = await db.insert(questions).values(values).returning();

  if (!question) {
    throw new Error("Question was not created");
  }

  return question;
}
