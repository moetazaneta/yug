import {
  StyleSheet,
  View,
  Image,
  Text as RNText,
  Pressable,
  ScrollView,
  PlatformColor,
} from "react-native";
import { GlassContainer, GlassView } from "expo-glass-effect";
import {
  Host,
  ContextMenu,
  Button,
  Text,
  Picker,
  Menu,
  ControlGroup,
  Section,
  Divider,
  SwipeActions,
  List,
  HStack,
} from "@expo/ui/swift-ui";

import SegmentedControl from "@expo/ui/community/segmented-control";

// import { GlassCard } from "@/src/components/glass/GlassCard";
import {
  aspectRatio,
  buttonStyle,
  clipShape,
  containerShape,
  contentShape,
  controlSize,
  fixedSize,
  glassEffect,
  labelStyle,
  padding,
  pickerStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SFSymbol, SymbolView } from "expo-symbols";

import {
  LiquidGlassView,
  LiquidGlassContainerView,
  isLiquidGlassSupported,
} from "@callstack/liquid-glass";

import ClearLiquidGlassView from "@/modules/ClearLiquidGlassView/src/ClearLiquidGlassView";
import { Stack } from "expo-router";
import { SFSymbolIcon } from "expo-router/unstable-native-tabs";
import { GlassCheckbox } from "@/components/GlassCheckbox";

export default function PlaygroundScreen() {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <>
      <InboxHeader />
      <ScrollView
        className="flex flex-col gap-10 flex-1  bg-rose-300 to-emerald-300  px-5 pt-20 dark:bg-black"
        // style={{
        //   experimental_backgroundImage:
        //     "repeating-linear-gradient( 45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px )",
        // }}
      >
        {/*<ScrollView>*/}
        <RNText className="mb-5 text-3xl font-bold text-slate-950 dark:text-white">
          Playground
        </RNText>

        <RNText style={{ position: "absolute" }}>
          orem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum. Contrary to popular belief, Lorem
          Ipsum is not simply random text. It has roots in a piece of classical
          Latin literature from 45 BC, making it over 2000 years old. Richard
          McClintock, a Latin professor at Hampden-Sydney College in Virginia,
          looked up one of the more obscure Latin words, consectetur, from a
          Lorem Ipsum passage, and going through the cites of the word in
          classical literature, discovered the undoubtable source. Lorem Ipsum
          comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et
          Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC.
          This book is a treatise on the theory of ethics, very popular during
          the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
          amet..", comes from a line in section 1.10.32. The standard chunk of
          Lorem Ipsum used since the 1500s is reproduced below for those
          interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et
          Malorum" by Cicero are also reproduced in their exact original form,
          accompanied by English versions from the 1914 translation by H.
          Rackham. It is a long established fact that a reader will be
          distracted by the readable content of a page when looking at its
          layout. The point of using Lorem Ipsum is that it has a more-or-less
          normal distribution of letters, as opposed to using 'Content here,
          content here', making it look like readable English. Many desktop
          publishing packages and web page editors now use Lorem Ipsum as their
          default model text, and a search for 'lorem ipsum' will uncover many
          web sites still in their infancy. Various versions have evolved over
          the years, sometimes by accident, sometimes on purpose (injected
          humour and the like). There are many variations of passages of Lorem
          Ipsum available, but the majority have suffered alteration in some
          form, by injected humour, or randomised words which don't look even
          slightly believable. If you are going to use a passage of Lorem Ipsum,
          you need to be sure there isn't anything embarrassing hidden in the
          middle of text. All the Lorem Ipsum generators on the Internet tend to
          repeat predefined chunks as necessary, making this the first true
          generator on the Internet. It uses a dictionary of over 200 Latin
          words, combined with a handful of model sentence structures, to
          generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum
          is therefore always free from repetition, injected humour, or
          non-characteristic words etc.
        </RNText>

        <RNText>expo-glass-effect</RNText>
        <View className="flex flex-row gap-4">
          {/*<GlassView
            glassEffectStyle="clear"
            style={{ width: 200, height: 200 }}
          />*/}
          <GlassView style={{ width: 80, height: 80 }} />
          <GlassView style={{ width: 40, height: 40 }} />
          <GlassView
            glassEffectStyle="clear"
            style={{ width: 80, height: 80 }}
          />
          <GlassView
            glassEffectStyle="clear"
            style={{ width: 40, height: 40 }}
          />
        </View>

        <RNText>@callstack/liquid-glass</RNText>
        <View className="flex flex-row gap-4">
          {/*<LiquidGlassView effect="clear" style={{ width: 200, height: 200 }} />*/}
          <LiquidGlassView style={{ width: 80, height: 80 }} />
          <LiquidGlassView style={{ width: 40, height: 40 }} />
          <LiquidGlassView effect="clear" style={{ width: 80, height: 80 }} />
          <LiquidGlassView effect="clear" style={{ width: 40, height: 40 }} />
        </View>

        <View className="flex flex-row gap-4 p-8 bg-white">
          <GlassCheckbox value={isChecked} onValueChange={setIsChecked} />
          <GlassCheckbox value={false} />
        </View>

        <RNText>my custom</RNText>
        <View className="flex flex-row gap-4">
          <ClearLiquidGlassView
            style={{ borderRadius: 0, width: 200, height: 200 }}
          />
          <ClearLiquidGlassView style={{ width: 80, height: 80 }} />
          <ClearLiquidGlassView style={{ width: 40, height: 40 }} />
        </View>

        {/*<GlassButton icon="figure.yoga" onPress={() => {}} />

        <GlassCard />*/}

        {/*<GlassContainerDemo />

      <View style={{ alignSelf: "flex-start", padding: 12 }}>
        <ClearLiquidGlassView>
          <RNText
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              fontWeight: "600",
              color: "white",
            }}
          >
            Test
          </RNText>
        </ClearLiquidGlassView>
      </View>*/}

        {/*<AnimatedGlassStyleExample />
      <LiquidGlassView
        style={[
          {
            position: "absolute",
            top: 100,
            width: 100,
            height: 100,
            borderRadius: 20,
          },
          // !isLiquidGlassSupported && {
          //   backgroundColor: "rgba(255,255,255,0.5)",
          // },
        ]}
        interactive
        effect="clear"
      >
        <Text>Hello World</Text>
      </LiquidGlassView>*/}

        {/*</ScrollView>*/}
      </ScrollView>
    </>
  );
}

