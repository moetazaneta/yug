import type * as SQLite from "expo-sqlite";

import { createId } from "@/src/data/id";
import type { CreateQuestionInput } from "@/src/data/repositories/questions";

const COLORS = {
  green: "#34C759",
  red: "#FF2D55",
  orange: "#FF9500",
  purple: "#AF52DE",
  blue: "#007AFF",
} as const;

export const seedQuestions: CreateQuestionInput[] = [
  // Supplements — green
  { icon: "💪", title: "Креатин", description: "", color: COLORS.green, valueType: "number", valueUnits: "г", repeat: "daily" },
  { icon: "☀️", title: "Дешки", description: "", color: COLORS.green, valueType: "boolean", valueUnits: "", repeat: "daily" },
  { icon: "🌿", title: "Ашваганда", description: "", color: COLORS.green, valueType: "boolean", valueUnits: "", repeat: "daily" },
  { icon: "🧂", title: "Магний", description: "", color: COLORS.green, valueType: "boolean", valueUnits: "", repeat: "daily" },

  // Vices — red
  { icon: "🍬", title: "Сладости", description: "", color: COLORS.red, valueType: "boolean", valueUnits: "", repeat: "daily" },
  { icon: "⚡️", title: "Энергетики", description: "", color: COLORS.red, valueType: "number", valueUnits: "шт", repeat: "daily" },

  // Drinks — orange
  { icon: "☕️", title: "Кофе", description: "", color: COLORS.orange, valueType: "number", valueUnits: "чашек", repeat: "daily" },
  { icon: "🍵", title: "Чай", description: "", color: COLORS.orange, valueType: "number", valueUnits: "чашек", repeat: "daily" },

  // Exercise — purple
  { icon: "🤸", title: "Турники", description: "", color: COLORS.purple, valueType: "number", valueUnits: "раз", repeat: "daily" },

  // Habits — blue
  { icon: "📖", title: "Читал книжку", description: "", color: COLORS.blue, valueType: "boolean", valueUnits: "", repeat: "daily" },
  { icon: "📓", title: "Заполнил дневник", description: "", color: COLORS.blue, valueType: "boolean", valueUnits: "", repeat: "daily" },
  { icon: "🧘", title: "Медитация", description: "", color: COLORS.blue, valueType: "boolean", valueUnits: "", repeat: "daily" },
  { icon: "🌅", title: "Проснулся утром", description: "", color: COLORS.blue, valueType: "boolean", valueUnits: "", repeat: "daily" },
];

export async function seedQuestionsIfEmpty(db: SQLite.SQLiteDatabase) {
  const existing = await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM questions");
  if ((existing?.count ?? 0) > 0) return;

  const now = new Date().toISOString();
  for (const q of seedQuestions) {
    await db.runAsync(
      `INSERT INTO questions (
        id, icon, title, description, color, value_type, value_units, repeat, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      createId("question"),
      q.icon,
      q.title,
      q.description,
      q.color,
      q.valueType,
      q.valueUnits,
      q.repeat,
      now,
      now,
    );
  }
}
