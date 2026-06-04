---
name: architecture
description: Use when changing screen architecture, component boundaries, screen-local state, TanStack Query placement, screen folders, or refactoring React Native/Expo screens in this project. Applies Yug's screen structure conventions: screens own route composition, complex screen state lives in screen-local stores, screen data logic lives in query option factories, and reusable dumb UI belongs in shared/global component folders.
---

# Architecture

Use this skill to keep Yug screen refactors consistent and boring.

## Related skills

Use these when they apply:

- `decompose-big-files`: `.agents/skills/decompose-big-files/SKILL.md`
  Use when a React/TSX file is large, dense, or needs extraction into named pieces.
- `tanstack-query`: `/Users/moe/.codex/skills/tanstack-query/SKILL.md`
  Use when adding or refactoring TanStack Query keys, query options, mutation options, invalidation, or optimistic updates.

## Screen folder shape

A non-trivial screen should use this local shape:

```txt
src/screens/<screen>/
├── <screen>-screen.tsx
├── <screen>-store.ts
├── components/
└── queries/
    ├── query-keys.ts
    ├── query-options.ts
    └── mutation-options.ts
```

Use files only when needed:

- `<screen>-screen.tsx`: route-level composition, layout choice, connecting major sections.
- `<screen>-store.ts`: screen-local view model for UI/client state that multiple screen components need.
- `components/`: screen-specific components, including stateful components if their behavior is not reusable elsewhere.
- `queries/query-keys.ts`: TanStack Query key factories.
- `queries/query-options.ts`: query option factories.
- `queries/mutation-options.ts`: mutation option factories, mutation hooks that encapsulate `useQueryClient`, invalidation helpers, and cache update logic.

Do not create extra folders just to satisfy the shape. Add them when the screen has real state, query logic, or components to organize.

## State ownership

For simple one-component state, local `useState` is fine.

When screen state is complex or multiple screen components read/write it, create a screen-local Zustand store:

```txt
src/screens/today/today-store.ts
```

Treat this store as the screen's view model. It models the interactive UI state and actions for that screen, such as edit mode, selected ids, active filters, and screen commands. It gives screen-specific components a shared behavioral model without turning the route component into a prop-threading layer.

Examples of screen-local store state:

- edit mode
- selected ids
- active local filters
- temporary UI mode
- expanded/collapsed screen sections when many components need them

Keep server state out of screen stores. Server state belongs in TanStack Query.

Keep purely derived state local to the component that derives it unless multiple components need the same value.

## Component boundaries

Prefer components that own their own behavior.

If a screen-specific component needs edit state, selected ids, or screen mode, let it read the screen store directly instead of threading props through the screen. Example: a `TodayTopToolbar` can read `isEditing`, `enterEdit`, and `exitEdit` from `today-store.ts`.

Components may fetch or mutate data themselves when the behavior is local to that component and the query/mutation options live in the screen or feature `queries/` module.

Do not fetch server data in a parent solely to pass it to children. TanStack Query caches and dedupes identical queries, so sibling or nested screen components may call the same query independently when that keeps ownership local.

Avoid making every extracted component dumb. In this project, dumb/presentational components are usually shared or reusable and live in global/shared component folders. Screen-local components can be stateful and behavior-owning when that reduces prop plumbing.

Use callback props for meaningful parent outcomes, not for every small internal interaction.

## Query boundaries

Follow the `tanstack-query` skill.

Keep TanStack Query concerns in `queries/`:

- key factories
- `queryOptions` factories
- `mutationOptions` factories
- invalidation
- optimistic cache writes
- rollback
- `queryClient` usage

Components should usually call:

```ts
const query = useQuery(screenQueryOptions(input));
const mutation = useScreenMutation();
```

Components should not usually contain:

- raw `queryKey` arrays
- `invalidateQueries`
- `setQueryData`
- `cancelQueries`
- `getQueryData`

Keep navigation, alerts, modal closing, and screen-local UI state updates at the call site unless the behavior is part of the mutation's server-state contract.

## Refactor checklist

Before finishing a screen architecture refactor:

- Screen file reads as route composition, not a dumping ground.
- Complex screen UI state is in `<screen>-store.ts`, treated as the screen view model.
- Components that naturally own interactions read the screen store directly.
- Query keys and cache updates are in `queries/`, not components.
- Components that need server data call colocated query options directly instead of receiving parent-fetched query rows.
- Screen-local components stay in `components/`.
- Reusable dumb UI is promoted to shared/global UI only when there is a real reuse case.
- Large-file decomposition follows `.agents/skills/decompose-big-files/SKILL.md`.
- TanStack Query work follows `/Users/moe/.codex/skills/tanstack-query/SKILL.md`.
- Run `bun run typecheck` after code changes.