function GlassButton({
  icon,
  onPress,
}: {
  icon: SFSymbol;
  onPress: () => void;
}) {
  return (
    <GlassView isInteractive style={{ borderRadius: 50 }}>
      <Pressable style={{ padding: 12 }} onPress={onPress}>
        <SymbolView name={icon} tintColor={PlatformColor("label")} size={24} />
      </Pressable>
    </GlassView>
  );
}

export function GlassCard() {
  return (
    <GlassView
      style={{ borderRadius: 20, padding: 20 }}
      glassEffectStyle="clear"
    >
      <RNText
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: PlatformColor("label"),
        }}
      >
        Card Title
      </RNText>
      <RNText style={{ color: PlatformColor("secondaryLabel"), marginTop: 8 }}>
        Card content goes here
      </RNText>
    </GlassView>
  );
}

function InboxHeader() {
  return (
    <>
      <Stack.Screen.Title>Inbox</Stack.Screen.Title>
      <Stack.SearchBar placeholder="Search" onChangeText={() => {}} />
      <Stack.Toolbar placement="right">{/* Toolbar buttons */}</Stack.Toolbar>
    </>
  );
}

function SegmentedControlExample() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <SegmentedControl
      values={["One", "Two", "Three"]}
      selectedIndex={selectedIndex}
      onChange={(event) => {
        setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
      }}
    />
  );
}

function GlassContainerDemo() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={{
          uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
        }}
      />
      <GlassView
        style={{
          ...styles.glass1,
          // padding: 4,
          // backgroundColor: "tomato",
          // margin: 4,
          // borderColor: "white",
          // borderWidth: 8,
          // borderStyle: "solid",
        }}
        isInteractive
        glassEffectStyle={{
          style: "clear",
          animate: true,
        }}
      />
      <GlassView
        style={{
          ...styles.glass1,
          // position: "absolute",
          // top: 0,
          // padding: 4,
          // backgroundColor: "tomato",
          // margin: 4,
          // borderColor: "white",
          // borderWidth: 8,
          // borderStyle: "solid",
        }}
        isInteractive
        glassEffectStyle={{
          style: "clear",
          animate: true,
        }}
      />
      <GlassContainer spacing={10} style={styles.containerStyle}>
        <GlassView
          style={{
            ...styles.glass1,
            // padding: 4,
            // backgroundColor: "tomato",
            // margin: 4,
            // borderColor: "white",
            // borderWidth: 8,
            // borderStyle: "solid",
          }}
          isInteractive
          glassEffectStyle={{
            style: "clear",
            animate: true,
          }}
        />
        <GlassView style={styles.glass2} />
        <GlassView style={styles.glass3} />
      </GlassContainer>
    </View>
  );
}

function AnimatedGlassStyleExample() {
  const [visible, setVisible] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundImage}>
        <View
          style={{
            width: 300,
            height: 200,
            backgroundColor: "tomato",
          }}
        />
        {/*<Image
          style={{
            width: 300,
            height: 200,
          }}
          source={{
            uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
          }}
        />*/}
        <GlassView
          isInteractive
          style={styles.glassView}
          glassEffectStyle="clear"
          tintColor="lightgray"
          // colorScheme="light"
          //
          // glassEffectStyle={{
          //   // style: visible ? "clear" : "none",
          //   style: "clear",
          //   animate: true,
          //   animationDuration: 0.5,
          // }}
        />
      </View>
      <Pressable
        style={styles.toggleButton}
        onPress={() => setVisible((prev) => !prev)}
      >
        <RNText style={styles.toggleButtonText}>
          {visible ? "Hide" : "Show"} Glass Effect
        </RNText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  containerStyle: {
    position: "absolute",
    top: 200,
    left: 50,
    width: 250,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  glass1: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  glass2: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  glass3: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  container: {
    height: 300,
    width: 300,
  },
  backgroundImage: {
    position: "absolute",
  },
  glassView: {
    position: "absolute",
    width: 200,
    height: 120,
    borderRadius: 12,
    left: 155,
    top: 20,
  },
  toggleButton: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
