import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { TodayInfo } from "@/components/TodayInfo";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import {
  createEntry,
  listEntries,
  listEntriesToday,
} from "@/src/data/repositories/entries";
import {
  createQuestion,
  listQuestions,
  type QuestionValueType,
} from "@/src/data/repositories/questions";

import { QuestionRow } from "@/components/question-row";
import { ScrollEdgeBar } from "react-native-scroll-edge-bar";
import { BlurView } from "expo-blur";
import { GlassCard } from "./playground";
import { TodayList } from "@/components/today-list";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/src/data/db/db";

const valueTypes: QuestionValueType[] = ["boolean", "number", "text", "choice"];
const palette = ["#34C759", "#007AFF", "#AF52DE", "#FF9500", "#FF2D55"];

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme].tint;
  const [isCreating, setIsCreating] = useState(false);

  const now = new Date();
  const todayStart = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} 00:00:00`;
  const todayEnd = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} 23:59:59`;

  // const questions = useLiveQuery(
  //   db.query.entries.findMany({
  //     with: {
  //       question: true,
  //     },
  //     where: {
  //       OR: [
  //         { createdAt: { gte: todayStart } },
  //         { createdAt: { lte: todayEnd } },
  //       ],
  //     },
  //     // where: (entries, { between }) => between(entries.createdAt, [todayStart, todayEnd]),
  //   }),
  // );

  const questions = useLiveQuery(db.query.questions.findMany());
  // const questions = { data: [] };

  console.log(questions);

  // return <Text> nothing </Text>;

  return (
    <>
      <ScrollEdgeBar
        style={{
          flex: 1,
          backgroundColor: "#FEFEFE",
          // backgroundColor: "white",
        }}
        topEdgeEffectStyle="soft"
        // bottomEdgeEffectStyle="soft"
        // prefersGlassEffect={true}
      >
        <ScrollEdgeBar.TopBar
          style={{
            // backgroundColor: "rgba(0, 0, 0, 0.02)",
            // backgroundImage: "linear-gradient(to bottom, tomato, transparent)",
            // paddingHorizontal: 16,
            // backdropFilter: "blur(10px)",
            backgroundColor: "transparent",
            // height: 185,
          }}
        >
          <BlurView
            intensity={5}
            style={{
              top: -100,
              paddingHorizontal: 16,
              paddingTop: 100,
              experimental_backgroundImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.01) 75%, transparent)",
              height: 150,
            }}
          >
            {/*<GlassCard />*/}
            {/*<GlassCard />
          <GlassCard />*/}
            {/*<View className="h-16 w-full" />*/}
            <TodayInfo />
            {/*<TodayInfo />*/}
            {/*<TodayInfo />*/}
          </BlurView>
        </ScrollEdgeBar.TopBar>
        {/*<ScrollEdgeBar.TopBar
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            backgroundImage: "linear-gradient(to bottom, tomato, transparent)",
            paddingHorizontal: 16,
            // backdropFilter: "blur(10px)",
            height: 185,
          }}
        >
          <TodayInfo />
        </ScrollEdgeBar.TopBar>*/}

        {/*<View className="z-10">
          <View className="absolute z-10">
            <TodayInfo />
          </View>
        </View>*/}

        <ScrollView
          className="flex-1 z-10"
          contentContainerClassName="px-3 pb-28 pt-2 relative"
        >
          {questions.data.length === 0 ? (
            <EmptyState tint={tint} onCreate={() => setIsCreating(true)} />
          ) : (
            <Text>{JSON.stringify(questions.data)}</Text>
            // <TodayList />
          )}
        </ScrollView>

        <CreateQuestionModal
          visible={isCreating}
          onClose={() => setIsCreating(false)}
        />

        {/*<ScrollView contentInsetAdjustmentBehavior="automatic">
          {Array.from({ length: 30 }).map((_, index) => (
            <View key={index} style={{ padding: 20 }}>
              <Text>Item {index + 1}</Text>
            </View>
          ))}
        </ScrollView>

        <ScrollEdgeBar.BottomBar
          style={{ paddingHorizontal: 16, paddingVertical: 12 }}
        >
          <Text>Bottom Bar</Text>
        </ScrollEdgeBar.BottomBar>*/}
      </ScrollEdgeBar>
    </>
    // <View className="flex-1 bg-linear-to-b from-rose-300 to-emerald-300">
    //   <View className="absolute z-10 mt-16 l-0 r-0 w-full overflow-visible">
    //     <TodayInfo onNew={() => setIsCreating(true)} />
    //   </View>

    //   <ScrollView
    //     className="flex-1"
    //     contentContainerClassName="px-4 pb-28 pt-2 relative"
    //   >
    //     {questions.length === 0 ? (
    //       <EmptyState tint={tint} onCreate={() => setIsCreating(true)} />
    //     ) : (
    //       <>
    //         <View className="h-64"></View>
    //         {questions.map((question) => (
    //           <QuestionRow
    //             key={question.id}
    //             question={question}
    //             tint={tint}
    //             value={draftValues[question.id] ?? ""}
    //             isAnswered={false}
    //             // isAnswered={answeredQuestionIds.has(question.id)}
    //             onChange={(value) =>
    //               setDraftValues((draft) => ({
    //                 ...draft,
    //                 [question.id]: value,
    //               }))
    //             }
    //             onSubmit={(value) =>
    //               answerMutation.mutate({ questionId: question.id, value })
    //             }
    //           />
    //         ))}
    //       </>
    //     )}
    //   </ScrollView>

    //   <CreateQuestionModal
    //     visible={isCreating}
    //     onClose={() => setIsCreating(false)}
    //   />
    // </View>
  );
}

