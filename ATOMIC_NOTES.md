# Atomic Design refactor — decision log

Structural refactor only: every component's render output, styles, and behavior were
moved verbatim; only import paths changed. Verified by `tsc --noEmit`, production
build, and a click-through of every screen in the browser.

## Nuanced classifications

- **`AvatarStack` → molecules/** — by definition it composes atoms (Avatar + a "+N"
  chip) into one unit, so it is the one molecule rather than an atom.
- **`Modal` → atoms/Modal** — it is a single-purpose primitive (portal + backdrop +
  panel) with no composition inside; treated as an atom despite its DOM footprint.
- **`EmptyState`, `SectionTitle`, `Segmented`, `CloseX`, `Delta`, `Ring`, `Bar` → atoms/** —
  fixed-shape primitives driven entirely by props (like `Btn` with its variants).
- **`NotifBell`, `ProfileMenu`, `Toasts`, `Composer`, `AiDrawer`, `PraiseCard`,
  `EoQShowcase` → organisms/** — all own state, logic, and/or store access.
- **`Mascot` → atoms/** — a purely decorative illustration atom.
- **`MobileTab` stays defined inside `templates/AppShell.tsx`** — it is tightly coupled
  to the shell's mobile bottom bar and renders nothing on its own elsewhere;
  extracting it would be taxonomy purity with no structural benefit.
- **confetti ("confettiBurst") → atoms/confettiBurst.ts** — it was co-located in the
  old ui.tsx; it is a helper, not a component, but atoms/ is its closest home until it
  earns a src/lib/ layer.

## Known gaps worth a future pass

- `PraiseCard`, `Ring`, `Delta`, and the old ui default export (`confettiBurst`) were
  **unused** before the refactor; they were preserved as-is rather than deleted.
  `PraiseCard` in particular looks intended for the home feed.
- Sticky patterns attempted here can be kept: atoms never import molecules/organisms;
  organisms never import templates/pages; pages import only atoms/molecules/organisms.

## Structure

```
src/
├── App.tsx                      # composition root (StoreProvider + AppShell)
├── data.ts / store.tsx          # domain data + state (no UI)
├── components/
│   ├── atoms/                   # Avatar, Button, Card, Chip+Delta, Progress, Modal,
│   │   ...                      # SectionTitle, EmptyState, Segmented, CloseX,
│   │   ...                      # Mascot, confettiBurst, hooks (useOutside, useHover)
│   ├── molecules/               # AvatarStack (composed of atoms)
│   ├── organisms/               # PraiseCard, EoQShowcase, Composer, AiDrawer,
│   │   ...                      # Toasts, NotifBell, ProfileMenu
│   └── templates/AppShell.tsx   # header + footer + mobile nav + page slots + overlays
└── pages/                       # Home, Rewards, Awards, Jury, Profile,
                                 # Team (+ its sub-screens OrgTree, Approvals)
```
