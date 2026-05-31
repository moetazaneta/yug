---
name: btca
description: Invoke this skill when the user says "use btca" or when source-code search would improve accuracy for libraries, frameworks, or implementation behavior.
---

# BTCA

Use this skill to improve answers by searching actual source code and project repositories instead of relying only on memory or stale docs.

## Workflow

1. Use `~/.btca/agent/sandbox` as the working area for cloned reference repositories.
2. If a repo is already present there, update it. Otherwise clone the main branch unless the user asks for a different branch, tag, or commit.
3. Search with `rg` first.
4. Cite the repository files or docs you used in the answer.
5. Keep snippets complete enough to be usable, including imports and surrounding API context.

## When To Use

Use BTCA when:

- The user says `use btca`.
- The task depends on library behavior that may be subtle or recently changed.
- Work involves `effect`, Expo, React Native, native modules, Liquid Glass, Drizzle, SQLite, React Query, or package internals.
- The user links a GitHub repository.

## Project Defaults

For this project, likely reference repos include:

- `davis7dotsh/better-context`
- `Effect-TS/effect`
- `expo/expo`
- `expo/router`
- `callstackincubator/react-native-liquid-glass`

Do not clone or search unrelated repos when local project context is enough.
