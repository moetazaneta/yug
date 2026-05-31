import type { Entry } from "@/src/entities/entry/model";
import {
  createOrUpdateEntry,
  deleteEntryForQuestionOnDay,
  listEntriesBetween,
} from "@/src/entities/entry/repository";
import type { Question } from "@/src/entities/question/model";
import { listQuestionsForToday } from "@/src/entities/question/repository";
import { dayBounds, monthBounds, toDayKey } from "@/src/shared/lib/date";

export type TodayQuestionRow = {
  question: Question;
  value: Entry["value"] | undefined;
};

export type TodayViewModel = {
  rows: TodayQuestionRow[];
  summary: {
    answered: number;
    total: number;
    daysWithEntries: number;
    monthPercent: number;
    todayReadable: string;
  };
};

export type AnswerTodayQuestionInput = {
  questionId: string;
  value: string | number | boolean | null | undefined;
  datetime?: Date;
};

export const todayQueryKeys = {
  view: (dayKey: string) => ["today", "view", dayKey] as const,
};

export async function getTodayViewModel(date = new Date()): Promise<TodayViewModel> {
  const today = dayBounds(date);
  const month = monthBounds(date);

  const [questions, todayEntries, monthEntries] = await Promise.all([
    listQuestionsForToday(),
    listEntriesBetween(today.start.toISOString(), today.end.toISOString()),
    listEntriesBetween(month.start.toISOString(), month.end.toISOString()),
  ]);

  const todayEntriesByQuestion = new Map(todayEntries.map((entry) => [entry.questionId, entry]));
  const rows = questions.map((question) => ({
    question,
    value: todayEntriesByQuestion.get(question.id)?.value,
  }));
  const daysWithEntries = new Set(monthEntries.map((entry) => toDayKey(entry.datetime))).size;
  const monthDayCount = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  return {
    rows,
    summary: {
      answered: todayEntriesByQuestion.size,
      total: questions.length,
      daysWithEntries,
      monthPercent: Math.round((daysWithEntries / monthDayCount) * 100),
      todayReadable: date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        weekday: "long",
      }),
    },
  };
}

export async function answerTodayQuestion({
  questionId,
  value,
  datetime = new Date(),
}: AnswerTodayQuestionInput): Promise<void> {
  if (isEmptyAnswer(value)) {
    await deleteEntryForQuestionOnDay({ questionId, datetime });
    return;
  }

  await createOrUpdateEntry({ questionId, value, datetime });
}

export function applyAnswerToTodayViewModel(
  viewModel: TodayViewModel | undefined,
  input: AnswerTodayQuestionInput,
): TodayViewModel | undefined {
  if (!viewModel) {
    return viewModel;
  }

  const hasExistingAnswer = viewModel.rows.some(
    (row) => row.question.id === input.questionId && row.value !== undefined,
  );
  const nextRows = viewModel.rows.map((row) => {
    if (row.question.id !== input.questionId) {
      return row;
    }

    return {
      ...row,
      value: isEmptyAnswer(input.value) ? undefined : String(input.value),
    };
  });
  const hasNextAnswer = nextRows.some(
    (row) => row.question.id === input.questionId && row.value !== undefined,
  );
  const answeredDelta = Number(hasNextAnswer) - Number(hasExistingAnswer);

  return {
    ...viewModel,
    rows: nextRows,
    summary: {
      ...viewModel.summary,
      answered: viewModel.summary.answered + answeredDelta,
    },
  };
}

function isEmptyAnswer(
  value: AnswerTodayQuestionInput["value"],
): value is null | undefined | false | "" {
  return value == null || value === false || (typeof value === "string" && value.trim() === "");
}
