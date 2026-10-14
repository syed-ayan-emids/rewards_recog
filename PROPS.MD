# PROPS.md — props patterns for this codebase

How every component's props are declared here. Follow these patterns exactly; they are checked by `npx tsc --noEmit` (`npm run check`) and reviewed in PRs.

The **atoms layer (`src/components/atoms/`) is owned by the atomic-structure team** — do not retype it here. These patterns apply to `molecules/`, `organisms/`, `templates/`, `pages/`, and `src/store.tsx`.

---

## Pattern 1 — Named exported interfaces, never inline types

Every component declares its props as a named, exported `interface XxxProps` directly above the component. Anonymous inline types are not allowed because they cannot be imported by tests, docs or callers.

```tsx
// ❌ old way
export function LeaderRow({ rank, name }: { rank: number; name: string }) { ... }

// ✅ new way
export interface LeaderRowProps {
  rank: number
  name: string
}

export function LeaderRow({ rank, name }: LeaderRowProps) { ... }
```

## Pattern 2 — JSDoc on the interface and on non-obvious props

The interface (and any prop whose meaning is not obvious from its name) gets a one-line JSDoc comment. This is what shows on hover in VS Code and flows into docs.

```tsx
export interface PraiseCardProps {
  /** The recognition post to render. */
  post: Post
  /** Post position in the feed — drives the staggered entrance animation. */
  index: number
}
```

## Pattern 3 — Optional props get defaults in the destructure

Anything optional (`?`) must state its default in the function signature so one behavior covers all call sites.

```tsx
export function AvatarStack({ ids, max = 4, size = 30 }: AvatarStackProps) { ... }
```

## Pattern 4 — Variants are literal unions, not strings

Never type a variant as `string`. Unions give autocomplete and forbid typos.

```tsx
export type BtnVariant = 'primary' | 'gold' | 'ghost' | 'outline' | 'mint' | 'violet' | 'danger'
```

## Pattern 5 — Callbacks are named `onX` and return `void`

Event-handler props follow DOM naming and never return data; state changes flow through the store or through the callback's arguments.

```tsx
export interface ApprovalDetailProps {
  item: ApprovalItem
  onResolve: (a: ApprovalItem, v: ApprovalVerdict) => void
}
```

## Pattern 6 — Extend native element attributes instead of redeclaring them

When a component is a thin wrapper around a DOM element, extend the matching React attribute interface — callers keep full `className`, `onClick`, `id`, `aria-*`, `style` support for free. Alias types (`type XxxProps = ...`) are acceptable when the interface adds no members.

```tsx
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'

export interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
}

export type CardProps = HTMLAttributes<HTMLDivElement>
```

## Pattern 7 — `children` and node-ish props are `ReactNode`

Use `import type { ReactNode } from 'react'`. Never `JSX.Element` (too narrow — excludes strings) and never `any`.

```tsx
import type { ReactNode } from 'react'

export interface SectionTitleProps {
  children: ReactNode
  right?: ReactNode
}
```

## Pattern 8 — `import type` for type-only imports, no default `React` import

With the modern JSX transform, `import React from 'react'` is only needed for runtime API (`React.StrictMode`). Import types separately with `import type` so bundlers can tree-shake and readers see intent.

```tsx
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
```

## Pattern 9 — Shared domain shapes live in `store.tsx`, once

If the same shape is used by more than one component (e.g. composer open/preset), define it once in `store.tsx`, export it, and import it everywhere else. Duplicate inline copies are forbidden.

```tsx
// store.tsx — single source of truth
export interface ComposerPreset {
  /** Person pre-selected in the "To" field of the composer. */
  toId?: string
}

export interface ComposerState {
  open: boolean
  preset?: ComposerPreset
}
```

## Pattern 10 — Generics for selectable values

Components that let the caller pick from a set of keys are generic over the key type, so `value`/`options`/`onChange` all line up.

```tsx
export interface SegmentedProps<T extends string> {
  options: { key: T; label: string }[]
  value: T
  onChange: (v: T) => void
}
```

## Pattern 11 — No `React.FC`, no `Component` classes

Function declarations only:

```tsx
export default function Composer({ open, preset }: ComposerProps) { ... }
```

## Pattern 12 — Preserved shapes (`typeof` reuse and unions)

When a prop is literally "the same shape as some existing data", reuse it instead of re-declaring (`winners: typeof JURY_NOMINEES`). Reusable unions (`ApprovalVerdict`, `NominationCategory`) are exported next to the component that introduced them.

---

## Review checklist

- [ ] Named exported `XxxProps` interface (Pattern 1)
- [ ] JSDoc on interface + non-obvious props (Pattern 2)
- [ ] Every optional prop has a destructured default (Pattern 3)
- [ ] Variants are unions (Pattern 4), callbacks are `onX` (Pattern 5)
- [ ] Native attributes extended, not redeclared (Pattern 6)
- [ ] `ReactNode` via `import type` (Patterns 7–8)
- [ ] Shared shapes imported from `store.tsx` (Pattern 9)
- [ ] No `React.FC`/inline type/class components (Patterns 11–12)
