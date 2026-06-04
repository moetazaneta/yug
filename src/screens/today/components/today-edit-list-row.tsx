import { ListItem, RNHostView, Text } from "@expo/ui";
import { Text as RNText, View } from "react-native";

import type { Entry } from "@/src/entities/entry/model";
import type { AnswerValue } from "@/src/features/answer-question/model";

import type { TodayQuestionRow } from "../service";
import { TodayAnswerControlFrame } from "./today-answer-control-frame";
import { TodayQuestionContextMenu } from "./today-question-context-menu";

type TodayEditListRowProps = {
  entriesByDay: Map<string, Entry> | undefined;
  entryGridGap: number;
  entryGridSquareSize: number;
  entryGridWeeks: Date[][];
  isEditing: boolean;
  isSelected: boolean;
  row: TodayQuestionRow;
  onArchiveQuestion: (questionId: string) => void;
  onAnswerChange: (questionId: string, value: AnswerValue) => void;
  onDeleteQuestion: (questionId: string) => void;
  onEditEntries: (questionId: string) => void;
  onToggleSelection: (questionId: string) => void;
  onUncheckQuestion: (questionId: string) => void;
};

export function TodayEditListRow({
  entriesByDay,
  entryGridGap,
  entryGridSquareSize,
  entryGridWeeks,
  isEditing,
  isSelected,
  row,
  onArchiveQuestion,
  onAnswerChange,
  onDeleteQuestion,
  onEditEntries,
  onToggleSelection,
  onUncheckQuestion,
}: TodayEditListRowProps) {
  const { question, value } = row;
  const item = (
    <ListItem
      leading={<Text>{question.icon}</Text>}
      trailing={
        <RNHostView matchContents>
          {isEditing ? (
            <SelectionIndicator isSelected={isSelected} />
          ) : (
            <TodayAnswerControlFrame
              question={question}
              value={value}
              onChange={(nextValue) => {
                onAnswerChange(question.id, nextValue);
              }}
            />
          )}
        </RNHostView>
      }
      onPress={() => {
        if (isEditing) {
          onToggleSelection(question.id);
          return;
        }

        onEditEntries(question.id);
      }}
      testID={`today-question-${question.id}`}
    >
      {question.title}
    </ListItem>
  );

  if (isEditing) {
    return item;
  }

  return (
    <TodayQuestionContextMenu
      entriesByDay={entriesByDay}
      entryGridGap={entryGridGap}
      entryGridSquareSize={entryGridSquareSize}
      entryGridWeeks={entryGridWeeks}
      question={question}
      onArchive={() => {
        onArchiveQuestion(question.id);
      }}
      onDelete={() => {
        onDeleteQuestion(question.id);
      }}
      onEditEntries={() => {
        onEditEntries(question.id);
      }}
      onUncheck={() => {
        onUncheckQuestion(question.id);
      }}
    >
      {item}
    </TodayQuestionContextMenu>
  );
}

function SelectionIndicator({ isSelected }: { isSelected: boolean }) {
  return (
    <View
      className={[
        "size-6 items-center justify-center rounded-full border-2",
        isSelected ? "border-neutral-950 bg-neutral-950" : "border-neutral-300 bg-transparent",
      ].join(" ")}
    >
      {isSelected ? <RNText className="text-xs font-bold text-white">✓</RNText> : null}
    </View>
  );
}
