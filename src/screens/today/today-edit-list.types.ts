import type { TodayQuestionRow } from "./service";

export type TodayEditListProps = {
  rows: TodayQuestionRow[];
  selectedQuestionIds: string[];
  onSelectionChange: (questionIds: string[]) => void;
  onMove: (sourceIndices: number[], destination: number) => void;
  onDelete: (indices: number[]) => void;
};
