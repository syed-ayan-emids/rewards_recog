# SKILLS.md

Repeatable workflows for this project, for any contributor (human or Claude
Code session). `CLAUDE.md` holds the steady project facts; this file holds the
*procedures* for common tasks.

## 1. Full project check (run before calling anything "done")

```bash
npm run check   # tsc --noEmit — must exit clean
npm run test    # must pass all of tests/
```

- A green suite does not cover layout — UI changes additionally need a visual
  pass (skill 2).

## 2. Verify a UI change visually

1. If a dev server is already running on 5173, start a second one on a free
   port instead of killing theirs:
   ```bash
   npm run dev -- --port 5199
   ```
2. Open the changed screen and check at least three widths: ≥1280px
   (three-column dashboard rows), ~1100px (two-column), and <768px (stacked,
   fixed bottom nav visible).
3. Reset any browser viewport emulation to desktop before finishing.
4. Stop any extra dev server you started when done.

## 3. Edit mock data safely

1. Make the change in `src/data.ts` — it is the single source of truth.
2. Keep the invariants the suite asserts: leaderboard sorted descending; every
   `managerId` / `nomId` / org-tree id resolves to a real person; templates
   carry no `{recipient}` token; reaction counts non-negative; approval routes
   non-empty.
3. Run `npm run test`. If an invariant test fails, the *data* is wrong — unless
   the intended semantics changed, in which case update the test and note the
   reasoning in `CLAUDE.md` conventions.

## 4. Touch the screen router (compose/profile flows)

1. The `Screen` enum in `src/store.tsx` is the switchboard:
   `setComposer({open:true})` → screen `compose`; `closeComposer()` → back to
   `composerFrom`; any `setScreen` closes the composer.
2. Adding a screen: extend `Screen`, add a render branch in `src/App.tsx`, add
   a store-flow test in `tests/store.test.tsx`.

## 5. Write or reword user-facing copy

Standards: short, direct, appreciative; no metaphor stacking or marketing tone
("Seamless insight engine" ❌ — "Thank you for jumping in — we all noticed" ✓).
Second person for praise. Numbers live in tabular spans. Template prefill must
read naturally with or without a recipient name prefix ("Thank you for…",
never a bare greeting that dangles without one).

## 6. Strip visual noise (recurring design cleanup)

When asked to remove a badge/icon/text: remove the markup **and** the
now-unused imports, state, and helper code in the same edit — don't leave dead
code. Then grep the screen for the removed string to confirm it is fully gone,
and re-check the layout in a browser if the change was visible.
