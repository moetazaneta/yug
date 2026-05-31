export const entryQueryKeys = {
  all: ["entries"] as const,
  today: (dayKey: string) => ["entries", "today", dayKey] as const,
  between: (startIso: string, endIso: string) => ["entries", "between", startIso, endIso] as const,
  month: (monthKey: string) => ["entries", "month", monthKey] as const,
};
