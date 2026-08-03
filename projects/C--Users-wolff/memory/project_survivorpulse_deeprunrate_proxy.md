---
name: survivorpulse-deeprunrate-proxy
description: "RESOLVED (SST-701, closed 2026-07-10): deepRunRate is now a real week-12 survival metric via computeDeepRunRate, informational-only (never a ranking signal). Was previously a portfolioSurvivalProbability-averaged proxy."
metadata: 
  node_type: memory
  type: project
  originSessionId: 85b3205e-0db1-4be5-a0a2-a63b54d6c38a
---

**RESOLVED within SST-701** (Engine Unification, flipped to Done 2026-07-10). What was a v1 proxy — `portfolioSurvivalProbability` averaged across seasons — is now a real week-12 survival metric: `shared/strategyEngine/deepRunRate.ts::computeDeepRunRate()` derives it from `buildGreedyPath`'s deterministic `eliminatedAtWeek` (mirrors the Back Tester's `countEntriesPastWeek`, threshold `DEEP_RUN_THRESHOLD_WEEK=12`). `engine.ts` sets `deepRunRateWeek12` per candidate; `seasonAggregation.ts` averages it (`deepRunRateAvg`); both `HistoricalAdapter` call sites in `server/services/strategyRecommendationService.ts` feed the real value into the Q25 re-rank; the `fusion.ts` docstring was corrected. Landed in commit `6ef458fb` on `2026-v1`.

**Why this matters:** The metric is **informational-only — it is never a ranking signal.** Do not treat the old "proxy" framing as still-open debt; verify proxy-flagged items against current code before acting. Relevant to [[project_survivorpulse_unified_strategy_engine]] since both Back Tester and Set Strategy consume the corrected metric through the shared fusion engine.
