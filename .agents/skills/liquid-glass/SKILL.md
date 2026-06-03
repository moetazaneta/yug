---
name: liquid-glass
description: Use for Liquid Glass, native iOS visual design, Expo Router NativeTabs, glass surfaces, and related native UI work in this project.
---

# Liquid Glass

Use this skill for Liquid Glass and native iOS UI work in Yug.

## Required Context

Before writing Expo UI code, read the exact Expo SDK 56 docs at:

- https://docs.expo.dev/versions/v56.0.0/
- Use the `expo-docs-ui` skill for the versioned Expo Router, Expo UI, SDK, and third-party UI docs index before choosing APIs.

When behavior is unclear, use `btca` to inspect relevant source code for Expo, `expo-glass-effect`, `@expo/ui`, or `@callstack/liquid-glass`.

## Native First

Yug is iOS-first. Use native/system UI behavior as much as possible.

Do:

- Prefer Expo Router `NativeTabs` for tab navigation.
- Prefer `expo-glass-effect`, `@expo/ui/swift-ui`, and native iOS surfaces where they fit.
- Keep glass APIs isolated behind local components when the app needs reusable behavior.
- Use platform-native blur/material fallbacks when true Liquid Glass is unavailable.
- Keep Android and web fallbacks simple, explicit, and honest.
- Verify behavior on iOS-specific code paths when changing native glass or native tab behavior.

Do not:

- Do not fake Liquid Glass with hand-built blur, gradients, shine, fake refraction, or shadow stacks.
- Do not create custom glass tab bars when native tabs provide the behavior.
- Do not prioritize pixel-perfect imitation over native system behavior.
- Do not spread experimental native APIs throughout screen code.

## Project Context

Relevant local areas:

- `app/(tabs)/_layout.tsx` for native tabs.
- `components/GlassCheckbox.tsx` and `components/TodayInfo.tsx` for glass usage.
- `src/components/glass/GlassCard.tsx` for reusable glass surfaces.
- `modules/ClearLiquidGlassView` for custom native Liquid Glass experiments.
- `app/(tabs)/playground.tsx` for experiments before promoting patterns.

## Implementation Guidance

1. Check existing components and screen structure before adding new primitives.
2. Prefer native components and direct native props for APIs that do not map cleanly to class names.
3. Use Uniwind for ordinary layout and styling where it fits.
4. Keep glass surface dimensions and clipping stable to avoid layout shifts.
5. Run typecheck after code changes.
