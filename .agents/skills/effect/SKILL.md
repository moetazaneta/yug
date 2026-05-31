---
name: effect
description: Use for Effect library work in this project, especially when designing services, schemas, errors, repositories, or data workflows.
---

# Effect

Use this skill for implementation or design work involving the `effect` package.

## Source Accuracy

When Effect behavior, APIs, or patterns matter, use `btca` to inspect the current `Effect-TS/effect` source or docs before writing code. Prefer source-backed answers over memory.

## Project Guidance

This app is an Expo React Native app with SQLite, Drizzle, React Query, Zustand, and local repository modules. Use Effect where it improves typed workflows, dependency boundaries, validation, or error handling.

Prefer:

- Small typed service boundaries around meaningful side effects.
- Explicit domain errors instead of unstructured thrown exceptions.
- `Schema` for data crossing boundaries, persistence, or external inputs.
- Repository functions that are easy to call from React Query and tests.
- Incremental adoption in `src/data`, `src/features`, and shared services.

Avoid:

- Wrapping simple React component state in Effect.
- Introducing `Layer` trees before there is real dependency complexity.
- Hiding straightforward Drizzle or SQLite calls behind excessive abstractions.
- Mixing Effect control flow directly into presentational components.

## Implementation Shape

For app-facing code:

1. Keep UI components React-native idiomatic.
2. Put Effect workflows in feature, data, or service modules.
3. Expose simple functions/hooks to screens where practical.
4. Make errors visible and typed at the boundary.
5. Add focused tests for non-trivial Effect workflows.
