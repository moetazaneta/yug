import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { todayViewQueryOptions } from "../queries/query-options";
import { TodayEditList } from "./today-edit-list";
import { TodayEmptyState } from "./today-empty-state";
import { TodayLoadingState } from "./today-loading-state";

export function TodayBody() {
  const today = useMemo(() => new Date(), []);
  const todayQuery = useQuery(todayViewQueryOptions(today));
  const rows = todayQuery.data?.rows ?? [];

  if (todayQuery.isLoading) {
    return <TodayLoadingState />;
  }

  if (rows.length === 0) {
    return <TodayEmptyState />;
  }

  return <TodayEditList today={today} />;
}
