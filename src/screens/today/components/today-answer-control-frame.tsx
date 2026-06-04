import { View } from "react-native";
import type { ViewStyle } from "react-native";

import type { Question } from "@/src/entities/question/model";
import type { AnswerValue } from "@/src/features/answer-question/model";
import { QuestionAnswerControl } from "@/src/features/answer-question/ui/question-answer-row";

type TodayAnswerControlFrameProps = {
  question: Question;
  value: AnswerValue | null;
  onChange: (value: AnswerValue) => void;
};

export function TodayAnswerControlFrame({
  question,
  value,
  onChange,
}: TodayAnswerControlFrameProps) {
  return (
    <View style={getAnswerControlFrameStyle(question)}>
      <QuestionAnswerControl question={question} value={value ?? undefined} onChange={onChange} />
    </View>
  );
}

function getAnswerControlFrameStyle(question: Question): ViewStyle {
  const baseStyle = {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
  } satisfies ViewStyle;

  if (question.valueType === "boolean") {
    return { ...baseStyle, width: 44 };
  }

  if (question.valueType === "choice") {
    return { ...baseStyle, width: 96 };
  }

  if (question.valueType === "number") {
    return { ...baseStyle, width: 76 };
  }

  return { ...baseStyle, width: 116 };
}
