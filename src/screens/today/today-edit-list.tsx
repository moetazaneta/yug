import { ScrollView } from "react-native";

import { TodayEditRow } from "./today-edit-row";
import type { TodayEditListProps } from "./today-edit-list.types";

export function TodayEditList({
  rows,
  selectedQuestionIds,
  onSelectionChange,
}: TodayEditListProps) {
  const selectedQuestionIdSet = new Set(selectedQuestionIds);

  return (
    <ScrollView
      className="z-10 flex-1 bg-white"
      contentContainerClassName="relative px-3 pb-28 pt-2"
    >
      {rows.map(({ question }) => (
        <TodayEditRow
          key={question.id}
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
      ))}
    </ScrollView>
  );
}
