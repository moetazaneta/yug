import { Host, List } from "@expo/ui";

import type { Entry } from "@/src/entities/entry/model";
import type { AnswerValue } from "@/src/features/answer-question/model";

import type { TodayQuestionRow } from "../service";
import { TodayEditListRow } from "./today-edit-list-row";

type TodayQuestionListProps = {
  entriesByQuestion: Map<string, Map<string, Entry>>;
  entryGridGap: number;
  entryGridSquareSize: number;
  entryGridWeeks: Date[][];
  isEditing: boolean;
  rows: TodayQuestionRow[];
  selectedQuestionIds: string[];
  onArchiveQuestion: (questionId: string) => void;
  onAnswerChange: (questionId: string, value: AnswerValue) => void;
  onDeleteQuestion: (questionId: string) => void;
  onEditEntries: (questionId: string) => void;
  onToggleSelection: (questionId: string) => void;
  onUncheckQuestion: (questionId: string) => void;
};

export function TodayQuestionList({
  entriesByQuestion,
  entryGridGap,
  entryGridSquareSize,
  entryGridWeeks,
  isEditing,
  rows,
  selectedQuestionIds,
  onArchiveQuestion,
  onAnswerChange,
  onDeleteQuestion,
  onEditEntries,
  onToggleSelection,
  onUncheckQuestion,
}: TodayQuestionListProps) {
  const selectedQuestionIdSet = new Set(selectedQuestionIds);

  return (
    <Host style={{ flex: 1 }}>
      <List testID="today-edit-list">
        {rows.map((row) => (
          <TodayEditListRow
            key={row.question.id}
            entriesByDay={entriesByQuestion.get(row.question.id)}
            entryGridGap={entryGridGap}
            entryGridSquareSize={entryGridSquareSize}
            entryGridWeeks={entryGridWeeks}
            isEditing={isEditing}
            isSelected={selectedQuestionIdSet.has(row.question.id)}
            row={row}
            onArchiveQuestion={onArchiveQuestion}
            onAnswerChange={onAnswerChange}
            onDeleteQuestion={onDeleteQuestion}
            onEditEntries={onEditEntries}
            onToggleSelection={onToggleSelection}
            onUncheckQuestion={onUncheckQuestion}
          />
        ))}
      </List>
    </Host>
  );
}
