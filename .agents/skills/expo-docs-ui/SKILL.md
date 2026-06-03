---
name: expo-docs-ui
description: Use this skill before any UI-related Expo or React Native work in this project, including Expo Router, Native Tabs, Stack, Expo UI, SwiftUI, Jetpack Compose, Universal components, Liquid Glass, SDK UI packages, navigation components, and third-party UI libraries. Consult the exact Expo SDK 56 docs before choosing components or implementation APIs.
---

# Expo Docs UI

Use this skill as the docs-first layer for UI and navigation decisions in Yug.

## Required workflow

1. Read the exact Expo SDK 56 docs before choosing an Expo component or API:
   - https://docs.expo.dev/versions/v56.0.0/
2. Open the relevant link from [v56-docs-index.md](references/v56-docs-index.md) before deciding which component, navigator, SDK module, or third-party package to use.
3. Prefer the versioned SDK 56 page over `latest` pages. If a link redirects to `latest`, verify the page still has `docsearch:version` or path data for `v56.0.0`.
4. When the index does not cover the needed page, use Expo's official docs index:
   - https://docs.expo.dev/llms.txt
   - https://docs.expo.dev/llms-full.txt
5. For UI architecture, shared UI, screens, features, entities, or Liquid Glass work, also read `docs/PROJECT.md` before editing.

## Decision rules

- Do not pick an Expo Router, Expo UI, SwiftUI, Jetpack Compose, Universal, SDK, or third-party UI component from memory.
- For routed app navigation, check Expo Router docs first, then the versioned SDK reference for components such as `NativeTabs`, `Stack`, and `Link`.
- For native iOS controls, check `@expo/ui/swift-ui` and the specific component page before using props or modifiers.
- For cross-platform controls, check `@expo/ui` Universal first, then the platform-specific SwiftUI or Jetpack Compose page if native behavior matters.
- For package installation or compatibility, check the versioned SDK or third-party library page and use `npx expo install`.
- If behavior is unclear after reading docs, inspect source with `btca` before implementing.

## Quick links

- Versioned SDK 56 reference: https://docs.expo.dev/versions/v56.0.0/
- Expo Router docs: https://docs.expo.dev/router/introduction/
- Versioned Expo Router SDK reference: https://docs.expo.dev/versions/v56.0.0/sdk/router/
- Expo UI SDK reference: https://docs.expo.dev/versions/v56.0.0/sdk/ui/
- SwiftUI components: https://docs.expo.dev/versions/v56.0.0/sdk/ui/swift-ui/
- Universal components: https://docs.expo.dev/versions/v56.0.0/sdk/ui/universal/
- Third-party library reference: https://docs.expo.dev/versions/v56.0.0/sdk/third-party-overview/
