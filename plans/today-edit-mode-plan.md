# Today Edit Mode Plan

## References

- Project architecture: `docs/PROJECT.md`
- Expo SDK 56 NativeTabs docs: https://docs.expo.dev/versions/v56.0.0/sdk/router/native-tabs/
- Expo SDK 56 Stack toolbar docs: https://docs.expo.dev/versions/v56.0.0/sdk/router/stack/
- Expo SDK 56 SwiftUI List docs: https://docs.expo.dev/versions/v56.0.0/sdk/ui/swift-ui/list/

## Product Behavior

The Today screen gets an `Edit` toolbar button. Pressing it enters edit mode:

- The Today rows become selectable.
- The native page tabs disappear.
- A bottom toolbar appears with `Uncheck All` or `Uncheck`, `Archive`, and `Delete`.
- The top toolbar changes from `Edit` to `Done`.
- The normal right toolbar buttons disappear.
- Each row shows a selector on the left.
- Each row shows a drag handle on the right instead of its answer control.
- Deletion is soft deletion, not physical deletion.

Bottom toolbar labels:

- If no rows are selected: first action is `Uncheck All`.
- If one or more rows are selected: first action is `Uncheck`.
- `Archive` applies only to selected rows.
- `Delete` applies only to selected rows and should show a destructive confirmation.

## State Model

Use a small store/context split:

- `TodayEditProvider` or `useTodayEditStore`
  - Owns Today edit mode state.
  - Tracks `isEditing`.
  - Tracks `selectedQuestionIds`.
  - Exposes `enterEdit`, `exitEdit`, `toggleSelection`, `clearSelection`, and `setSelection`.

- `TabBarVisibilityProvider` or `useTabBarVisibilityStore`
  - Owns native tab visibility outside the Today screen.
  - Exposes `isTabBarHidden` and `setTabBarHidden`.
  - Used by `app/(tabs)/_layout.tsx` to pass `hidden={isTabBarHidden}` into `NativeTabs`.
  - Used by `TodayScreen` to hide tabs while edit mode is active and restore them on exit/unmount.

Decision to make during implementation:

- Prefer Context if state stays route/UI-scoped.
- Prefer Zustand if we want tiny global stores and fewer provider plumbing changes. Zustand is already installed.

My current preference:

- Use Zustand for tab visibility because it crosses route layout and screen boundaries.
- Use local state or a Today-specific context for selected IDs because it is screen-scoped.

## Expo SwiftUI List Research

Expo SDK 56 `@expo/ui/swift-ui/List` supports native selection, edit mode, deletion, and reordering:

- `selection`
- `onSelectionChange`
- `List.ForEach`
- `onDelete`
- `onMove`
- `environment("editMode", "active" | "inactive")`
- `tag(...)`

The documented API does not expose a standalone configurable circle selector component. The expected native selector is an effect of SwiftUI list edit selection when rows are tagged and the list has controlled `selection`.

Implementation implication:

- First prototype native SwiftUI `List` edit mode for Today rows and verify whether the native selector and drag handle match the desired iOS behavior.
- If Expo UI cannot host the existing `QuestionAnswerRow` layout and answer controls cleanly, keep the normal Today list as React Native and use SwiftUI/List only for edit mode, or build a custom React Native edit row.
- Telegram-style orange selected circles are not required. Prefer native iOS selection chrome; if that is not available, use a minimal neutral custom selector.

## Database Changes

Add lifecycle and ordering fields to `questions`:

- `archivedAt: text | null`
- `deletedAt: text | null`
- `sortOrder: integer not null`

Repository rules:

- `listQuestions()` excludes `deletedAt != null` by default.
- `listQuestionsForToday()` excludes archived and deleted questions.
- Today ordering becomes `sortOrder ASC, createdAt ASC`.
- Archive sets `archivedAt`.
- Delete sets `deletedAt`.
- Reorder persists `sortOrder`.

Migration strategy:

