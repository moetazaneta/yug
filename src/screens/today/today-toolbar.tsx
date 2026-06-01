import { router, Stack } from "expo-router";

export function TodayToolbar() {
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
        <Stack.Toolbar.Button onPress={() => {}}>Edit</Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Stack.Title>{todayReadable}</Stack.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          // separateBackground
          // hidesSharedBackground
          icon="plus.circle"
          onPress={openCreateQuestion}
        />
        <Stack.Toolbar.Button
          // hidesSharedBackground
          icon="square.and.pencil"
          onPress={() => {}}
        />
      </Stack.Toolbar>
    </>
  );
}
