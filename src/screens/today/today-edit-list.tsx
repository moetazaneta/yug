import { ScrollView, View } from "react-native";

import { QuestionAnswerRow } from "@/src/features/answer-question/ui/question-answer-row";

import { TodayEditRow } from "./today-edit-row";
import type { TodayEditListProps } from "./today-edit-list.types";

export function TodayEditList({
  isEditing,
  rows,
  selectedQuestionIds,
  onAnswerChange,
  onSelectionChange,
}: TodayEditListProps) {
  const selectedQuestionIdSet = new Set(selectedQuestionIds);

  return (
    <ScrollView
      className="z-10 flex-1 bg-white"
      contentContainerClassName="relative px-3 pb-28 pt-2"
    >
      {rows.map(({ question, value }) => (
        <View key={question.id}>
          {isEditing ? (
            <TodayEditRow
              question={question}
              isSelected={selectedQuestionIdSet.has(question.id)}
              onToggle={() => {
                onSelectionChange(
                  selectedQuestionIdSet.has(question.id)
                    ? selectedQuestionIds.filter((id) => id !== question.id)
                    : [...selectedQuestionIds, question.id],
                );
              }}
            />
          ) : (
            <QuestionAnswerRow
              question={question}
              value={value}
              onChange={(value) => {
                onAnswerChange(question.id, value);
              }}
            />
          )}
        </View>
      ))}
    </ScrollView>
  );
}
