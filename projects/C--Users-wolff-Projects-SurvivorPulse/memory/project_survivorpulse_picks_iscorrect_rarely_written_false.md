---
name: project_survivorpulse_picks_iscorrect_rarely_written_false
description: "picks.isCorrect is only ever written false from ONE narrow eliminationService.ts branch — never trust it as a general \"was this pick wrong\" signal."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0f47a80a-440b-4c64-ab3e-956ce8afdacb
  modified: 2026-09-11T13:57:05.985Z
---

`server/services/eliminationService.ts`'s `applyResultsToPoolEntries` writes `picks.isCorrect`
in exactly two places: `isCorrect:true` on a real win (~line 261), and `isCorrect:false` on a
TIE that does NOT eliminate the entry this round (~lines 229-241, so the GET /picks display path
renders "loss" + score). That tie-branch write fires **unconditionally**, regardless of the
pool's `tieOutcome` rule (SST-1635), and only touches the entry's **PRIMARY** pick for the week.

Neither the real eliminating-loss branch (`eliminatedByThisWeek`, ~192-201) nor a plain
survivable loss under the strike allowance (`gameResult === 'loss'`, ~243-248) ever call
`storage.updatePick(...)` at all. So in practice, `picks.isCorrect` stays `null` for most real
losses forever, and the one case where it IS `false` (a forgiven tie in a `tieOutcome:'win'`
pool) is actively misleading.

**Why:** discovered while fixing [[project_survivorpulse_portfolio_context_derived_from_shared_predicate]]
(SST-1642) — `portfolioContextService.ts`'s `buildWeeklyPickHistory` read `picks.isCorrect ===
false` directly to decide weekly alive/eliminated status, which is how this gap surfaced. Grepped
the whole `server/` tree; `eliminationService.ts:236` and `:261` are the ONLY two writers of this
column in the entire codebase.

**How to apply:** never derive "was this pick wrong" (elimination status, win/loss display,
analytics) from a raw `picks.isCorrect` read. The correct pattern — already established in
`server/routes.ts`'s `computeEntryStatusFromPicks` (~line 560) — is to classify each pick
directly from the `games` table via `classifyTeamOutcome` (in
`shared/poolRules/eliminationPredicate.ts`), then run `evaluateElimination` /
`poolToEliminationRules`. Grep for the OTHER independent readers of `picks.isCorrect` before
declaring this drift class closed — `buildWeeklyPickHistory` was a fourth, undiscovered reader
that never got wired to the SST-1212 shared predicate when it was created, and it wasn't caught
by tests/portfolioContext.integration.test.ts (TC-1..22), which checks auth/scoping/shape but
never checked computed status against ground truth.
