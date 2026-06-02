import { Host, HStack, List, Section, Spacer, Text } from "@expo/ui/swift-ui";
import {
  animation,
  deleteDisabled,
  environment,
  font,
  foregroundStyle,
  listStyle,
  moveDisabled,
  tag,
  Animation,
} from "@expo/ui/swift-ui/modifiers";

import type { TodayEditListProps } from "./today-edit-list.types";
import { Pressable } from "react-native";
import { useState } from "react";

export function TodayEditList({
  rows,
  selectedQuestionIds,
  onSelectionChange,
  onMove,
  onDelete,
}: TodayEditListProps) {
  const [isActive, setIsActive] = useState(true);
  return (
    <>
      <Host
        style={{ flex: 1, backgroundColor: "white" }}
        useViewportSizeMeasurement
      >
        <List
          selection={selectedQuestionIds}
          onSelectionChange={(selection) => {
            onSelectionChange(selection.map(String));
          }}
          modifiers={[
            environment("editMode", isActive ? "active" : "inactive"),
            listStyle("plain"),
            animation(Animation.spring({ duration: 0.5 }), isActive),
          ]}
        >
          <Section>
            <List.ForEach onMove={onMove} modifiers={[deleteDisabled()]}>
              {rows.map(({ question }) => (
                <HStack
                  key={question.id}
                  modifiers={[tag(question.id)]}
                  spacing={12}
                >
                  <Text>{question.icon}</Text>
                  <Text modifiers={[font({ weight: "semibold" })]}>
                    {question.title}
                  </Text>
                  <Spacer />
                </HStack>
              ))}
            </List.ForEach>
          </Section>
        </List>
      </Host>
    </>
  );
}
