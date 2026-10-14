# CLAUDE.md

Project instructions for anyone (human or Claude Code session) working in this
repository.

## What this is

**emids · Rewards and Recognition** (package name `applause-portal`) — an internal
employee recognition portal. Front-end only: all people, posts, points, approvals,
jury ballots and the org tree are mock data in `src/data.ts`. There is no backend;
state lives in one React context and resets on reload. Deploys as a static site
via `render.yaml` (SPA rewrite to `/index.html`).

Stack: React 18, TypeScript (strict), Vite 5, Tailwind CSS v4, lucide-react,
canvas-confetti. Node 20 target.

## Running the project

```bash
npm install
npm run dev      # Vite dev server on port 5173
npm run build    # production build to dist/
npm run check    # tsc --noEmit — must pass clean
npm run test     # Vitest, one shot
npm run test:watch
```

If your machine has Node only under WSL (Windows), prefix commands with
`wsl --cd <path-to-repo> -- npm ...`. If a dev server instance is already using
port 5173, start yours with `npm run dev -- --port <free-port>`.

## Architecture

- **Atomic design**: `src/components/atoms/` (Avatar, Btn, Card, Chip, Modal,
  Segmented, Ring, EmptyState, hooks — exported via `atoms/index.ts`),
  `molecules/`, `organisms/` (Composer, AiDrawer, PraiseCard, Toasts…),
  `templates/AppShell.tsx`.
- **Routing** (`src/store.tsx`): no router library — a `screen` state drives
  switching in `src/App.tsx`. Screens: home, team, rewards, awards, jury,
  profile, **compose** (Recognize a teammate is a real screen, not a modal;
  `setComposer({open:true})` navigates to it and `closeComposer()` restores the
  previous screen).
- **Mock data** (`src/data.ts`): the single source of truth. `pages/` holds the
  screens (Home dashboard w/ leaderboard, Team, Approvals…).
- Tailwind v4 design tokens live in `src/index.css` (`@theme` block:
  navy/brand/gold/violet/mint/coral/warn + per-value colors). Reuse these
  tokens; don't invent new palette slots.

## Props conventions

- **`PROPS.MD` (repo root) is the props catalog** — 12 patterns every component
  outside the atoms layer must follow. They are checked by `npm run check`
  (`tsc --noEmit`) and reviewed in PRs. Read it before adding or changing any
  component.
- Quick rules: named, **exported** `interface XxxProps` with JSDoc above each
  component (never inline `{ … }` types); optional props get destructured
  defaults; variant props are literal unions; callbacks are named `onX` and
  return void; node-ish props are `ReactNode` via `import type { ReactNode }`;
  no `React.FC`; no default `React` import just for types.
- **Shared shapes live once in `src/store.tsx`** (`ComposerPreset`,
  `ComposerState`, `SendPraisePayload`) — import them, don't re-declare.
- The **atoms layer (`src/components/atoms/`) is owned by the atomic-structure
  team** — do not retype its props in a props pass; keep that boundary.
- Extend native React attribute interfaces (`ButtonHTMLAttributes`,
  `HTMLAttributes`) when a component just wraps a DOM element.

## Design and content conventions

- **No gratuitous decoration**: no small icons, badges, numbers-of-record
  kickers, or labels unless they carry meaning. Decorative adds ("Specificity"
  meter, shield icons, "Pass/Clean" chips) have been deliberately removed
  before — don't reintroduce them unprompted.
- **Copy style**: simple, natural, appreciative; no marketing phrasing.
  Praise templates are direct thank-you notes; `Composer` prepends the
  recipient's first name ("Priya — Thank you for…") when one is selected, so a
  prefill must read naturally with or without a name prefix.
- **Points semantics**: 1 pt = ₹1. `TEAM_LEADERBOARD` is *peer points received
  this quarter*, sorted descending, excluding EoQ prize payouts.
- Dashboard stat cards sit three-up; the home leaderboard shows the top 5.

## Testing

- Vitest + Testing Library in `tests/` (jsdom; RTL setup in `tests/setup.ts`).
- Prefer **structural/invariant assertions** over exact seed values so light
  `data.ts` edits don't break tests (e.g. "leaderboard is sorted", "every
  manager id resolves").
- `tests/screens.test.tsx` encodes behavior decisions: approvals keep their
  decision pill ("Approved"/"Next time") in Done, the top-5 leaderboard, and
  composer prefill wording.
- The one-shot `canvas-confetti` import only fires on submit — tests that
  render the composer don't load it.

## Gotchas

- jsdom lacks `window.scrollTo` — stubbed in `tests/setup.ts`. The store calls
  it, so don't delete the call from `store.tsx` to quiet a test failure.
- `Modal` (`components/atoms/Modal.tsx`) renders via **createPortal to
  document.body** — query rendered content with `screen.getBy…`, not `container`.
- The working tree can change between sessions (files have moved
  `screens/` ↔ `pages/`, `ui.tsx` → `components/atoms`). Re-read files before
  editing; if you find an orphaned copy, delete it rather than leaving it to
  break `tsc --noEmit`.
- Never quietly revert someone else's uncommitted edits — verify and adapt.
