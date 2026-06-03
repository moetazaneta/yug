import type { AnswerValue } from "@/src/features/answer-question/model";

import type { TodayQuestionRow } from "./service";

export type TodayEditListProps = {
  isEditing: boolean;
  rows: TodayQuestionRow[];
  selectedQuestionIds: string[];
  onAnswerChange: (questionId: string, value: AnswerValue) => void;
  onSelectionChange: (questionIds: string[]) => void;
  onMove: (sourceIndices: number[], destination: number) => void;
  onDelete: (indices: number[]) => void;
};
