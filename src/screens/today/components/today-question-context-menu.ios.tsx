import { Button, ContextMenu, RNHostView } from "@expo/ui/swift-ui";
import type { ReactNode } from "react";

import type { Entry } from "@/src/entities/entry/model";
import type { Question } from "@/src/entities/question/model";
import { EntryGridPreview } from "@/src/screens/entries/entry-grid";

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

export function TodayQuestionContextMenu({
  children,
  entriesByDay,
  entryGridGap,
  entryGridSquareSize,
  entryGridWeeks,
  question,
  onArchive,
  onDelete,
  onEditEntries,
  onUncheck,
}: TodayQuestionContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenu.Items>
        <Button label="Edit" systemImage="pencil" onPress={onEditEntries} />
        <Button label="Uncheck" systemImage="checkmark.circle" onPress={onUncheck} />
        <Button label="Archive" systemImage="archivebox" onPress={onArchive} />
        <Button label="Delete" role="destructive" systemImage="trash" onPress={onDelete} />
      </ContextMenu.Items>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Preview>
        <RNHostView matchContents>
          <EntryGridPreview
            entriesByDay={entriesByDay}
            gap={entryGridGap}
            question={question}
            squareSize={entryGridSquareSize}
            weeks={entryGridWeeks}
          />
        </RNHostView>
      </ContextMenu.Preview>
    </ContextMenu>
  );
}
