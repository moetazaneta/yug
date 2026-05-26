import { openDatabase } from "@/src/data/db/client";
import { createId } from "@/src/data/id";

export type QuestionValueType = "text" | "number" | "boolean" | "choice";
export type QuestionRepeat = "daily";

export type Question = {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  valueType: QuestionValueType;
  valueUnits: string;
  repeat: QuestionRepeat;
  createdAt: string;
  updatedAt: string;
};

type QuestionRow = {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  value_type: QuestionValueType;
  value_units: string;
  repeat: QuestionRepeat;
  created_at: string;
  updated_at: string;
};

export type CreateQuestionInput = {
  icon: string;
  title: string;
  description: string;
  color: string;
  valueType: QuestionValueType;
  valueUnits: string;
  repeat: QuestionRepeat;
};

function mapQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    icon: row.icon,
    title: row.title,
    description: row.description,
    color: row.color,
    valueType: row.value_type,
    valueUnits: row.value_units,
    repeat: row.repeat,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listQuestions(): Promise<Question[]> {
  const db = await openDatabase();
  const rows = await db.getAllAsync<QuestionRow>(
    "SELECT * FROM questions ORDER BY created_at ASC",
  );

  return rows.map(mapQuestion);
}

export async function createQuestion(
  input: CreateQuestionInput,
): Promise<Question> {
  const db = await openDatabase();
  const now = new Date().toISOString();
  const question: Question = {
    id: createId("question"),
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  await db.runAsync(
    `INSERT INTO questions (
      id, icon, title, description, color, value_type, value_units, repeat, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    question.id,
    question.icon,
    question.title,
    question.description,
    question.color,
    question.valueType,
    question.valueUnits,
    question.repeat,
    question.createdAt,
    question.updatedAt,
  );

  return question;
}
