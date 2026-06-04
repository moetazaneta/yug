import { eq } from "drizzle-orm";
import { seed } from "drizzle-seed";

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

const randomSeedQuestions = [
  "Drink water",
  "Walk outside",
  "Read",
  "Stretch",
  "Sleep quality",
  "Mood",
  "Workout",
  "Meditate",
  "Protein",
  "Screen time",
] as const;

const randomQuestionIcons = ["💧", "🚶", "📖", "🧘", "🏋️", "🌙", "🙂", "🥗", "🧠", "☕"] as const;
const randomQuestionColors = Object.values(COLORS);
const randomQuestionValueTypes = ["boolean", "number", "text"] as const;
const randomEntryValues = ["true", "false", "1", "2", "3", "5", "8", "good", "ok", "low"] as const;

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

export async function seedRandomQuestions(count = 5) {
  const now = new Date().toISOString();

  await seed(db, { questions }, { count, seed: Date.now() }).refine((funcs) => ({
    questions: {
      columns: {
        icon: funcs.valuesFromArray({ values: [...randomQuestionIcons] }),
        title: funcs.valuesFromArray({ values: [...randomSeedQuestions] }),
        description: funcs.default({ defaultValue: "" }),
        color: funcs.valuesFromArray({ values: randomQuestionColors }),
        valueType: funcs.valuesFromArray({ values: [...randomQuestionValueTypes] }),
        valueUnits: funcs.valuesFromArray({ values: ["", "min", "cups", "reps"] }),
        repeat: funcs.default({ defaultValue: "daily" }),
        archivedAt: funcs.default({ defaultValue: null }),
        deletedAt: funcs.default({ defaultValue: null }),
        sortOrder: funcs.int({ minValue: 0, maxValue: 500 }),
        createdAt: funcs.default({ defaultValue: now }),
        updatedAt: funcs.default({ defaultValue: now }),
      },
    },
  }));
}

export async function seedRandomEntries(count = 25) {
  let availableQuestions = await db.select({ id: questions.id }).from(questions);

  if (availableQuestions.length === 0) {
    await seedRandomQuestions();
    availableQuestions = await db.select({ id: questions.id }).from(questions);
  }

  const questionIds = availableQuestions.map((question) => question.id);
  const now = new Date().toISOString();

  await seed(db, { entries }, { count, seed: Date.now() }).refine((funcs) => ({
    entries: {
      columns: {
        questionId: funcs.valuesFromArray({ values: questionIds }),
        value: funcs.valuesFromArray({ values: [...randomEntryValues] }),
        datetime: funcs.valuesFromArray({ values: createRecentIsoDates(60) }),
        createdAt: funcs.default({ defaultValue: now }),
        updatedAt: funcs.default({ defaultValue: now }),
      },
    },
  }));
}

function createRecentIsoDates(dayCount: number) {
  const today = new Date();

  return Array.from({ length: dayCount }, (_value, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    date.setHours(12, 0, 0, 0);
    return date.toISOString();
  });
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
