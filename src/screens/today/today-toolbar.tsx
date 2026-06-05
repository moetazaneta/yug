import { router, Stack } from "expo-router";

type TodayToolbarProps = {
  isEditing: boolean;
  onEnterEdit: () => void;
  onExitEdit: () => void;
};

export function TodayToolbar({ isEditing, onEnterEdit, onExitEdit }: TodayToolbarProps) {
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
        <Stack.Toolbar.Button onPress={isEditing ? onExitEdit : onEnterEdit}>
          {isEditing ? "Done" : "Edit"}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Stack.Title>{todayReadable}</Stack.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          key="create-question"
          hidden={isEditing}
          icon="plus.circle"
          onPress={openCreateQuestion}
        />
        <Stack.Toolbar.Button
          key="edit-questions"
          hidden={isEditing}
          icon="square.and.pencil"
          onPress={() => {}}
        />
      </Stack.Toolbar>
    </>
  );
}
