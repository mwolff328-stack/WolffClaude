---
name: pre-deploy
description: Run the full SurvivorPulse pre-publish test suite and return a SHIP / DO NOT SHIP verdict before any Replit production deployment.
triggers:
  - /pre-deploy
  - "run pre-publish"
  - "ready to deploy"
  - "pre-deploy check"
---

# Pre-Deploy: Full Pre-Publish Test Suite

You are running the SurvivorPulse pre-deployment gate. Follow every step exactly. No skipping. No parallelism.

## Environment

Before running any command, confirm these env vars are set for the process:

| Variable | Value | Purpose |
|---|---|---|
| `RUN_HTTP_INTEGRATION_TESTS` | `1` | Enable HTTP integration tests |
| `RUN_DB_REGRESSION_TESTS` | `1` | Run regression tests against live database |
| `TEST_DISABLE_NETWORK` | `0` | Allow network access during tests |
| `RUN_SIGNUP_EDGE_CASES` | `0` | Skip signup edge case tests |

These are injected automatically by `scripts/pre-publish-check.sh`.

## Execution

Run this single command. It handles all env vars and sequencing internally:

```bash
npm run test:prepublish
```

This executes in order:
1. `npm run test:unit`
2. `npm run test:integration`
3. `npm run test:e2e:project`
4. `npm run test:regression:project`

**If any suite fails, the script stops immediately. Do not proceed.**

## Reporting

After the run completes (or fails), report back with:

### Per-Suite Status Table

| Suite | Status | Test Count | Notes |
|---|---|---|---|
| Unit Tests | ✅ PASS / ❌ FAIL | N | |
| Integration Tests | ✅ PASS / ❌ FAIL | N | |
| E2E Tests | ✅ PASS / ❌ FAIL | N | |
| Regression Tests | ✅ PASS / ❌ FAIL | N | |

### Failures (if any)

For each failure, list:
- **File**: `tests/path/to/file.test.ts`
- **Test**: exact test name
- **Error**: first meaningful error line

### Final Verdict

SHIP requires ALL of: every test suite passed AND the Manual Pre-Publish Gate below is cleared AND the publisher will delete the `ALLOW_UNSAFE_DEV_FEATURES` deployment secret as part of publishing (see "After the Gate Passes" below).

```
🚢  SHIP     — all suites passed AND all pending prod DB migrations/backfills applied
              (publish is not complete until the ALLOW_UNSAFE_DEV_FEATURES deployment
               secret is deleted — see "After the Gate Passes" below)
🚫  DO NOT SHIP — any suite failed, OR a pending prod DB migration/backfill is unapplied
```

## Manual Pre-Publish Gate — Pending Prod DB Migrations & Backfills

The automated suites above do NOT cover data that must be migrated or backfilled on the **production** database — a green suite says nothing about whether prod's existing rows are correct. Before issuing 🚢 SHIP, confirm every pending prod DB change below has been applied to production.

Rules for each item:
- Dev-first is already done for each; this gate is specifically the **prod** application.
- Follow `docs/DB_OPERATIONS.md` and the wrong-host rule: confirm `DATABASE_URL` targets **prod** (Replit PROD SQL console / Shell) and apply only on an explicit founder "ready to publish."
- Check each item off once applied-and-verified on prod, or explicitly defer it with a reason. An unapplied, undeferred item is a **DO NOT SHIP**.

Pending items:

- [ ] **SST-1079 — `user_preferences` table.** Per-user store for the two pick-distinctness preferences (`within_pool_distinct`, `spread_across_pools`), which replaced the per-device localStorage model. Applied to helium 2026-07-28 and to the CI DB by the gate's schema push; **production still pending.** On prod, after confirming the console targets production, run `docs/pools-dashboard-redesign/migrations/SST-1079-user-preferences.sql` (idempotent `CREATE TABLE IF NOT EXISTS`) then its verification queries. Low urgency if missed: reads fail open to the pre-story defaults, so recommendations still work — but any user who flips either toggle gets a save error until it exists. Ticket: SST-1079.

