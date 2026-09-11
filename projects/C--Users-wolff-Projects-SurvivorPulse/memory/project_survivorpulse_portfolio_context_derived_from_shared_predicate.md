---
name: project_survivorpulse_portfolio_context_derived_from_shared_predicate
description: "SST-1642 (2026-09-11) — portfolioContextService's weekly alive status now routes through evaluateElimination/poolToEliminationRules instead of raw picks.isCorrect."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0f47a80a-440b-4c64-ab3e-956ce8afdacb
  modified: 2026-09-11T13:57:21.273Z
---

`server/services/portfolioContextService.ts`'s `buildWeeklyPickHistory` (feeds the Pool →
Analysis tab's Portfolio Context panel) used to compute an entry's per-week `aliveAfterWeek` by
checking `picks.isCorrect === false` directly — ignoring the pool's `strikeCount`,
`entries.revivals`, and `pickRequirements.tieOutcome` (SST-1635). See
[[project_survivorpulse_picks_iscorrect_rarely_written_false]] for why that raw column read was
also just factually wrong most of the time.

Fixed 2026-09-11 (SST-1642, commit 77bfeeaa on `2026-v1`): it now classifies every pick from the
`games` table via `classifyTeamOutcome` and derives `aliveAfterWeek` from one call to the shared
`evaluateElimination` predicate, fed `poolToEliminationRules(pool)` + `entry.revivals` — the same
pattern `server/routes.ts`'s `computeEntryStatusFromPicks` already used. The dead, never-read
`isAlive: boolean` parameter was also removed.

**Why this matters going forward:** `portfolioContextService.ts` is now the FOURTH confirmed
reader/writer routed through `shared/poolRules/eliminationPredicate.ts`, alongside
`eliminationService.ts` (writer), `routes.ts`'s `computeEntryStatusFromPicks` (reader), and
`storage.ts`'s `computeEffectiveSpread`-adjacent resolvers are a DIFFERENT, unrelated resolver
family (canonical spreads, not elimination — don't confuse the two). If a future story touches
`evaluateElimination`/`poolToEliminationRules`'s contract (a new field, a new rule), grep ALL FOUR
call sites, not just the ones the ticket names — this bug existed specifically because a new
reader was never discovered when the predicate was introduced (SST-1212) or extended (SST-1635).

**Regression coverage:** `tests/portfolioContextWeeklyStanding.sst1642.test.ts` — 4 unit tests,
`db` fully mocked, covering strikeCount:2-after-one-loss, a revived/bought-back entry, a tie in a
`tieOutcome:'win'` pool, and a non-primary tied pick in a multi-pick week. RED-proven against the
pre-fix code; call-site wiring (not just the predicate's own internals) separately proven by
mutating the revivals/tieOutcome/gameLookup wires one at a time at `buildPortfolioContext`'s
single call site. `tests/portfolioContext.integration.test.ts` (TC-1..22, real dev DB) does NOT
cover these 4 scenarios and was not run locally (no local Postgres in this sandbox) — relying on
the `pre-publish.yml` CI gate as backstop.
