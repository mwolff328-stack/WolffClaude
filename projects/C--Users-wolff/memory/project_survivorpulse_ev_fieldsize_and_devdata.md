---
name: project_survivorpulse_ev_fieldsize_and_devdata
description: "EV Lift/est. investigation — field-size bug + decided policy, denominator (SST-728) status, and that dev DB now holds 2021-2025 backtest data"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4b5d770e-c114-43ef-be0d-a39cef56ed6b
---

Two entangled EV defects surfaced 2026-07-06/07 in SurvivorPulse EV math (`computeEntryEv` = `S × (prize/(fieldSize × S_field)) − fee`), plus a data-loading milestone.

**Field-size bug (filed: Notion page 39629ce5-833d-811a-b95f-c45f57287a21, "BUG: EV est. inflated", Priority High, In Progress).** `fieldSize` is sourced from the app-tracked entry count because `pool.poolSize` is hardcoded to 0 at creation (PoolCreationWizard.tsx:334, pool-form.tsx:572) — so `prize/(tiny field × survival)` explodes past the prize (Portfolio ROI drawer showed +$516k est. on $50-100k pools). ONE shared bug, 2 resolution sites (roiProjectionService.ts:327; strategyRecommendationService.ts ~L940 + ~L1386); sl.ts computeEntryEv is a pure downstream consumer. Realized path (shared/poolRules/calculateRealizedWinnings.ts) unaffected.
- **Founder-decided fix (3-tier resolvePoolFieldSize, pure, shared/pools/fieldSize.ts):** (1) Historical Pool Data = `pool_weekly_stats.aliveEntries` (schema.ts:630) for the pool's FIRST week ("Starting Alive"); else (2) operator-entered field size (new OPTIONAL input in Create Pool wizard AND Pool Settings modal → pools.pool_size); else (3) `createdEntryCount + 50`. PLUS hard EV≤prize clamp `expectedSurvivingField = Math.max(fieldSize × fieldSurvival, 1)` in both formula fns. PLUS always DISPLAY the field size + source wherever EV Lift/est. shows. Deb does the 2 UI inputs + display; Vlad adds EV≤prize regression tests.

**Denominator issue (SST-728, In Progress, page 39529ce5-833d-81e1-a115-f677912f9dea) — DISTINCT, compounds.** `evLiftPercent = strategyLiftRaw/|evChalk|` explodes on REAL survivor pools because chalk EV ≈ 0 by pot construction. Only distorts the % lift display, not raw dollar EV. Validation (189-fixture sweep) showed **prize-per-entry** denominator is the only universally bounded one (0% explosion vs entry-fee 6% vs chalk-EV 38%), but ranking-quality needs the realized-outcome replay. Founder sequenced: **fix field-size FIRST, then run the denominator validation on the corrected baseline.**

**Dev DB now has 2021-2025 backtest data.** survivorpulse-dev (Neon shy-star-37864934, ep-flat-rice) now holds real games+outcomes+winprob+pick_popularity for 2021-2024 (from committed client/src/backtester/data fixtures) AND 2025 (272 regular + 13 playoff, from helium). 2025 outcomes are NOT in the repo — exported from Replit's **helium** DB (internal-only host `postgres@helium/heliumdb`, unreachable from local; run export IN the Replit shell → push data/season-exports/*.json → extract via `git show origin/2026-v1:...`). The seed-historical-backtesting-data.ts script only loads PICKS (assumes games pre-exist); games needed a custom loader.

See [[project_survivorpulse_db_deployment]], [[project_survivorpulse_local_verification]].
