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

SHIP requires BOTH: every test suite passed AND the Manual Pre-Publish Gate below is cleared.

```
🚢  SHIP     — all suites passed AND all pending prod DB migrations/backfills applied
🚫  DO NOT SHIP — any suite failed, OR a pending prod DB migration/backfill is unapplied
```

## Manual Pre-Publish Gate — Pending Prod DB Migrations & Backfills

The automated suites above do NOT cover data that must be migrated or backfilled on the **production** database — a green suite says nothing about whether prod's existing rows are correct. Before issuing 🚢 SHIP, confirm every pending prod DB change below has been applied to production.

Rules for each item:
- Dev-first is already done for each; this gate is specifically the **prod** application.
- Follow `docs/DB_OPERATIONS.md` and the wrong-host rule: confirm `DATABASE_URL` targets **prod** (Replit PROD SQL console / Shell) and apply only on an explicit founder "ready to publish."
- Check each item off once applied-and-verified on prod, or explicitly defer it with a reason. An unapplied, undeferred item is a **DO NOT SHIP**.

Pending items:

- [ ] **SST-941 — `picks.period` backfill.** Pre-fix `batchUpsertPicks` writes carried `period='week:1'` regardless of real week/round. Dev/helium backfilled + verified 2026-07-21; **prod not yet done.** On prod, run: `npx tsx scripts/backfill-batch-picks-period.ts --audit-only` → review any collision groups (founder decision) → `--live` → re-audit until `Mismatched period: 0`. Then check this off (or delete the item). Ticket: SST-941.

## Rules

- Do not skip any suite
- Do not run suites in parallel
- Stop and report on first failure; do not continue to the next suite
- Never modify test files to make tests pass
- Never suppress or filter test output
