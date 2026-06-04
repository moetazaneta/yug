import { Stack } from "expo-router";

import type { Question } from "@/src/entities/question/model";

import { ALL_QUESTIONS_ID, type ChartSelection } from "./chart-data";

type ChartToolbarProps = {
  availableYears: number[];
  isAllQuestions: boolean;
  onSelectQuestion: (id: ChartSelection) => void;
  onSelectYear: (year: number) => void;
  questions: Question[];
  selectedId: ChartSelection;
  selectedTitle: string;
  year: number;
};

export function ChartToolbar({
  availableYears,
  isAllQuestions,
  onSelectQuestion,
  onSelectYear,
  questions,
  selectedId,
  selectedTitle,
  year,
}: ChartToolbarProps) {
  return (
    <>
      <Stack.Title></Stack.Title>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Menu>
          <Stack.Toolbar.Label>{selectedTitle}</Stack.Toolbar.Label>
          <Stack.Toolbar.MenuAction
            isOn={isAllQuestions}
            onPress={() => onSelectQuestion(ALL_QUESTIONS_ID)}
          >
            All questions
          </Stack.Toolbar.MenuAction>
          {questions.map((question) => (
            <Stack.Toolbar.MenuAction
              key={question.id}
              isOn={!isAllQuestions && selectedId === question.id}
              onPress={() => onSelectQuestion(question.id)}
            >
              {`${question.icon} ${question.title}`}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu disabled={availableYears.length === 0}>
          <Stack.Toolbar.Label>{String(year)}</Stack.Toolbar.Label>
          {availableYears.map((entryYear) => (
            <Stack.Toolbar.MenuAction
              key={entryYear}
              isOn={year === entryYear}
              onPress={() => onSelectYear(entryYear)}
            >
              {String(entryYear)}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
    </>
  );
}
