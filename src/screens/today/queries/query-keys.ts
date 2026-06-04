export const todayQueryKeys = {
  all: ["today"] as const,
  views: () => [...todayQueryKeys.all, "view"] as const,
  view: (dayKey: string) => [...todayQueryKeys.views(), dayKey] as const,
};
