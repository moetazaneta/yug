---
name: decompose-big-files
description: Use when refactoring large React, React Native, Expo, or TSX files in this project, especially files with many components, dense JSX, overloaded screen components, or UI entities such as toolbars, rows, cards, panels, lists, and widget inner/body splits.
---

# Decompose Big Files

Use this skill when a file is large enough that navigation, hook ownership, JSX density, or component boundaries are getting in the way.

## Goal

Make React files easier to read and change by extracting obvious UI pieces and stateful subcomponents. Keep the refactor practical and local; do not turn a straightforward screen into a full clean-architecture rewrite.

## Core preferences

Prefer:

- One primary component per file when the file is otherwise getting large.
- Small colocated helper components only when they are tiny, stateless, and make the parent easier to read.
- Extracted components for obvious UI entities such as `Toolbar`, `Row`, `Section`, `Panel`, `Card`, `List`, `EmptyState`, `Header`, `Footer`, or `Actions`.
- Extracted components when a child owns state, refs, animations, memoization, effects, or event handling that is specific to that child.
- `Widget` plus `WidgetBody` or `WidgetInner` when hooks must live below a provider, guard, measurement boundary, suspense boundary, route boundary, or early return.
- Passing the smallest practical prop surface instead of threading entire parent state objects through many layers.
- Keeping domain and data-loading behavior in the existing project pattern rather than inventing new layers.

Avoid:

- Many medium or large React components in one file.
- Huge JSX blocks inside a component when named pieces would make the structure obvious.
- Extracting tiny one-off JSX into files just to reduce line count.
- Creating generic abstractions before there are at least two real call sites or a clear local convention.
- Moving state upward or outward unless the behavior genuinely belongs to the parent or shared feature.
- Introducing new service, entity, model, presenter, or clean-architecture folders just because a component is large.

## Refactoring workflow

1. Read the file and nearby components before changing boundaries.
2. Identify the parent component's actual responsibilities: data loading, orchestration, layout, interaction, visual sections.
3. Extract obvious visual or behavioral entities first.
4. If a section has local state or hooks, move that state with the extracted component when possible.
5. If hooks cannot be called conditionally, split into `Widget` and `WidgetBody`/`WidgetInner` so the outer component handles branching and the inner component owns hooks.
6. Keep names concrete and domain-oriented. Prefer `QuestionRow` over `Item`, `MonthToolbar` over `Controls`, and `EntryValueEditor` over `Form`.
7. Keep file boundaries boring: sibling files near the original screen/component unless the repo already has a stronger convention.
8. Run typecheck or the closest focused verification after changes.

## Extraction rules of thumb

Extract to a new file when:

- The extracted component is more than a small helper and has a stable name.
- The component has local state, effects, refs, animation state, or non-trivial event handlers.
- The parent becomes mostly orchestration and named sections after extraction.
- The component is likely to be reused by a sibling screen or feature.

Keep inside the same file when:

- The component is only a few lines and purely presentational.
- It exists only to satisfy a hook placement rule, as with `WidgetBody` or `WidgetInner`.
- Moving it would create more imports, prop plumbing, or indirection than clarity.

Do not extract solely because:

- The file crossed an arbitrary line count.
- A JSX element has several props.
- A component might theoretically be reusable later.

## Hook and state ownership

- State should live with the smallest component that needs to read and update it.
- Parent components should not retain child-only state after extracting a child entity.
- Derived values should stay near their inputs unless shared by multiple children.
- Event handlers should move with the component that owns the interaction, while parent callbacks should represent meaningful outcomes.
- When splitting `Widget`/`WidgetBody`, keep the outer component focused on guards, providers, layout constraints, and prop normalization.

## Output expectations

When applying this skill:

- Preserve behavior unless the user asks for a behavior change.
- Keep the diff scoped to decomposition and directly necessary import/export updates.
- Mention the main components extracted and any state moved.
- Call out verification performed, especially `typecheck`.