- Add nullable `archivedAt`.
- Add nullable `deletedAt`.
- Add `sortOrder` with a default.
- Backfill existing rows using current creation order.
- Update bootstrap/schema compatibility code in `src/shared/db/client.ts` if needed.

Open repository methods:

- `archiveQuestions(questionIds: string[])`
- `softDeleteQuestions(questionIds: string[])`
- `reorderQuestions(questionIdsInOrder: string[])`
- `listQuestionsForToday()` filters archived/deleted and orders by `sortOrder`.

Entry deletion:

- `Uncheck` and `Uncheck All` delete today entries, not questions.
- Question soft deletion does not remove historical entries.
- Entries for soft-deleted questions should remain queryable for future restore/history decisions unless the product later asks otherwise.

## UI Implementation Plan

1. Add tab visibility store/provider.
   - Create shared UI state under `src/shared/ui/navigation` or `src/shared/lib/navigation`.
   - Wire `app/(tabs)/_layout.tsx` to `NativeTabs hidden={isTabBarHidden}`.

2. Add Today edit state.
   - Add `isEditing` and `selectedQuestionIds`.
   - Reset selected IDs when leaving edit mode.
   - Hide tabs while `isEditing` is true.

3. Update `TodayToolbar`.
   - Normal mode:
     - Left: `Edit`
     - Title: today date
     - Right: existing create/edit buttons
   - Edit mode:
     - Left: `Done`
     - Title: today date
     - Right: no buttons

4. Add bottom edit toolbar.
   - Use `Stack.Toolbar placement="bottom"` only inside the page component.
   - Use flexible `Stack.Toolbar.Spacer` between buttons.
   - Buttons:
     - `Uncheck All` when nothing selected.
     - `Uncheck` when selected.
     - `Archive`
     - `Delete`
   - `Delete` opens a destructive confirmation before mutation.

5. Build row edit UI.
   - Normal mode keeps `QuestionAnswerRow`.
   - Edit mode row:
     - Left selector, preferably native/minimal rather than Telegram-orange.
     - Middle question icon/title.
     - Right drag handle.
     - Tap row toggles selection.
     - Selected row may use native selection styling or a subtle neutral tint.

6. Add reorder behavior.
   - Prefer native SwiftUI `List.ForEach onMove` if the row migration works.
   - Persist final row order through `reorderQuestions`.
   - Refetch/invalidate Today and question queries after success.

7. Add mutations.
   - `uncheckAllTodayQuestions`: deletes today entries for all visible Today question IDs.
   - `uncheckSelectedTodayQuestions`: deletes today entries for selected IDs.
   - `archiveSelectedQuestions`: sets `archivedAt`.
   - `softDeleteSelectedQuestions`: sets `deletedAt`.
   - Invalidate Today, question, and entry query keys after each mutation.

8. Platform fallback.
   - iOS: use native `NativeTabs`, `Stack.Toolbar`, and either SwiftUI `List` or custom rows depending on prototype.
   - Android/web: keep behavior functional with React Native rows if SwiftUI list is unavailable.

## Validation

- `bun run typecheck`
- Run focused tests if repositories or services get tests.
- Manual iOS checks:
  - `Edit` enters edit mode.
  - Tabs hide.
  - Header right buttons disappear.
  - `Done` exits edit mode and restores tabs.
  - Selection works.
  - Bottom toolbar labels switch between `Uncheck All` and `Uncheck`.
  - `Uncheck` removes today answers only.
  - `Archive` removes questions from Today without deleting entries.
  - `Delete` soft-deletes after confirmation.
  - Drag reorder persists across reload.

## Open Questions

- Should `Archive` be reversible in this first implementation, or is it enough to store `archivedAt` for future restore support?
- Should `Uncheck All` act on all visible Today rows even if none are selected, or should it only be enabled after selecting all?
- Should deleted questions remain visible in Entries history, or should Entries also hide deleted questions by default?
- Native SwiftUI selection is preferred; fallback should be minimal and neutral.
