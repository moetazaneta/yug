# React Native App Stack Plan

Status: final stack selected; ready for initialization.

Goal: Initialize an iOS-first Expo React Native app named `yug` with native-feeling Liquid Glass UI, strict TypeScript guardrails, local/offline-first storage, tabs navigation, animations, local reminders, PostHog analytics, and strong LLM-resistant quality checks.

## Final Decisions

- App name: `yug`
- Framework: Expo, used extensively for best DX
- Platform: iOS-first; keep Android feasible later
- Language: TypeScript
- Controller/business layer: prefer Effect.ts v4 if practical and stable
- Package manager: Bun if Expo workflow is clean; otherwise pnpm
- UI: native iOS Liquid Glass/glassmorphism
- Liquid Glass package target: `@callstack/liquid-glass` from https://github.com/callstack/liquid-glass
- Navigation: Expo Router
- Initial navigation shape: tabs
- Theme: light mode and dark mode
- Styling: Uniwind, not NativeWind/Unistyles
- State: Zustand + TanStack Query / React Query
- Backend: none yet
- Offline: yes, local-first
- Local data: list of daily entries, expected 10–50 entries per day
- Encryption: no encryption for now
- Notifications: local reminders
- Location: ignore for now
- Monetization: ignore for now
- Analytics: PostHog
- CI: GitHub Actions
- Formatting/linting: TypeScript strict + ESLint + Oxlint + Ox formatter if practical
- Quality: extensive linting, guardrail scripts, strict `tsc`, maximize resistance to bad LLM-generated code

## Recommended Stack

### Foundation

- Expo SDK latest stable
- TypeScript
- Expo Router with top-level `app/` directory
- Tabs navigation from day one
- EAS-ready config
- Bun as first attempt; pnpm fallback if Expo/package compatibility is poor

### Platform strategy

- Build and polish iOS first.
- Keep Android feasible by isolating platform-specific visual/native APIs.
- Most TypeScript logic and screens should port, but Android will still need later validation for blur/glass behavior, notifications, permissions, app config, and release settings.

### Expo capabilities to use

- Expo Router for routing
- EAS Build-ready setup
- EAS Update later if desired
- Expo development build if native dependencies require it
- `expo-notifications` for local reminders
- `expo-sqlite` for local database
- `expo-secure-store` only if later needed for secrets/key material
- Expo config plugins as required by native packages

## Liquid Glass

Primary target:

- Use/evaluate `@callstack/liquid-glass`.
- npm package currently found as `@callstack/liquid-glass` with description “Liquid Glass in React Native”.

Important feasibility notes:

- Need to verify exact installation/config instructions during implementation.
- It may require native setup and therefore an Expo development build rather than plain Expo Go.
- If it has iOS-specific behavior, wrap it behind local components so Android fallback remains possible later.

Fallback/supporting approach if needed:

- `expo-blur` for native blur surfaces
- `expo-linear-gradient` for highlights/rims
- Reanimated for animated transitions
- Gesture Handler for interactive glass surfaces
- Reusable primitives: `GlassView`, `GlassCard`, `GlassTabBar`, `GlassHeader`, `GlassSheet`

## Navigation

Selected: Expo Router.

Why:

- File-based routing
- Excellent Expo integration
- Built on React Navigation
- Good developer experience
- Easy initial tabs structure

Initial shape:

```txt
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    entries.tsx
    settings.tsx
```

Exact tab names can change once product screens are known.

## Styling: Uniwind vs NativeWind vs Unistyles vs StyleX

### Uniwind

Selected styling system.

Package info discovered:

- npm package: `uniwind`
- version observed: `1.7.0`
- description: “The fastest Tailwind bindings for React Native”
- repository: https://github.com/uni-stack/uniwind
- docs: https://docs.uniwind.dev/

Pros:

- Tailwind-like ergonomics, matching user preference from web development.
- Claims build-time style computation for performance.
- Out-of-the-box `className` bindings for React Native components.
- Dark mode and customizable themes.
- Pseudo-class support.
- Responsive/media-query support.
- Good fit if we want Tailwind-like DX without choosing NativeWind.

Risks / things to verify during implementation:

- Expo SDK compatibility.
- Babel/Metro setup requirements.
- Compatibility with Expo Router, Reanimated, and native Liquid Glass package.
- TypeScript/className typing quality.
- Whether all desired Tailwind classes are supported.

Recommendation:

- Use Uniwind for app screens and common UI styling.
- Use Reanimated styles / direct component props for complex animated glass primitives where needed.
- Keep design tokens centralized so we can swap styling internals later if Uniwind causes issues.

### NativeWind

Pros:

- Mature Tailwind-like RN option.
- Large community.
- Fast screen-building DX.

Cons:

- User specifically prefers exploring Uniwind for performance.
- Advanced animated/glass components still often need custom styles.

### Unistyles

Pros:

- Strong RN-first styling, themes, variants, performance-oriented architecture.
- Excellent for native design-system style apps.

Cons:

- User clarified they meant Uniwind, not Unistyles.
- Less Tailwind-like.

### StyleX

Pros:

- Interesting atomic CSS-in-JS direction from Meta.

Cons:

