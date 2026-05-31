import { eq } from "drizzle-orm";

import { entries } from "@/src/entities/entry/schema";
import type { CreateQuestionInput } from "@/src/entities/question/model";
import { questions } from "@/src/entities/question/schema";

import { db } from "./client";

const COLORS = {
  green: "#34C759",
  red: "#FF2D55",
  orange: "#FF9500",
  purple: "#AF52DE",
  blue: "#007AFF",
} as const;

export const seedQuestions: CreateQuestionInput[] = [
  {
    icon: "💪",
    title: "Креатин",
    description: "",
    color: COLORS.green,
    valueType: "number",
    valueUnits: "г",
    repeat: "daily",
  },
  {
    icon: "☀️",
    title: "Дешки",
    description: "",
    color: COLORS.green,
    valueType: "boolean",
    valueUnits: "",
    repeat: "daily",
  },
  {
    icon: "🌿",
    title: "Ашваганда",
    description: "",
    color: COLORS.green,
    valueType: "boolean",
    valueUnits: "",
    repeat: "daily",
  },
  {
    icon: "🧂",
    title: "Магний",
    description: "",
    color: COLORS.green,
    valueType: "boolean",
    valueUnits: "",
    repeat: "daily",
  },
  {
    icon: "🍬",
    title: "Сладости",
    description: "",
    color: COLORS.red,
    valueType: "boolean",
    valueUnits: "",
    repeat: "daily",
  },
  {
    icon: "⚡️",
    title: "Энергетики",
    description: "",
    color: COLORS.red,
    valueType: "number",
    valueUnits: "шт",
    repeat: "daily",
  },
  {
    icon: "☕️",
    title: "Кофе",
    description: "",
    color: COLORS.orange,
    valueType: "number",
    valueUnits: "чашек",
    repeat: "daily",
  },
  {
    icon: "🍵",
    title: "Чай",
    description: "",
    color: COLORS.orange,
    valueType: "number",
    valueUnits: "чашек",
    repeat: "daily",
  },
  {
    icon: "🤸",
    title: "Турники",
    description: "",
    color: COLORS.purple,
    valueType: "number",
    valueUnits: "раз",
    repeat: "daily",
  },
  {
    icon: "📖",
    title: "Читал книжку",
    description: "",
    color: COLORS.blue,
    valueType: "boolean",
    valueUnits: "",
    repeat: "daily",
  },
  {
    icon: "📓",
    title: "Заполнил дневник",
    description: "",
    color: COLORS.blue,
    valueType: "boolean",
    valueUnits: "",
    repeat: "daily",
  },
  {
    icon: "🧘",
    title: "Медитация",
    description: "",
    color: COLORS.blue,
    valueType: "boolean",
    valueUnits: "",
    repeat: "daily",
  },
  {
    icon: "🌅",
    title: "Проснулся утром",
    description: "",
    color: COLORS.blue,
    valueType: "boolean",
    valueUnits: "",
    repeat: "daily",
  },
];

export async function seedQuestionsIfEmpty() {
  const existing = await db.select({ id: questions.id }).from(questions).limit(1);
  if (existing.length > 0) {
    return;
  }

  const now = new Date().toISOString();
  await db.insert(questions).values(
    seedQuestions.map((question) => ({
      ...question,
      createdAt: now,
      updatedAt: now,
    })),
  );
}

export async function backfillEntryDatetime() {
  const rows = await db.select().from(entries);

  for (const entry of rows) {
    if (!entry.datetime) {
      await db
        .update(entries)
        .set({ datetime: entry.createdAt, updatedAt: new Date().toISOString() })
        .where(eq(entries.id, entry.id));
    }
  }
}
