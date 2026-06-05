import { useEffect } from "react";

import { TodayBody } from "./components/today-body";
import { TodayBottomToolbar } from "./components/today-bottom-toolbar";
import { TodayTopToolbar } from "./components/today-top-toolbar";
import { useTodayStore } from "./today-store";

export function TodayScreen() {
  const cleanup = useTodayStore((state) => state.cleanup);
  useEffect(() => cleanup);

  return (
    <>
      <TodayTopToolbar />
      <TodayBottomToolbar />
      <TodayBody />
    </>
  );
}