- Not the most common/default Expo native mobile path today.
- Less straightforward than Uniwind/NativeWind for iOS-first Expo app.

## State and data

- Zustand for local UI/app state.
- TanStack Query for async/query-like workflows, cache boundaries, and future backend migration.
- Effect.ts v4 for controller/use-case layer if stable in the ecosystem and not too heavy for the initial app.
- Keep React components simple; controllers/use-cases should own business flow.

Suggested layering:

```txt
src/
  controllers/       # Effect-based or typed use cases
  data/
    db/              # SQLite schema, migrations
    repositories/    # entry repositories
  features/          # screen-level feature modules
  state/             # Zustand stores
```

## Offline storage

Expected data: 10–50 entries/day.

This is very manageable locally. Even 50 entries/day for years is fine for SQLite.

Recommended:

- SQLite as primary store.
- Migrations from day one.
- Repository layer to avoid SQL leaking into UI.
- No encryption for now, per user decision.
- Keep storage boundary clean so encrypted storage can be added later if requirements change.

### Storage options

#### Expo SQLite

Best default for this app.

- Structured data
- Query/filter/sort entries
- Migrations possible
- Works naturally with local-first app architecture

#### MMKV

Useful for fast preferences/UI state.

- Very fast key-value storage
- Not ideal as primary entry database

#### AsyncStorage

- Simple key-value fallback
- Not recommended for primary app data

#### Realm / WatermelonDB

- More power than needed for 10–50 entries/day unless sync/offline complexity grows significantly

## Forms and validation

- React Hook Form
- Zod

## Animations

Recommended from start:

- React Native Reanimated
- React Native Gesture Handler

Optional later:

- Moti for ergonomic declarative animations
- Lottie for designer-provided animations
- Skia only if Callstack Liquid Glass/fallback blur is insufficient for desired visual effects

## Notifications

Use `expo-notifications` for local reminders.

Initial scope:

- permission request flow
- schedule local notification
- cancel/reschedule reminders
- notification preferences screen

Remote push is not needed now.

## Analytics

- Use PostHog React Native SDK.
- Wrap PostHog calls behind `src/lib/analytics` so app code does not depend directly on vendor API.
- Keep privacy-friendly defaults.

## Linting, formatting, and guardrails

Selected direction:

- strict TypeScript
- ESLint for semantic/project-specific rules
- Oxlint as additional fast linting
- Ox formatter / Oxfmt if practical with Expo/TSX stack
- no Prettier unless Ox formatter is not viable

Important note:

- Oxlint is useful and fast, but should not be the only lint layer for a strict React Native TypeScript app.
- ESLint remains valuable for React Hooks, React Native, import boundaries, and ecosystem-specific rules.
- Ox formatter support must be verified during implementation. If package/tooling is immature or unavailable, fallback should be discussed rather than silently switching to Prettier.

Target scripts:

```json
{
  "typecheck": "tsc --noEmit",
  "lint": "eslint .",
  "lint:fast": "oxlint .",
  "format": "oxfmt --write .",
  "format:check": "oxfmt --check .",
  "doctor": "expo-doctor",
  "validate": "bun run typecheck && bun run lint && bun run lint:fast && bun run format:check && bun run doctor && bun run test"
}
```

Script names/commands may change based on the actual Ox formatter package/CLI.

Additional guardrails:

- strict `tsconfig.json` options such as `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`
- dependency/import boundary checks
- GitHub Actions running all checks
- optional `AGENTS.md` with code generation constraints for LLMs

## Testing

Recommended initial setup:

- Jest with Expo preset
- React Native Testing Library
- Add at least smoke tests for core primitives and controller/repository logic
- Maestro later for E2E flows

## CI/CD

GitHub Actions from the start:

- install dependencies
- typecheck
- ESLint
- Oxlint
- format check
- tests
- Expo doctor

EAS Build can be configured later or immediately after app init.

## Suggested folder structure

```txt
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    entries.tsx
    settings.tsx

src/
  components/
    glass/
    ui/
  controllers/
  data/
    db/
    repositories/
  features/
    entries/
    reminders/
    settings/
  hooks/
  lib/
    analytics/
    errors/
    platform/
  state/
  theme/
  types/
```

## Initialization Plan

1. Create Expo app `yug` with TypeScript and Expo Router.
2. Try Bun workflow first.
3. Add tabs layout.
4. Add strict TypeScript config.
5. Add Uniwind and verify Expo/Metro/Babel setup.
6. Add Reanimated and Gesture Handler.
7. Evaluate/install `@callstack/liquid-glass` and switch to development build if required.
8. Add SQLite repository skeleton for daily entries.
9. Add Zustand and TanStack Query.
10. Add PostHog wrapper.
11. Add local notifications scaffold.
12. Add ESLint, Oxlint, Ox formatter if compatible, strict scripts.
13. Add Jest/RNTL.
14. Add GitHub Actions validate workflow.

## Remaining Implementation Checks

- Verify Uniwind installation docs and Expo compatibility.
- Verify `@callstack/liquid-glass` installation docs and Expo/dev-build requirements.
- Verify Ox formatter package/CLI name and TSX support.
- Decide fallback if Ox formatter is not usable. Do not silently switch to Prettier.
