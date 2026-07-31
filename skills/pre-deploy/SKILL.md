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

## Execution — the gate is a CI workflow, not a local command

**Run the gate on GitHub Actions. Do not try to run it locally.**

```bash
gh workflow run pre-publish.yml --ref 2026-v1
```

Then capture the run id and watch it. The run takes ~15 minutes, which exceeds the 10-minute Bash tool timeout — start the watch **in the background** rather than blocking:

```bash
gh run list --workflow=pre-publish.yml --limit 1 --json databaseId --jq '.[0].databaseId'
```

```bash
gh run watch <id> --exit-status
```

On failure, the workflow records which stage died in `FAILED_STAGE`, and the failing test comes out of:

```bash
gh run view <id> --log-failed
```

### Why not `npm run test:prepublish`

That script (`scripts/pre-publish-check.sh`) is the POSIX/CI-parity entry point, and it **cannot run on the Windows dev box**:

- The npm scripts use POSIX inline env syntax (`NODE_ENV=test … vitest`). npm hands that to `cmd.exe`, which fails with `'NODE_ENV' is not recognized`.
- The DB-dependent stages need a live database with network. The `dbHostGuard` (SST-1006) correctly refuses to run them against the shared dev database — which you must never pollute with an unattended test run anyway.

The workflow's own `on:` block includes `workflow_dispatch` for exactly this reason; its comment says so explicitly.

### What the gate actually runs, in order

Each stage is a separate step with no `continue-on-error`, so **the job stops at the first failing stage** — you get one failing stage per run, not a full picture.

| Stage | What it runs |
|---|---|
| DB setup | Provisions ephemeral Postgres, pushes `shared/schema.ts` fresh, seeds teams |
| **Stage 1** | Unit tests — the FULL unit suite, sharded `--shard=N/8` |
| **Stage 2a** | Integration — core, full mode (`test:integration:core:full`) |
| **Stage 2b** | Integration — slow, full mode, 0 skips |
| **Stage 2c** | HTTP integration (auth endpoints), against a server it starts and stops |
| **Stage 3** | `npm run test:e2e:project` — vitest in node, **no browser** (see SST-1129 below) |
| **Stage 4a/b/c** | Regression — module boundary check, scoped test-data cleanup, verify no test pools remain |
| Summary | Per-stage totals + the residual-skip inventory |

Unlike the other stages, Stage 1 runs **all 8 shards even when one fails** (it accumulates `STATUS` and exits at the end), so a Stage 1 failure shows you every shard.

### Reading the printed totals — two traps

1. **The Summary prints `integ-core` and `integ-slow` lines only. There is no Stage 1 line.** A unit-test change moves a number the summary never shows. The **869 passed / 9 skipped** baseline quoted throughout this file is **Stage 2a alone**, not the whole suite.
2. **Which stage a test lands in is decided by its FILENAME.** `vitest.integration.core.config.ts` (Stage 2a) matches only `tests/**/*.integration.test.ts(x)` — the `.integration.` infix is what routes it. A file under `tests/` *without* that infix is a Stage 1 **unit** test, and `client/**/*.test.tsx` are Stage 1 too. Never map a test-count delta onto the Stage 2a baseline without first checking whether your changed files are even in that config.

### What you CAN run locally

