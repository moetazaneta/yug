import { useState } from "react";
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

import type { QuestionValueType } from "@/src/entities/question/model";
import { questionPalette, questionValueTypes } from "@/src/features/create-question/model";
import { useCreateQuestionMutation } from "@/src/features/create-question/queries";

export function CreateQuestionSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [valueType, setValueType] = useState<QuestionValueType>("boolean");
  const [valueUnits, setValueUnits] = useState("");
  const [icon, setIcon] = useState("✨");
  const [color, setColor] = useState(questionPalette[0]!);
  const mutation = useCreateQuestionMutation();
  const isDisabled = title.trim().length === 0 || mutation.isPending;

  function save() {
    mutation.mutate(
      {
        icon,
        title: title.trim(),
        description: description.trim(),
        color,
        valueType,
        valueUnits: valueUnits.trim(),
        repeat: "daily",
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setValueUnits("");
          onClose();
        },
        onError: (error) => {
          console.error("Could not save question", error);
        },
      },
    );
  }

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-slate-50 px-4 pt-5 dark:bg-black">
        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-base text-blue-500">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-slate-950 dark:text-white">New question</Text>
          <TouchableOpacity disabled={isDisabled} onPress={save}>
            <Text
              className={`text-base font-semibold ${isDisabled ? "text-slate-400" : "text-blue-500"}`}
            >
              {mutation.isPending ? "Saving" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
        {mutation.error ? (
          <Text className="mb-3 rounded-2xl bg-red-50 px-4 py-3 text-red-600 dark:bg-red-950/40 dark:text-red-300">
            Could not save question. {mutation.error.message}
          </Text>
        ) : null}
        <View className="gap-3 rounded-3xl bg-white p-4 dark:bg-slate-900">
          <TextInput
            className="rounded-2xl bg-slate-100 px-4 py-3 text-slate-950 dark:bg-slate-800 dark:text-white"
            placeholder="Title"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            className="rounded-2xl bg-slate-100 px-4 py-3 text-slate-950 dark:bg-slate-800 dark:text-white"
            placeholder="Description"
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
          />
          <View className="flex-row gap-2">
            <TextInput
              className="w-20 rounded-2xl bg-slate-100 px-4 py-3 text-center text-slate-950 dark:bg-slate-800 dark:text-white"
              value={icon}
              onChangeText={setIcon}
            />
            <TextInput
              className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-slate-950 dark:bg-slate-800 dark:text-white"
              placeholder="Units, optional"
              placeholderTextColor="#94A3B8"
              value={valueUnits}
              onChangeText={setValueUnits}
            />
          </View>
          <View className="flex-row flex-wrap gap-2">
            {questionValueTypes.map((type) => (
              <Pressable
                key={type}
                className={`rounded-full px-4 py-2 ${valueType === type ? "bg-blue-500" : "bg-slate-100 dark:bg-slate-800"}`}
                onPress={() => setValueType(type)}
              >
                <Text
                  className={`text-sm font-semibold ${valueType === type ? "text-white" : "text-slate-700 dark:text-slate-200"}`}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
          <View className="flex-row gap-2">
            {questionPalette.map((swatch) => (
              <Pressable
                key={swatch}
                className="size-9 rounded-full"
                style={{
                  backgroundColor: swatch,
                  borderColor: "white",
                  borderWidth: color === swatch ? 3 : 0,
                }}
                onPress={() => setColor(swatch)}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
