import { GlassView } from "expo-glass-effect";
import { Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { PlatformColor, Pressable, ScrollView, Text, View } from "react-native";

import { GlassCheckbox } from "@/src/shared/ui/glass/glass-checkbox";

export function PlaygroundScreen() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <Stack.Screen.Title>Playground</Stack.Screen.Title>
      <Stack.SearchBar placeholder="Search" onChangeText={() => {}} />
      <ScrollView className="flex-1 bg-rose-300 px-5 pt-20 dark:bg-black">
        <Text className="mb-5 text-3xl font-bold text-slate-950 dark:text-white">Playground</Text>
        <Text>expo-glass-effect</Text>
        <View className="flex-row gap-4">
          <GlassView style={{ height: 80, width: 80 }} />
          <GlassView style={{ height: 40, width: 40 }} />
          <GlassView glassEffectStyle="clear" style={{ height: 80, width: 80 }} />
          <GlassView glassEffectStyle="clear" style={{ height: 40, width: 40 }} />
        </View>
        <View className="my-8 flex-row gap-4 bg-white p-8">
          <GlassCheckbox value={isChecked} onValueChange={setIsChecked} />
          <GlassCheckbox value={false} />
        </View>
        <GlassView isInteractive style={{ borderRadius: 50 }}>
          <Pressable style={{ padding: 12 }}>
            <SymbolView name="figure.yoga" tintColor={PlatformColor("label")} size={24} />
          </Pressable>
        </GlassView>
      </ScrollView>
    </>
  );
}