- **Unit/component suites**, via Git Bash (they are `dbHostGuard`-exempt per SST-1006's scoping):
  ```bash
  NODE_ENV=test TEST_DISABLE_NETWORK=1 TEST_FAST_OPTIMIZER=1 npx vitest run <file> --config vitest.config.ts --no-file-parallelism
  ```
- **Pure `readFileSync` source-scan e2e tests** with `SKIP_DB_GUARD=1` — safe, they touch no DB.

⚠️ `npm run test:unit` exits 0 on Windows **without running anything** (same POSIX env syntax problem). Never quote it as a green result.

## Environment

These are set by the workflow; you do not set them yourself. Listed so you can tell deliberate config from drift.

| Variable | Gate value | Purpose |
|---|---|---|
| `RUN_HTTP_INTEGRATION_TESTS` | `1` | Enable HTTP integration tests |
| `RUN_DB_REGRESSION_TESTS` | `1` | Run regression tests against the live test database. **Set in `pre-publish.yml` and nowhere else** — suites gated on it are `describe.skip` locally and execute only on the gate, so a local green run says nothing about them. |
| `TEST_DISABLE_NETWORK` | `1` in CI | Deliberate, not drift. Since SST-1088 it no longer affects which suites run — it now means only "no outbound internet". DB-integration suites gate on whether a disposable database is reachable (`tests/guards/dbIntegrationGate.ts`). |
| `RUN_SIGNUP_EDGE_CASES` | `0` | Skip signup edge case tests |

## Reporting

After the run completes (or fails), report back with:

### Per-Stage Status Table

| Stage | Status | Test Count | Notes |
|---|---|---|---|
| Stage 1 — Unit | ✅ PASS / ❌ FAIL | N | 8 shards; failure report lists every failing shard |
| Stage 2a — Integration (core, full mode) | ✅ PASS / ❌ FAIL | N | this is the "integ-core" line in the gate Summary |
| Stage 2b — Integration (slow, full mode) | ✅ PASS / ❌ FAIL | N | "integ-slow" in the Summary |
| Stage 2c — HTTP integration (auth) | ✅ PASS / ❌ FAIL | N | starts and stops its own server |
| Stage 3 — `test:e2e:project` | ✅ PASS / ❌ FAIL | N | vitest in node, **no browser** — see SST-1129 below |
| Stage 4 — Regression (a/b/c) | ✅ PASS / ❌ FAIL | N | module boundaries, test-data cleanup, no leftover test pools |
| **Browser (Playwright)** | **NOT RUN BY THIS GATE** | — | separate workflow — see below |

Pull counts from the gate's own Summary step output where it prints one (Stage 2a/2b); for Stage 1 there is no Summary line — read the shard totals from the Stage 1 step's own log instead (`gh run view <id> --log | grep -E "Stage 1|Test Files"`).

**SST-1129 — do not report Stage 3 as "E2E Tests".** It is `npm run test:e2e:project`, which is vitest over `tests/` in node; it never launches a browser. The stage was named "E2E tests" until 2026-07-31 and that name was itself the misleading claim. The Playwright browser suite lives in `playwright-ci.yml` and has **never** been part of the Pre-Publish Gate.

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
              BROWSER COVERAGE IS NOT INCLUDED — state the Playwright status separately.
🚫  DO NOT SHIP — any suite failed, OR a pending prod DB migration/backfill is unapplied
```

### Browser coverage must be stated separately (SST-1129)

A green Pre-Publish Gate says nothing about the browser suite. Every SHIP verdict must carry one of these, explicitly:

```
Browser (Playwright): ✅ green — run <id>, <ref/SHA>, N shards, executed=N did-not-run=0
Browser (Playwright): ⚠️ NOT RUN against this commit — browser regressions would not have been caught
```

Get one before recommending a publish:

```bash
gh workflow run playwright-ci.yml --ref 2026-v1
```

This matters most for commits pushed **directly** to `2026-v1`: `playwright-ci.yml` triggers only on `workflow_dispatch` or a `pull_request` into `2026-v1`, so a direct push matches neither and gets zero browser coverage (SST-1114). Never let "the gate is green" stand in for a browser run that did not happen.

## Manual Pre-Publish Gate — Pending Prod DB Migrations & Backfills

The automated suites above do NOT cover data that must be migrated or backfilled on the **production** database — a green suite says nothing about whether prod's existing rows are correct. Before issuing 🚢 SHIP, confirm every pending prod DB change below has been applied to production.

Rules for each item:
- Dev-first is already done for each; this gate is specifically the **prod** application.
- Follow `docs/DB_OPERATIONS.md` and the wrong-host rule: confirm `DATABASE_URL` targets **prod** (Replit PROD SQL console / Shell) and apply only on an explicit founder "ready to publish."
- Check each item off once applied-and-verified on prod, or explicitly defer it with a reason. An unapplied, undeferred item is a **DO NOT SHIP**.

Pending items:

*(none currently — the list below is the resolved history. Add new items here as stories introduce prod schema changes.)*

**Resolved 2026-07-28 — do not re-add** (both applied to production by the founder at the 2026-07-28 publish; prod verified reachable and serving afterwards, which it would not be under schema drift):
- **SST-1079 — `user_preferences` table.** Per-user store for the two pick-distinctness preferences (`within_pool_distinct`, `spread_across_pools`). File: `docs/pools-dashboard-redesign/migrations/SST-1079-user-preferences.sql`.
- **SST-1037 — `pools.pool_classification` column.** Admin-only Real/Test marker. File: `docs/pools-dashboard-redesign/migrations/SST-1037-pool-classification.sql`.

**Resolved 2026-07-24 — do not re-add** (both were verified against the named prod host and recorded on their tickets): SST-941 `picks.period` backfill (prod audit: 152 rows scanned, 0 mismatched, nothing to apply) and SST-997 `maxEntriesPerUser` 1→100 (APPLIED to prod, 31 rows — dev was a no-op and did not predict prod).

**Standing rule, proven 2026-07-28:** the **CI/test DB is never a pending item.** The gate provisions an ephemeral Postgres (`localhost:5432/ci_test`) and pushes the schema fresh on every run, so anything in `shared/schema.ts` exists there automatically — `tests/poolClassification.integration.test.ts` passed 8/8 while SST-1037 was still listed as "CI pending". Only **production** is ever pending. Do not chase phantom CI-DB migrations.

✅ **Coverage note for the automated suites above — RESOLVED 2026-07-28 (SST-1088). The old caveat here is obsolete; do not reinstate it.**

This section used to instruct you to report a **qualified** 🚢 SHIP on the grounds that ~241 Stage 2a tests — including several `*.tripwire` guards — never executed, citing run `30385908570`. **That is no longer true, and stating it now understates the gate's real coverage.**

Both causes are fixed and merged to `2026-v1`:
- SST-945 landed the FAST-mode fix (`TEST_INTEGRATION_FAST: 0`, Stage 2a "core — full mode").
- **SST-1088** fixed the second, independent gate. 24 suites self-skipped on `TEST_DISABLE_NETWORK`, which they used as a *proxy* for "no database here" — true on a laptop, false in CI, where the gate disables outbound internet **and** provisions a Postgres. They now gate on real DB availability (`tests/guards/dbIntegrationGate.ts`). Two files that ran in no stage at all were also fixed: `pnlRoutes` (needs only a DB → Stage 2a) and `strategies` (needs a live server → Stage 2c).

| Stage 2a | before | after |
|---|---|---|
| passed | 633 | **864** |
| skipped | **241** | **10** |
| failed | 0 | 0 |

Confirmed on two independent runs against different code: `30416680520` (SST-1088 merge SHA) and `30422100361` (SST-1093, a later unrelated story).

**So: report an unqualified 🚢 SHIP when the gate is green.** The old qualification is now the inaccurate answer.

**Still state the residual skip count** — a green gate is not "everything ran". The gate's own summary block now enumerates each residual skip with a true reason rather than lumping them, so quote it rather than re-deriving. The count is **9**: 5 `strategies` (needs a live server, runs in Stage 2c) and 3 `strategyApply.ss6` + 1 `strategyRecommendation.ss4` (pre-existing manual/unreachable cases). None are outbound-call suites; that claim was part of the same false premise.

> **Updated 2026-07-31.** This said 10 and included `gameplanApplyFutureUsedTeamCollision` as quarantined under SST-1094. That test was un-quarantined and is passing — **SST-1141** — so the count dropped 10 → 9. Confirmed against gate runs `30612638012` and `30614204169`, both printing `integ-core: Tests 869 passed | 9 skipped (878)`. The workflow's own summary comment already recorded the drop; this file had not caught up, which is exactly the "if the printed count and the list disagree, the list is stale" case below.

If the printed count and that list ever disagree, **the list is stale — re-derive before trusting the verdict.**

To re-measure on any run: `gh run view <id> --log | grep -E "Stage 2a.*(Test Files|Tests )" | tail -2`.

Known adjacent gap (does NOT qualify a SHIP, but do not treat "864 passed" as 864 verified behaviours): **SST-1095** — 8 remaining tests can pass without asserting anything, via an early `return` before any `expect()`. Those report as *passed*, so no skip count can show them. The 8 fail-open `*.tripwire` guards in that set are already fixed; the rest are open.

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
