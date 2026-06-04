import { router, Stack } from "expo-router";

import { useTodayStore } from "../today-store";

export function TodayTopToolbar() {
  const isEditing = useTodayStore((state) => state.isEditing);
  const enterEdit = useTodayStore((state) => state.enterEdit);
  const exitEdit = useTodayStore((state) => state.exitEdit);

  const todayReadable = new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    weekday: "short",
  });

  const openCreateQuestion = () => {
    router.push("/create-question");
  };

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button onPress={isEditing ? exitEdit : enterEdit}>
          {isEditing ? "Done" : "Edit"}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Stack.Title>{todayReadable}</Stack.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          hidden={isEditing}
          icon="plus.circle"
          onPress={openCreateQuestion}
        />
        <Stack.Toolbar.Button
          hidden={isEditing}
          icon="square.and.pencil"
          onPress={() => {}}
        />
      </Stack.Toolbar>
    </>
  );
}
