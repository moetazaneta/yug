import type { Question } from "@/src/entities/question/model";

export type AnswerValue = string | number | boolean | undefined;

export type AnswerQuestionProps = {
  question: Question;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
};
