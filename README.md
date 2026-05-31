# yug

An iOS-first Expo React Native app using Expo Router, TypeScript, native tabs, Uniwind, local-first SQLite storage, local notifications, and native/system glass UI primitives.

## Requirements

- [Bun](https://bun.sh/)
- Node.js compatible with the current Expo SDK
- Xcode/iOS Simulator for iOS development
- Expo tooling via project scripts

## Install

```sh
bun install
```

## Run the app

Start the Expo dev server:

```sh
bun run start
```

Run directly on iOS Simulator:

```sh
bun run ios
```

Run on Android emulator/device:

```sh
bun run android
```

Run on web:

```sh
bun run web
```

## Project docs

- [Project notes](docs/PROJECT.md) — native Liquid Glass direction, domain model, and screen responsibilities.
- [App stack plan](APP_STACK.md) — selected technical stack and implementation plan.

## Development checks

Run all validation checks:

```sh
bun run validate
```

Individual checks:

```sh
bun run typecheck
bun run lint
bun run lint:fast
bun run format:check
bun run doctor
bun run test
```

Format files:

```sh
bun run format
```

## Testing

This project uses Vitest for non-native unit tests:

```sh
bun run test
```

For React Native component tests that need Expo/native Jest transforms, add a separate native test setup later rather than mixing native component tests into the Vitest suite.

## Notes

- Use native/system Liquid Glass where possible, such as Expo Router `NativeTabs` or `expo-glass-effect`; do not mimic native Liquid Glass with custom blur/gradient/shadow compositions.
- Local data uses Drizzle with `expo-sqlite` through `src/entities` and `src/shared/db`.
- Analytics calls should go through `src/shared/lib/analytics` instead of importing PostHog directly in app code.

# yug