function EmptyState({
  tint,
  onCreate,
}: {
  tint: string;
  onCreate: () => void;
}) {
  return (
    <View className="items-center rounded-[28px] bg-white px-6 py-10 dark:bg-slate-900">
      <View className="mb-5 size-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <SymbolView name="sparkles" tintColor={tint} size={36} />
      </View>
      <Text className="text-center text-2xl font-bold text-slate-950 dark:text-white">
        No questions yet
      </Text>
      <Text className="mt-3 text-center text-base leading-6 text-slate-600 dark:text-slate-300">
        Create your first daily question. Answering it will start building your
        entries.
      </Text>
      <TouchableOpacity
        activeOpacity={0.85}
        className="mt-6 rounded-full px-6 py-3"
        style={{ backgroundColor: tint }}
        onPress={onCreate}
      >
        <Text className="font-bold text-white">Create question</Text>
      </TouchableOpacity>
    </View>
  );
}

function CreateQuestionModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [valueType, setValueType] = useState<QuestionValueType>("boolean");
  const [valueUnits, setValueUnits] = useState("");
  const [icon, setIcon] = useState("✨");
  const [color, setColor] = useState(palette[0]!);

  const mutation = useMutation({
    mutationFn: () =>
      createQuestion({
        icon,
        title: title.trim(),
        description: description.trim(),
        color,
        valueType,
        valueUnits: valueUnits.trim(),
        repeat: "daily",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["questions"] });
      setTitle("");
      setDescription("");
      setValueUnits("");
      onClose();
    },
    onError: (error) => {
      console.error("Could not save question", error);
    },
  });

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
          <Text className="text-lg font-bold text-slate-950 dark:text-white">
            New question
          </Text>
          <TouchableOpacity
            disabled={title.trim().length === 0 || mutation.isPending}
            onPress={() => mutation.mutate()}
          >
            <Text
              className={`text-base font-semibold ${title.trim().length === 0 || mutation.isPending ? "text-slate-400" : "text-blue-500"}`}
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
            {valueTypes.map((type) => (
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
            {palette.map((swatch) => (
              <Pressable
                key={swatch}
                className="size-9 rounded-full"
                style={{
                  backgroundColor: swatch,
                  borderWidth: color === swatch ? 3 : 0,
                  borderColor: "white",
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
