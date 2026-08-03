---
name: project_survivorpulse_schema_drift_helium
description: "Adding a column to shared/schema.ts without running the targeted SQL on helium 500s every full-row pool endpoint (My Pools, seasons, ROI). Known failure mode + diagnostic."
metadata: 
  node_type: memory
  type: project
  originSessionId: 31c9a07c-73e2-42e5-8448-2654a195b04d
---

SurvivorPulse failure mode confirmed 2026-07-07: the deployed dev app (2026-v1) selects full pool rows via Drizzle (`getPoolsWithEntryCounts`, `getAllPools...`, `getPool`, `getPoolWithEntryCount`). Any column added to the `pools` schema in `shared/schema.ts` that is NOT also applied to the **helium** DB makes Postgres throw `column "X" does not exist`, which 500s EVERY endpoint doing a full-row pool select: `/api/seasons`, `/api/pools`, `/api/my-pools/historical-data-summary`, ROI projections, pool detail.

Downstream symptom is deceptively data-shaped: My Pools shows "0 pools" (page defaults `pools = []` on error) and the season dropdown shows only the current season (AppContext falls back to `[currentSeason]` when `/api/seasons` fails). Looks like missing/orphaned data or a login problem, but it's a swallowed 500. Check the failing request's status in DevTools Network, or the Replit server log line `Error fetching user seasons:`.

Root process gap: the dev-first migration workflow applies `db:push` to the local test DB (ep-flat-rice) and writes a targeted idempotent SQL file under `docs/pools-dashboard-redesign/migrations/`, but the helium step is a MANUAL paste into the Replit SQL console that is easy to skip. Skipping it = outage.

This incident: commit 5d83e7cc added `settledAt` (`settled_at timestamp`). Fix = run `pool-rules-engine-3-settled-at.sql` (and companion `-1-payout-structure.sql`) in the Replit SQL console against helium. Both are `ADD COLUMN IF NOT EXISTS`, safe to re-run. Column drift, not data loss.

PROD RECONCILED 2026-07-14 (beta publish): a read-only verification script (checks information_schema/pg_type/pg_indexes for every object added by the targeted SQL files) found prod was missing everything AFTER the dep-series — SS-3, SST-567, SST-658, pool-rules-engine-1 (payout_structure), pool-rules-engine-3 (settled_at), and 2026-06-24-my-pools-schema (entries.revivals + pools.reset_team_history_on_buyback). dep2/dep3/dep5/dep6/dep7 were already on prod from the prior publish. Applied the 6 pending files (combined into one paste), re-verified all OK. LESSON: after a long publish gap, run a schema-diff verify against prod FIRST rather than trusting memory of what's applied; the pattern is "last publish got the dep-series, everything since never propagated." GOTCHA in the verify script: unquoted index names (e.g. SST-567's `IDX_efr_*`) are folded to lowercase by Postgres, so compare index names case-insensitively (`LOWER()` both sides) or you get false MISSING. See [[project_survivorpulse_db_deployment]] and [[project_survivorpulse_prior_season_playoff_data_gap]].
