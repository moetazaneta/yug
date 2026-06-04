import { MenuView } from "@expo/ui/community/menu";
import type { MenuAction, NativeActionEvent } from "@expo/ui/community/menu";
import type { ReactNode } from "react";

import type { Entry } from "@/src/entities/entry/model";
import type { Question } from "@/src/entities/question/model";

type TodayQuestionContextMenuProps = {
  children: ReactNode;
  entriesByDay: Map<string, Entry> | undefined;
  entryGridGap: number;
  entryGridSquareSize: number;
  entryGridWeeks: Date[][];
  question: Question;
  onArchive: () => void;
  onDelete: () => void;
  onEditEntries: () => void;
  onUncheck: () => void;
};

const ACTIONS = [
  { id: "edit", title: "Edit", image: "pencil" },
  { id: "uncheck", title: "Uncheck", image: "checkmark.circle" },
  { id: "archive", title: "Archive", image: "archivebox" },
  {
    id: "delete",
    title: "Delete",
    image: "trash",
    attributes: { destructive: true },
  },
] satisfies MenuAction[];

export function TodayQuestionContextMenu({
  children,
  onArchive,
  onDelete,
  onEditEntries,
  onUncheck,
}: TodayQuestionContextMenuProps) {
  return (
    <MenuView
      actions={ACTIONS}
      shouldOpenOnLongPress
      onPressAction={(event) => {
        handleAction(event, {
          archive: onArchive,
          delete: onDelete,
          edit: onEditEntries,
          uncheck: onUncheck,
        });
      }}
    >
      {children}
    </MenuView>
  );
}

function handleAction(
  event: NativeActionEvent,
  handlers: Record<"archive" | "delete" | "edit" | "uncheck", () => void>,
) {
  const actionId = event.nativeEvent.event;

  if (actionId === "edit") {
    handlers.edit();
    return;
  }

  if (actionId === "uncheck") {
    handlers.uncheck();
    return;
  }

  if (actionId === "archive") {
    handlers.archive();
    return;
  }

  if (actionId === "delete") {
    handlers.delete();
  }
}
