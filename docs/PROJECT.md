# Yug project notes

## Architecture

Yug uses a pragmatic layered / feature-sliced hybrid.

Dependency direction:

```txt
app -> screens -> features -> entities -> shared
```

### Routing

`app/` is for Expo Router only. Route files should stay thin and render screen
modules from `src/screens`.

Do not put data fetching, mutations, form state, or reusable UI logic directly in
route files.

Do not create a `src/app` directory in this Expo Router project. It can confuse
route discovery and typed route generation. Use `src/providers` for app-level
providers instead.

### Screens

`src/screens/*` owns route-level composition:

- page layout
- headers and empty states
- arranging features, entities, and shared UI
- route-specific sections that are not reused elsewhere

A screen may import features, entities, and shared code.

### Features

`src/features/*` owns named user workflows. A feature is usually a verb or action
the user performs, such as:

- `create-question`
- `answer-question`

Move code from a screen to a feature when it has its own mutation/query state,
is reusable, or is independently testable as a workflow.

Keep code in a screen when it is only route composition.

### Entities

`src/entities/*` owns core domain objects:

- Drizzle schema
- schema-derived model types
- repositories
- query keys

For this small local-first app, entity model types may be derived from Drizzle
schemas. Export them through `model.ts` instead of importing schema types
directly throughout the app. This keeps a future escape hatch for separate
domain/API types.

### Shared

`src/shared/*` owns cross-cutting app infrastructure:

- `db`: Drizzle client, schema aggregation, seed/setup logic
- `ui`: reusable primitives such as glass components
- `lib`: generic utilities such as dates, ids, class-name merging, analytics
- `theme`: colors and tokens

Shared code must not import from app, screens, features, or entities.

### Database

Use Drizzle with `expo-sqlite` only.

Rules:

- database name: `yug.db`
- schema fields: camelCase
- repositories live under `src/entities/*/repository.ts`
- query keys live near the entity or feature that owns them
- date helpers live in `src/shared/lib/date.ts`

Do not add a parallel raw-SQL repository path unless there is a specific Drizzle
limitation and the boundary remains inside an entity repository.

### Native and experimental code

Keep experiments isolated in `src/screens/playground`.

Do not export production components from playground files. Promote useful
patterns into `src/shared/ui` or feature-local `ui` folders first.

The old custom `modules/ClearLiquidGlassView` native module was removed because
it was not viable for the app. Prefer supported Expo/native glass APIs.

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
