---
name: survivorpulse-make-picks-epic
description: "SE-85 epic tracking the Make Picks step redesign — status, links, known dependencies"
metadata: 
  node_type: memory
  type: project
  originSessionId: 44b0b154-1de0-401c-9b8c-1df6cf97b4bf
---

Epic **SE-85 "2026-v1 My Picks -> Make Picks Step"** created 2026-07-02, filed in SP Epics, linked via Feature relation to SF-5 "Pick Analytics & Recommendations". https://app.notion.com/p/39129ce5833d8152920feb6fa683521f

**Current state of Make Picks (pre-redesign):** unchanged legacy code from SST-563 (Done), just relocated into the new 2-tab (Set Strategy | Make Picks) container by SS-1/SST-684 (Done) — never actually redesigned.

**Open items inherited from SST-563 that this epic should resolve or explicitly re-scope:**
- OQ-1: Phase 1 Data Validation staleness thresholds — RESOLVED 2026-07-03 via SST-710: DEFERRED, not a blocker for MVP (refresh cadence + fail-loud resolver make staleness a rare cadence-outage edge case, not routine). Named follow-up story created: "Auto-Allocation: surface spread finality tier + staleness warning" (https://app.notion.com/p/39229ce5833d818d8d51de3047c13d2b), Backlog.
- OQ-2: Phase 3 Lite Strategy Review drift-detection thresholds — correction from Felix (2026-07-02 review): NOT actually stubbed "always off" as the epic brief assumed. `my-picks.tsx` already has live `computeDriftTriggers` with 3 real conditions. Gap is calibration (thresholds are uncalibrated defaults), not missing logic. Split into SST-708 (document existing thresholds) vs. a separate Stan calibration spike.

**MAJOR ARCHITECTURE CORRECTION (2026-07-03):** epic's grooming assumed `client/src/components/PickGrid.tsx` was ALREADY the shared grid rendered by both My Pools and Make Picks (per SS-10/SST-702-style "shared component" discipline). **This was false.** `PickGrid.tsx` has exactly one consumer: My Pools (`my-pools-detail.tsx`). The actual Make Picks page (`my-picks.tsx`, via `picks-container.tsx`) uses a completely separate phase-based architecture (`TargetsZone`, `AllocationGrid`, `PortfolioLens`, `NeedsPickSection`, `PicksSubmittedSection`). Felix caught this when SST-705's "just add a prop" scope turned out to be a no-op with nowhere to attach.

This is NOT new scope — it's the founder's original ask ("reuse the Pick Grid component from My Pools as the focal point of the page," stated when SE-85 kicked off) — just incorrectly assumed already-true during grooming instead of correctly scoped as real work. SST-705 now correctly scoped (via Ann, 2026-07-03) to include: (a) swap Make Picks' current grid rendering to use `PickGrid` instead of `AllocationGrid`/`TargetsZone`, THEN (b) add editable-past-week behavior on top. This is a real architecture change, bigger than originally sized — Felix tasked with a fresh sizing read on how much of the phase-based logic (data validation, close-out prompts, portfolio lens slot) needs preserving vs. replacing. SST-703/704/707 were checked for the same false assumption and corrected if needed.

**Dependencies:**
- Portfolio Lens shared component — live work is in SST-568-B/C/D/E (original SST-568 is Cancelled/superseded, don't groom against it)
- Cross-Pool Allocation re-scope — SST-564 / SST-564-B
- Set Strategy redesign SS-10/SST-702 (Done as of 2026-07-03 — Pool Setup component genuinely extracted as embeddable, commit 1a0b1663, cross-consumer test passing)
- Step1→2 handoff documented in Navigation & IA Design Spec: https://app.notion.com/p/38629ce5833d81c096c8c6762590b4b2

**Schema note:** SP Epics (where SE-85 lives) is a different Notion database than SP Stories & Tasks (where the actual Backlog→Grooming→Ready→...→Done Kanban and AC/Test Case fields live).

**8 stories groomed and moved to Ready 2026-07-03 (SST-703 through SST-710):** Auto-Allocation Engine, Active Strategy Display+Ranked List Drawer, Editable Pick Grid Extension, No-Pools Fast Setup Flow, Accept-and-Submit Path, Drift Detection Wiring, Optional Detour Wiring, OQ-1 Disposition (SST-710 now Done). Plus **SST-711 "What-If Pick Preview"** (Grooming) — split out of SST-705 as a non-destructive preview feature, separate from SST-705's real persisted corrections.

**Key mid-grooming decisions (2026-07-03), all locked:**
- Auto-allocation cross-entry team collisions resolved via portfolio-level constrained optimizer (not arbitrary tie-break), maximizing total portfolio survival probability/ROI — real optimizer already exists at `server/services/portfolioRecommendation.ts`, needs reconciliation with the shared Back Tester/Set Strategy engine (2026-06-29 decision), not net-new build.
- Ranked list per entry: side drawer (not inline accordion), FULL list not truncated, 4 metrics (Composite Score, Survival %, Pick Popularity %, Future Value — friendly labels like "Saves well"/"Spend now"/"Neutral", not raw `flexibilityTier`). Backend already supports all 4 metrics + full list untruncated via `GET /api/optimizer/entry-recommendations` — do NOT wire to the two other endpoints that truncate.
- TargetsZone (legacy, `client/src/components/pool/TargetsZone.tsx`) is NOT reused for the ranked-list drawer — it's stub-wired (`targets={[]}`), missing 2 of 4 required metrics, wrong UI paradigm. Build new.
- Past-week picks are editable in Make Picks (no lock), for genuine record correction when SurvivorPulse's data doesn't match what was actually picked on the real pool platform — this deliberately triggers the existing SST-430 elimination-recompute cascade (can flip alive/eliminated status, intended not a bug).
- "What if I'd picked X" exploration is explicitly separate (SST-711) — must be non-destructive preview only, never sharing an interaction pattern with SST-705's real "save" edit.

**Founder's product vision for the redesign:** see [[project_survivorpulse_make_picks_vision]].

**Why this matters:** anchor point for all future Make Picks scoping/grooming/dev work — check this epic's current status in Notion before assuming stale info here is still accurate, especially given the architecture correction above is very recent.

**How to apply:** When resuming Make Picks work, verify current story statuses in Notion (SE-85, SST-703 through SST-711) rather than relying solely on this snapshot — this session made rapid changes overnight (2026-07-02/03) and there may be further corrections after this snapshot was written.

## CRITICAL: performance blocker found via live E2E testing (2026-07-04)

Two code review passes (unit-test level) found and fixed real bugs, but a THIRD pass — actually running the app in a browser against real dev data — found something the unit tests couldn't: `GET /api/optimizer/make-picks-allocation` (the core "auto-allocate on page load" endpoint) **hung indefinitely** against a real pool with 2 alive entries, the exact case the feature exists for. Root cause: (1) a known unfixed `@neondatabase/serverless` v0.10.4 driver bug that orphans a query's promise on connection error (never resolves/rejects), compounding with (2) a genuine pre-existing N+1 query pattern in `optimizerService.collectWeeklyData` measured at **5m50s for a single entry** on real data (sequential per-game DB round trips across 18 weeks, unbatched, uncached).

Fixed with a 90s timeout (commit `9f889d30`) that converts the hang into a proper 504 instead of hanging forever — but this is a stopgap, not a real fix. **The feature is not actually production-ready** — even without the driver bug, the underlying computation is too slow for a "loads instantly" UX. Two real follow-ups needed before this ships (not done, flagged for Pam/Luigi to scope): batch/cache the per-game query pattern in `optimizerService`, and evaluate a Neon driver upgrade.

**Why this matters:** this is the strongest evidence yet in this project that unit/integration tests mocking the DB layer are not sufficient verification for anything touching `optimizerService`'s real query patterns — a live smoke test against real data should be mandatory before calling performance-sensitive backend work "done," matching the existing [[feedback_survivorpulse_smoke_over_mocks]] lesson but this time on the backend/performance side, not just frontend reachability.

## Overnight implementation session (2026-07-02 night into 2026-07-03), branch `feat/se-85-make-picks`

Founder asked to "get these through development" while asleep. Real commits landed, all on this branch, none pushed:
- `52dedd41`, `54bb285c` — SST-705 Slices A/B (PickGrid rendered additively in Make Picks; EDIT-badge visual affordance — the underlying "lock" premise was found to already not exist in code, see [[project_survivorpulse_pickgrid_clickable_logic]])
- `38ef4628`, `ba3bf127` — SST-706 (no-pools inline state using the REAL PoolCreationWizard/AddPoolWizard flow, not PoolBasicsForm as originally misgroomed; initialPoolBasics prefill seam added but unwired — no handoff reaches Make Picks yet)
- `f42eda3e` — SST-709 (ROI/Portfolio Lens detour panel; found the standing-mode Portfolio Lens route is dead/unreachable in the active V1 router, wired to same-page scroll-anchor instead)
- `bb8279fd` — SST-708 (2 new override-driven drift conditions added alongside the 3 pre-existing ones, which were wrongly assumed to be a stub)
- `c108c61d` — SST-703 slices 1/2/5 (new `GET /api/optimizer/make-picks-allocation` route, `wasOverriddenByPortfolio` flag, `insufficientDataReason` field) — core optimizer algorithm untouched

**Story status after this session:** SST-710 Done. SST-705, SST-706, SST-708, SST-709, SST-703 all **In Review** (real code, real tests, but each flagged with something needing founder/Vlad confirmation before Done). SST-704 and SST-707 still Ready/blocked — both depend on SST-703's two remaining founder-decision items.

**Two decisions genuinely need founder input before SST-703/704/707 can complete** (both are product calls, not engineering, per Felix):
1. Within-entry tie-break rule (AC-4) — proposed: higher `pWinNow` first, then lower `yahooPickPct`, then team name as final fallback.
2. AC-3's "reassignment cascades into a new tie" — needs 2-3 concrete before/after examples to be well-defined enough to build/verify.

**Recurring pattern worth remembering:** multiple stories tonight had a false premise baked into grooming (SST-705's "PickGrid is already shared," SST-706's "PoolBasicsForm creates pools," SST-708's "drift detection is a stub," SST-709's "portfolio-lens-placeholder still exists") — each was caught by an agent actually reading the code before implementing, not trusting the story text. Worth the same discipline on any remaining/future SE-85 work.
