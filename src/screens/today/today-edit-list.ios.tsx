import {
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

import type { Question } from "@/src/entities/question/model";
import type { AnswerValue } from "@/src/features/answer-question/model";
import { QuestionAnswerControl } from "@/src/features/answer-question/ui/question-answer-row";

import type { TodayEditListProps } from "./today-edit-list.types";

export function TodayEditList({
  isEditing,
  rows,
  selectedQuestionIds,
  onAnswerChange,
  onSelectionChange,
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
          <List.ForEach
            onDelete={onDelete}
            onMove={onMove}
            modifiers={[deleteDisabled()]}
          >
            {rows.map(({ question, value }) => (
              <TodayQuestionListRow
                key={question.id}
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
              />
            ))}
          </List.ForEach>
        </Section>
      </List>
    </Host>
  );
}

type TodayQuestionListRowProps = {
  question: Question;
  control: React.ReactElement | null;
};

function TodayQuestionListRow({
  question,
  control,
}: TodayQuestionListRowProps) {
  return (
    <HStack modifiers={[tag(question.id)]}>
      <Text>{question.icon}</Text>
      <Text>{question.title}</Text>
      <Spacer />
      {control ? <RNHostView matchContents>{control}</RNHostView> : null}
    </HStack>
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
      <QuestionAnswerControl
        question={question}
        value={value ?? undefined}
        onChange={onChange}
      />
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
