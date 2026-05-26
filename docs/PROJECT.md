# Yug project notes

## Native iOS Liquid Glass direction

Yug is iOS-first. Use as much native iOS Liquid Glass as Expo and the current iOS SDK allow.

Rules:

- Prefer system/native Liquid Glass over custom-drawn approximations.
- Use Expo Router `NativeTabs` for tab navigation instead of mimicking a glass tab bar in React Native.
- Use native glass primitives such as `expo-glass-effect` when available and appropriate.
- Do not try to recreate native Liquid Glass with hand-built blur, gradients, shadows, or fake specular highlights.
- If native Liquid Glass is unavailable on a platform or OS version, use the closest supported native/system fallback rather than a visual imitation.
- Keep glass usage behind app components where practical so platform-specific behavior remains isolated.

## Domain model

### Question

A question is the thing the user answers over time.

A question has:

- `id`
- `icon`
- `title`
- `description`
- `color`
- `valueType`
- `valueUnits`
- `repeat`

Answering a question creates an entry.

Examples of possible value types:

- boolean / yes-no
- number
- rating
- text
- duration
- count

`repeat` describes when the question should be answered, such as daily or on selected days. The exact repeat model can evolve, but screens should treat questions as scheduled prompts.

### Entry

An entry is one answer to one question at one point in time.

An entry has:

- `id`
- `questionId`
- `value`
- `datetime`

Entries are created by answering questions. They should remain connected to their source question through `questionId`.

## Screens

### Today

The Today screen is for answering today's questions.

It should:

- show the questions scheduled for today
- let the user answer each due question
- create entries from answers
- show useful information about today
- show useful information about the current month

### Entries

The Entries screen is for reviewing many entries grouped by question.

It should:

- show entries for each question
- visualize entries as a month grid of squares
- make it easy to scan consistency, streaks, frequency, or values over time

### Settings

The Settings screen is intentionally small for now.

It should include only:

- theme setting
- app version
