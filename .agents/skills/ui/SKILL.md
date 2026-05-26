---
name: ui
description: Invoke this skill for UI work, especially Liquid Glass, native iOS visual design, tabs, glass surfaces, and screen styling.
---

# UI

Use this skill for UI-related implementation and design decisions in this project.

## Native Liquid Glass rule

Yug is iOS-first. Use as much native iOS Liquid Glass as possible.

Do:

- Prefer native/system UI over custom imitations.
- Use Expo Router `NativeTabs` for tab navigation when tabs are needed.
- Use `expo-glass-effect` for native Liquid Glass surfaces when available and appropriate.
- Use platform-native blur/material effects as fallback when true Liquid Glass is unavailable.
- Keep native/glass APIs isolated behind local UI components where practical.
- Read the exact Expo SDK version docs before implementing Expo UI APIs.

Do not:

- Do not mimic native Liquid Glass with hand-built blur, gradients, fake shine, fake refraction, or shadow stacks.
- Do not create custom glass tab bars when native tabs can provide the platform behavior.
- Do not prioritize pixel-perfect fake glass over system-native behavior.

## Project UI context

Main screens:

- Today: answer today's questions and show info about today and this month.
- Entries: review entries for each question as month grids of squares.
- Settings: theme and app version only for now.

Domain UI entities:

- Question: icon, title, description, color, value type, value units, repeat.
- Entry: question id, value, datetime.

## Implementation guidance

When working on UI:

1. Check existing app components and screen structure first.
2. Prefer native components and Expo Router primitives.
3. Keep Android/web fallbacks simple and honest rather than fake Liquid Glass.
4. Use Uniwind for ordinary layout/styling where it fits.
5. Use direct native component props/styles for native UI APIs that do not map cleanly to class names.
6. Run typecheck after code changes.
