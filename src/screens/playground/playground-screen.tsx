import { GlassView } from "expo-glass-effect";
import { Stack, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { PlatformColor, Pressable, ScrollView, Text, View } from "react-native";

import { GlassCheckbox } from "@/src/shared/ui/glass/glass-checkbox";

export function PlaygroundScreen() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <Stack.Header blurEffect="systemMaterial" />

      {/*<Stack.SearchBar
        placeholder="Search..."
        onChangeText={(text) => console.log(text)}
      />*/}

      {/*<Stack.Header
        blurEffect="systemMaterial"
        style={{ backgroundColor: "tomato" }}
      />*/}

      <View style={{ flex: 1, padding: 16 }}>
        <Text>Note content...</Text>
      </View>

      {/*<Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon={"star.fill"} onPress={() => {}} />
        <Stack.Toolbar.Button icon="square.and.arrow.up" onPress={() => {}} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="sidebar.left" onPress={() => {}} />
      </Stack.Toolbar>



      {/*<ScrollView className="flex-1 bg-rose-300 px-5 pt-20 dark:bg-black">
        <Text className="mb-5 text-3xl font-bold text-slate-950 dark:text-white">
          Playground
        </Text>
        <Pressable onPress={() => router.push("/modal")}>
          <Text>Open Modal</Text>
        </Pressable>
        <View className="flex-row gap-4">
          <GlassView style={{ height: 80, width: 80 }} />
          <GlassView style={{ height: 40, width: 40 }} />
          <GlassView
            glassEffectStyle="clear"
            style={{ height: 80, width: 80 }}
          />
          <GlassView
            glassEffectStyle="clear"
            style={{ height: 40, width: 40 }}
          />
        </View>
        <View className="my-8 flex-row gap-4 bg-white p-8">
          <GlassCheckbox value={isChecked} onValueChange={setIsChecked} />
          <GlassCheckbox value={false} />
        </View>
        <GlassView isInteractive style={{ borderRadius: 50 }}>
          <Pressable style={{ padding: 12 }}>
            <SymbolView
              name="figure.yoga"
              tintColor={PlatformColor("label")}
              size={24}
            />
          </Pressable>
        </GlassView>
      </ScrollView>*/}
    </>
  );
}