- [ ] **SST-1037 — `pools.pool_classification` column.** Admin-only Real/Test marker. Applied to helium/dev before the code deploy (commit `bb358d00`); **prod and the CI/test DB are still pending.** Until the CI DB has it, `tests/poolClassification.integration.test.ts` cannot run. On prod, after confirming the console targets production, run `docs/pools-dashboard-redesign/migrations/SST-1037-pool-classification.sql` (idempotent `ADD COLUMN IF NOT EXISTS`) and then its verification queries. `docs/DB_OPERATIONS.md` notes it is NOT verified whether Replit's publish auto-applies additive changes — apply explicitly, don't assume. Ticket: SST-1037.

**Resolved 2026-07-24 — do not re-add** (both were verified against the named prod host and recorded on their tickets): SST-941 `picks.period` backfill (prod audit: 152 rows scanned, 0 mismatched, nothing to apply) and SST-997 `maxEntriesPerUser` 1→100 (APPLIED to prod, 31 rows — dev was a no-op and did not predict prod).

⚠️ **Coverage caveat for the automated suites above — UPDATED 2026-07-28, the mechanism is not what this note used to say.**

SST-945's FAST-mode fix **has landed**: the workflow now sets `TEST_INTEGRATION_FAST: 0` and Stage 2a is labelled "core — full mode". That part is done.

But a **second, independent gate** still hides a comparable number of tests, and turning off the first did nothing to it. On gate run `30385908570` (all stages green), **Stage 2a reported `633 passed | 241 skipped (874)` across `53 passed | 26 skipped (79)` files** — 27.6% of the stage's assertions never executed on a run reporting SUCCESS.

Cause: those 26 files gate themselves on `const SKIP_INTEGRATION = process.env['TEST_DISABLE_NETWORK'] === '1';`, and `npm run test:integration:core:full` hardcodes `TEST_DISABLE_NETWORK=1` in the script itself. (This also contradicts the Environment table at the top of this skill, which specifies `TEST_DISABLE_NETWORK=0`.) The skipped set is the Game Plan / cockpit / pick-write core — `gameplanApply*`, `gameplanResetToAuto*`, `cockpitEntries.sst789`, `cockpitSelfPoisoning.sst881`, `strategyRecommendation.ss4` (69 tests alone), `pickWriteAtomicity.tripwire`, `putPicksScheduleTypeGate`, `pnlRoutes`, and others — including several **tripwire** guards that have therefore never fired in this gate.

**So: a green gate still does NOT validate those 241 tests.** State that qualification explicitly rather than reporting an unqualified 🚢 SHIP. Full detail and the 26-file list are on the SST-945 ticket (`3a429ce5-833d-81ae-ba6a-eede3a003c66`).

To re-measure on any run: `gh run view <id> --log | grep -E "Stage 2a.*(Test Files|Tests )" | tail -2`.

## After the Gate Passes — Delete the `ALLOW_UNSAFE_DEV_FEATURES` Deployment Secret (REQUIRED before Publish)

The Replit **Deployment** has its own `ALLOW_UNSAFE_DEV_FEATURES` secret, set in **Replit → Deployments → Secrets** (the deployment's own env — SEPARATE from, and unrelated to, the workspace `.replit` `[userenv.development]` copy). `server/envValidation.ts` is a FATAL boot guard: if the production process starts with `ALLOW_UNSAFE_DEV_FEATURES=true`, it `process.exit(1)` **before the app is created**, so the Repl publish comes up broken (or refuses to boot).

So, after the Pre-Publish Gate has completed successfully and **before clicking Publish**:

1. In Replit → **Deployments → Secrets** (the deployment's own env, NOT the workspace Secrets pane), **delete** the `ALLOW_UNSAFE_DEV_FEATURES` secret. (Setting it to a non-`true` value also works, but deleting is cleaner and unambiguous.)
2. Then click **Publish**. The prod boot guard now passes and the deployment comes up.

⚠️ Do NOT touch the `.replit` file's `[userenv.development]` `ALLOW_UNSAFE_DEV_FEATURES = "true"` line — that copy is dev-only (the deployment runs `npm run start` / `NODE_ENV=production` and does not read `[userenv.development]`), and removing it would disable the deployed dev app's auto-login. This step is ONLY about the **Deployment secret** (founder ruling, 2026-07-24). The `.replit` line and the Deployment secret are two different things; leave the former, delete the latter.

Publish is not complete — and 🚢 SHIP is not truly cleared — until this deletion has been done for this publish.

## Rules

- Do not skip any suite
- Do not run suites in parallel
- Stop and report on first failure; do not continue to the next suite
- Never modify test files to make tests pass
- Never suppress or filter test output
