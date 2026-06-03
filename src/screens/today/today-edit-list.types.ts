import type { AnswerValue } from "@/src/features/answer-question/model";
import type { Entry } from "@/src/entities/entry/model";

import type { TodayQuestionRow } from "./service";

export type TodayEditListProps = {
  entriesByQuestion: Map<string, Map<string, Entry>>;
  entryGridSquareSize: number;
  entryGridWeeks: Date[][];
  isEditing: boolean;
  rows: TodayQuestionRow[];
  selectedQuestionIds: string[];
  onAnswerChange: (questionId: string, value: AnswerValue) => void;
  onArchiveQuestion: (questionId: string) => void;
  onDeleteQuestion: (questionId: string) => void;
  onEditEntries: (questionId: string) => void;
  onSelectionChange: (questionIds: string[]) => void;
  onUncheckQuestion: (questionId: string) => void;
  onMove: (sourceIndices: number[], destination: number) => void;
  onDelete: (indices: number[]) => void;
};
