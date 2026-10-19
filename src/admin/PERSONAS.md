# PERSONAS — role model, approval chains, and quota wallets (design; build later)

How the seven personas map onto the portal, and how award/reward budgets flow
when the quota-carrying manager can differ per award.

## 1. Personas

| Persona | Sees | Owns | Can do |
|---|---|---|---|
| 1. Employee | Own feed/wallet/profile | own points balance | give praise (fixed-value or ≤ cap), redeem from own region's catalog |
| 2. Peer Employee | Same as employee + peer gates | own balance | give non-monetary/low-cap praise to peers (peer-to-peer rules), comment/react |
| 3. Manager L1 | Their direct reports (HRIS `managerId`) | L1 approval authority ≤ level limit | approve/return/reject praise with points up to L1 limit; recommend above it |
| 4. Manager L2 | Direct + skip reports (their subtree) | L2 approval authority ≤ level limit | same as L1 for their subtree; final stop for praise ≤ L2 limit |
| 5. Manager L3 | Org band/sub-function | L3 authority ≤ limit | same as L2 at higher band |
| 6. Manager with Quota & Budget | Their award wallet | `AWARD_QUOTA.allocated − spent` | the final wallet puncher for the awards they own — approving debits their quota |
| 7. Admin / HR | Program config + everyone's program data | rules, caps, window, banners, override | everything (can override escalations, reopen windows), plus read-only audit trail |

Key principal: **org hierarchy (who approves whom) comes from the HRIS chain;
role (what admin surfaces are visible) comes from an assigned `role` field.**
A manager is L1 to their reports and simultaneously an employee to their own
manager — persona is always evaluated *per interaction*, not held permanently.

## 2. Level authority limits (config in Principles tab later)

```ts
export interface LevelLimit {
  level: 'L1' | 'L2' | 'L3'
  /** Max praise points this level can sign off on its own. */
  approvalLimit: number
  /** Auto-approval for praise at/below this many points skips review entirely. */
  autoApproveBelow: number
}
```
Example defaults: L1 = 100 (auto ≤ 25), L2 = 500 (auto ≤ 100), L3 = 2000 (auto ≤ 500).

## 3. Award quotas — the wallet that moves per award

Quotas attach to **awards/rewards, not to people**. Any manager level can carry
a wallet; owners change per award whenever the program admin reassigns.

```ts
export interface AwardQuota {
  id: string
  /** Award/reward this quota pays for, e.g. 'EoQ · Innovator', 'Milestone · 5 yr', 'Spot award'. */
  award: string
  /** Person id of the quota-carrying manager (must be a manager in the HRIS chain). */
  quotaOwner: string
  period: string                          // e.g. 'FY26 · Q4'
  allocated: number                       // points
  spent: number
  /** How many chain levels above the giver must sign before the wallet owner. */
  routeDepth: 1 | 2 | 3
}
```

## 4. Approval chain resolution (the algorithm)

Given a request (giver → nominee, points P, award A):

1. Build the giver's manager chain from HRIS: L1 = `giver.managerId`, L2 = L1's manager, L3 = next.
2. Coin flip A is *monetary* (points > 0) or *merit* (award nomination — no points attached yet, quota debits on final approve).
3. Determine the wallet: `QUOTA[A] ?? null`.
   - If no quota exists for A → chain walks levels until `points ≤ level.approvalLimit`, else declines with "no owning wallet".
   - If a quota exists for A → the wallet owner is **always the last mandatory step**, regardless of their level.
4. Chain = the first `routeDepth` managers of the giver's chain, then (if monetary & quota exists) the wallet owner appended as the final step.
5. Steps share the pass/return/reject verdicts; a rejection anywhere stops the chain; a *return* sends it back to a previous step for edits.
6. On final approve of a monetary request → `quota.spent += points`; on reject/expire → refund status stays visible in the audit log.

Escalation extras (standard in the industry, cheap to mock):
- Step untouched for N days → auto-escalate one level up (admin-configurable).
- Insufficient remaining quota → request still routes, but the wallet owner sees a red "over budget" badge instead of being silently blocked.

## 5. Where each piece lands in the app

| Piece | Location |
|---|---|
| `role` + level limits on people | `src/data.ts` (Person gets `role?`, store reads it) |
| `AWARD_QUOTA` + seed per category | `src/admin/data.ts` (program-shaped mock) |
| Assign quota owner + allocated (per award) | Program admin → Awards tab (new card next to caps) |
| Read-only "Point quotas" tab | Finance console → new tab listing every owner's wallet remaining |
| Dynamic chain resolution | `store.tsx` → `submitForApproval`: replace hardcoded "Cost-centre head" route with the algorithm above |
| Approvals inbox chain display | Approvals screen already renders `route[]` steps — keep, just feed it resolved steps |
| Persona-aware UI gates | AppShell nav / screens check `role` + `level` (admin portal reachable both by `#/admin` and, once roles land, from the profile menu) |

## 6. Future API contract (one-line each)

- `GET /me` → person + role + level + own wallet summaries
- `POST /praise` → returns the resolved approval chain
- `GET /approvals?assignee=me` → queue for this persona
- `GET /quotas?owner=me` → my award wallets
- `PATCH /admin/quotas/:awardId` → reassign owner / adjust allocation (admin)
- `GET /admin/quotas` → finance read-only rollup

## 7. Edge cases to carry into implementation

- Leaver who is a quota owner → program admin must reassign (block on HRIS sync by flagging deactivated owners).
- Multi-person approval (co-owner wallets) → out of scope v1; note in audit trail instead.
- Quota top-up mid-window → wallet owner + finance both get notified in the audit log.
- Peer-to-peer employee (persona 2) giving points → rejected by rule unless L1 pre-approved a personal allowance.
