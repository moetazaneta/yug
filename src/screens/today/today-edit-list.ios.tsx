import {
  Button,
  ContextMenu,
  Host,
  HStack,
  List,
  RNHostView,
  Section,
  Spacer,
  Text,
} from "@expo/ui/swift-ui";
import {
  animation,
  Animation,
  deleteDisabled,
  environment,
  listStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import { View } from "react-native";
import type { ViewStyle } from "react-native";

import type { Entry } from "@/src/entities/entry/model";
import type { Question } from "@/src/entities/question/model";
import type { AnswerValue } from "@/src/features/answer-question/model";
import { QuestionAnswerControl } from "@/src/features/answer-question/ui/question-answer-row";
import { EntryGridPreview } from "@/src/screens/entries/entry-grid";

import type { TodayEditListProps } from "./today-edit-list.types";

export function TodayEditList({
  entriesByQuestion,
  entryGridSquareSize,
  entryGridWeeks,
  isEditing,
  rows,
  selectedQuestionIds,
  onAnswerChange,
  onArchiveQuestion,
  onDeleteQuestion,
  onEditEntries,
  onSelectionChange,
  onUncheckQuestion,
  onMove,
  onDelete,
}: TodayEditListProps) {
  return (
    <Host style={{ flex: 1 }} useViewportSizeMeasurement>
      <List
        selection={isEditing ? selectedQuestionIds : []}
        onSelectionChange={(selection) => {
          onSelectionChange(selection.map(String));
        }}
        modifiers={[
          listStyle("inset"),
          environment("editMode", isEditing ? "active" : "inactive"),
          animation(Animation.easeInOut({ duration: 0.2 }), isEditing),
        ]}
      >
        <Section>
          <List.ForEach onDelete={onDelete} onMove={onMove} modifiers={[deleteDisabled()]}>
            {rows.map(({ question, value }) => (
              <TodayQuestionListRow
                key={question.id}
                entriesByDay={entriesByQuestion.get(question.id)}
                entryGridSquareSize={entryGridSquareSize}
                entryGridWeeks={entryGridWeeks}
                question={question}
                control={
                  !isEditing ? (
                    <TodayQuestionAnswerControl
                      question={question}
                      value={value}
                      onChange={(value) => {
                        onAnswerChange(question.id, value);
                      }}
                    />
                  ) : null
                }
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
              />
            ))}
          </List.ForEach>
        </Section>
      </List>
    </Host>
  );
}

type TodayQuestionListRowProps = {
  entriesByDay: Map<string, Entry> | undefined;
  entryGridSquareSize: number;
  entryGridWeeks: Date[][];
  question: Question;
  control: React.ReactElement | null;
  onArchive: () => void;
  onDelete: () => void;
  onEditEntries: () => void;
  onUncheck: () => void;
};

function TodayQuestionListRow({
  entriesByDay,
  entryGridSquareSize,
  entryGridWeeks,
  question,
  control,
  onArchive,
  onDelete,
  onEditEntries,
  onUncheck,
}: TodayQuestionListRowProps) {
  return (
    <ContextMenu modifiers={[tag(question.id)]}>
      <ContextMenu.Items>
        <Button label="Edit" systemImage="pencil" onPress={onEditEntries} />
        <Button label="Uncheck" systemImage="checkmark.circle" onPress={onUncheck} />
        <Button label="Archive" systemImage="archivebox" onPress={onArchive} />
        <Button label="Delete" role="destructive" systemImage="trash" onPress={onDelete} />
      </ContextMenu.Items>
      <ContextMenu.Trigger>
        <HStack>
          <Text>{question.icon}</Text>
          <Text>{question.title}</Text>
          <Spacer />
          {control ? <RNHostView matchContents>{control}</RNHostView> : null}
        </HStack>
      </ContextMenu.Trigger>
      <ContextMenu.Preview>
        <EntryGridPreview
          entriesByDay={entriesByDay}
          question={question}
          squareSize={entryGridSquareSize}
          weeks={entryGridWeeks}
        />
      </ContextMenu.Preview>
    </ContextMenu>
  );
}

type TodayQuestionAnswerControlProps = {
  question: Question;
  value: AnswerValue | null;
  onChange: (value: AnswerValue) => void;
};

function TodayQuestionAnswerControl({
  question,
  value,
  onChange,
}: TodayQuestionAnswerControlProps) {
  const frameStyle = getAnswerControlFrameStyle(question);

  return (
    <View style={frameStyle}>
      <QuestionAnswerControl question={question} value={value ?? undefined} onChange={onChange} />
    </View>
  );
}

function getAnswerControlFrameStyle(question: Question): ViewStyle {
  const baseStyle = {
    alignItems: "center",
    height: 20,
    justifyContent: "center",
    marginBlock: -20,
  } satisfies ViewStyle;

  if (question.valueType === "boolean") {
    return { ...baseStyle, width: 40 };
  }

  if (question.valueType === "choice") {
    return { ...baseStyle, width: 92 };
  }

  if (question.valueType === "number") {
    return { ...baseStyle, width: 72 };
  }

  return { ...baseStyle, width: 112 };
}
