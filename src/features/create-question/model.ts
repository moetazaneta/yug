import type { QuestionValueType } from "@/src/entities/question/model";

export const questionValueTypes: QuestionValueType[] = ["boolean", "number", "text", "choice"];

export const questionColorOptions = [
  { name: "Slate", token: "slate-500", value: "#64748b" },
  { name: "Gray", token: "gray-500", value: "#6b7280" },
  { name: "Zinc", token: "zinc-500", value: "#71717a" },
  { name: "Neutral", token: "neutral-500", value: "#737373" },
  { name: "Stone", token: "stone-500", value: "#78716c" },
  { name: "Red", token: "red-500", value: "#ef4444" },
  { name: "Orange", token: "orange-500", value: "#f97316" },
  { name: "Amber", token: "amber-500", value: "#f59e0b" },
  { name: "Yellow", token: "yellow-500", value: "#eab308" },
  { name: "Lime", token: "lime-500", value: "#84cc16" },
  { name: "Green", token: "green-500", value: "#22c55e" },
  { name: "Emerald", token: "emerald-500", value: "#10b981" },
  { name: "Teal", token: "teal-500", value: "#14b8a6" },
  { name: "Cyan", token: "cyan-500", value: "#06b6d4" },
  { name: "Sky", token: "sky-500", value: "#0ea5e9" },
  { name: "Blue", token: "blue-500", value: "#3b82f6" },
  { name: "Indigo", token: "indigo-500", value: "#6366f1" },
  { name: "Violet", token: "violet-500", value: "#8b5cf6" },
  { name: "Purple", token: "purple-500", value: "#a855f7" },
  { name: "Fuchsia", token: "fuchsia-500", value: "#d946ef" },
  { name: "Pink", token: "pink-500", value: "#ec4899" },
  { name: "Rose", token: "rose-500", value: "#f43f5e" },
] as const;

export const questionPalette = questionColorOptions.map((color) => color.value);
