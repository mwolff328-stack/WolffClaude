---
name: project-survivorpulse-apply-write-order-collision
description: "Game Plan Apply writes cells one at a time, so storage's SEASON team-use check sees periods the same pass is about to overwrite — a plan that merely MOVES a team between weeks fails at write time even though it is legal."
metadata: 
  node_type: memory
  type: project
  originSessionId: 29ab28e5-1bde-4292-b74b-031f40ea1c5c
  modified: 2026-07-30T23:41:02.855Z
---

`POST /api/me/gameplan/apply` writes one (entry, period) cell per
`storage.replaceEntryPeriodPicks` call. That call's SEASON team-use-limit check
(`server/storage.ts`, the `picks.period != period` select) reads the DB **as it
stands at that instant**, including periods the same pass will overwrite a few
iterations later. So a plan moving team X from week 10 to week 3 fails at week
3 — X is still persisted at week 10 — and the SST-909 handler reports the
generic "Could not save this pick — please try again."

This is why failures **interleave with successes inside one entry**: the cells
that fail are the ones whose team is still parked in a not-yet-rewritten week.
SST-1112 made it common rather than rare — a past-season apply rewrites all 18
weeks of an already-populated entry, so nearly every pick is a MOVE.

`reconcileStaleFutureTeamClaims` (SST-917) does **not** cover it and should not:
it exempts any week that IS being overwritten, which is exactly the colliding
case. Downgrading those cells would also be the wrong answer — the plan is
legal, so the write must SUCCEED, not skip.

Fixed in SST-1141 by `planEntryWriteOrder` (pure, in `gameplanApplyService.ts`)
plus a per-entry clear-then-write restructure of the route loop. Two things that
are easy to get wrong:

- The check must run on the **post-lock** write set. A kickoff-locked cell has
  non-null `teamIds` in the candidate plan but is never written;
  `reconcileStaleFutureTeamClaims` runs *before* the lock check and therefore
  miscounts locked weeks as "being overwritten".
- Blocking must be computed to a **fixpoint**. Dropping a blocked cell means its
  period is no longer rewritten, which turns that period's own persisted team
  back into a live claim that can block a further cell.

**The clear and the write must be ONE transaction.** The first fix split them
into two loops, each its own transaction, and documented the window as an
accepted tradeoff. A code review failed it, correctly: the window is the whole
ENTRY, so for the rotated past-season case an interruption between the loops
wipes an entry's full season — and `docs/PRODUCT_INTEGRITY_RULES.md` Rule 4
(Pick Write Atomicity) names this route explicitly, so it was never a tradeoff
that was available to make. Scope the transaction to entries that actually need
clearing: a shared transaction cannot give per-cell `failed` granularity anyway,
because Postgres aborts the whole transaction on the first error.

**Two more traps in the same function.** `PER_PERIOD` pools run no cross-period
reuse check at all, so this logic must NO-OP there or it blocks cells that would
have written fine. And two cells of one pass claiming the same team is a plan
defect no ordering can fix — `alreadyUsedByEntry` is consulted only for `tied`
resolutions, never for `single`/`multiPick`, so distinctness rests entirely on
greedyPath.

Proven on gate run 30594602550: both integration suites executed against a real
DB and passed.

Related: [[project_survivorpulse_past_season_apply_cascades]],
[[feedback_grep_callers_before_changing_a_shared_resolver]],
[[project_survivorpulse_prepublish_gate_mechanism]]
