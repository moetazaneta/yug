import { queryOptions } from "@tanstack/react-query";

import { entryQueryKeys } from "@/src/entities/entry/queries";
import { listEntries } from "@/src/entities/entry/repository";
import { toDayKey } from "@/src/shared/lib/date";

import { getTodayViewModel } from "../service";
import { todayQueryKeys } from "./query-keys";

export function todayViewQueryOptions(today: Date) {
  return queryOptions({
    queryKey: todayQueryKeys.view(toDayKey(today)),
    queryFn: () => getTodayViewModel(today),
  });
}

export function todayEntriesQueryOptions() {
  return queryOptions({
    queryKey: entryQueryKeys.all,
    queryFn: listEntries,
  });
}
