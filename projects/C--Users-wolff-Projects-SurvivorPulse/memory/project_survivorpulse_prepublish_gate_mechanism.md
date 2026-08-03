---
name: project_survivorpulse_prepublish_gate_mechanism
description: "How to actually run the SurvivorPulse pre-publish/ship gate — it's CI-only, not local — plus what each stage really runs, which config a test lands in, the publish-time secret deletion, and that NO stage anywhere typechecks anything."
metadata: 
  node_type: memory
  type: project
  originSessionId: edc8aee2-d97b-4425-8d87-2b881a2c2894
  modified: 2026-08-02T18:11:18.659Z
---

The `/pre-deploy` skill tells you to run `npm run test:prepublish` locally, but that **cannot run on the Windows dev box**: the npm scripts use POSIX inline env syntax (`NODE_ENV=test ... vitest`) which npm executes via cmd.exe → `'NODE_ENV' is not recognized`, and the DB-dependent stages (integration/e2e/regression) need a live DB with network — which the SST-1006 `dbHostGuard` correctly refuses against `ep-flat-rice` (the shared dev DB), and which you must never pollute unattended anyway.

**The authoritative gate is a manual GitHub Actions workflow.** Run it against the branch and read the result:
```
gh workflow run pre-publish.yml --ref 2026-v1
gh run list --workflow=pre-publish.yml --limit 1 --json databaseId --jq '.[0].databaseId'
gh run watch <id> --exit-status        # blocks until done; but the run is ~15 min, > the 10-min bash timeout, so run it with run_in_background
gh run view <id> --log-failed          # extract the failing test file/name
```
**The gate DB is EPHEMERAL, and that matters when reasoning about adding an assertion to it (SST-1215, 2026-08-01).** `pre-publish.yml:31-33` declares a `postgres:16` **service container**; `:59-61` point `DATABASE_URL`/`POSTGRES_URL`/`TEST_DATABASE_URL` at `localhost:5432/ci_test`. Created **fresh per job** — it is NOT a persistent Neon DB, so it can never hold historical residue and there is nothing in it to inventory or pre-clean. A peer session blocked a useful guard change on the belief that it might; the belief was wrong. But the *conclusion* (don't bolt a new assertion onto Stage 4c) was still right for a different reason: **Stage 3 (`test:e2e:project`, vitest over `**/*.e2e.test.ts`) creates rows that Stage 4b cannot reap**, so a new assertion in 4c fires on SAME-RUN residue, on every run. Concretely: `eliminationEndpointsHttp.e2e.test.ts` and `backfillCanonicalSpreads.e2e.test.ts` mint `http_e2e_user_*` / `backfill_e2e_*`, `cleanup-test-pools.ts` (Stage 4b) matches only `testuser_`/`testadmin_`, and `verify-no-test-pools.ts` (Stage 4c) checks pools only. **Upside: any test-data-leak defect is therefore reproducible in CI against a disposable container — build and RED→GREEN-prove that class of fix there, never against production.**

It runs on Linux against a `ci_test` Postgres (the `on:` includes `workflow_dispatch` — the comment says explicitly it exists because "the Windows dev box OOMs on the local suite"). Stages: DB setup → Unit (8 sharded) → Integration core → Integration slow (full mode) → HTTP integration (auth) → E2E → Regression. It stops on first failure, so you see one failure per run.

**Which stage a test lands in is decided by its FILENAME, and the gate's printed totals are PER-STAGE.** This caused two independent misattributions in one afternoon (2026-07-30, SST-1126 and SST-1095), so treat it as a trap, not a detail:
- `vitest.integration.core.config.ts` (Stage 2a, "integ-core") includes **only** `tests/**/*.integration.test.ts(x)`. The `.integration.` infix is what routes it. A file under `tests/` **without** that infix (e.g. `tests/e2eFixtureSeason.test.ts`) is a Stage 1 **unit** test.
- `vitest.config.ts` (Stage 1, jsdom) is where all `client/**/*.test.tsx` live.
- The gate Summary prints `integ-core: Tests N passed | M skipped` and `integ-slow: …` **only** — built from `/tmp/integ-core.log`. It prints **no Stage 1 total**. So a unit-test change moves a number the summary never shows.
- The documented **864 passed | 10 skipped** baseline is **Stage 2a**, not the whole suite (the workflow comment says so: "Measured on run 30414636162 (Stage 2a…)").

Consequence: never map a test-count delta onto that 864/10 line without first checking whether your changed files are even in that config. To attribute a movement, count `it()`/`test()` declarations per file across the true baseline SHA (the commit that wrote the number into the workflow comment, not a run id) — and check for `it.each`/`describe.each` first, since with `.each` present the static declaration count ≠ the runtime test count and a sum that "matches" can be coincidence.

Locally you CAN still run: the unit/component config directly via bash (`NODE_ENV=test ... npx vitest run <file> --config vitest.config.ts --no-file-parallelism`, which is `dbHostGuard`-exempt per SST-1006's scoping), and pure `readFileSync` source-scan e2e tests with `SKIP_DB_GUARD=1` (safe — they touch no DB).

**SHIP also requires the skill's Manual Pre-Publish Gate:** a green suite ≠ SHIP — pending PROD DB backfills/migrations and deployment-secret cleanup must be applied first, founder-run at publish time. What's actually pending right now lives in [[project_survivorpulse_publish_prerequisites]] (the continuously-updated authoritative checklist); this file's own backfill examples are resolved and would go stale if repeated here.

**Publish-time step (founder ruling 2026-07-24):** after the gate passes and BEFORE clicking Publish in Replit, the founder must **delete the `ALLOW_UNSAFE_DEV_FEATURES` secret from the Replit DEPLOYMENT** (Replit → Deployments → Secrets — the deployment's own env, NOT the workspace Secrets pane and NOT the `.replit` `[userenv.development]` line). `server/envValidation.ts` FATAL-exits the prod process on boot if `ALLOW_UNSAFE_DEV_FEATURES=true`, so leaving the deployment secret set makes the publish come up broken. Do NOT edit the `.replit` `[userenv.development]` copy — that one is dev-only (deploy runs `npm run start`/NODE_ENV=production and never reads it) and it powers the deployed dev app's auto-login. The deployment secret and the `.replit` line are two different things: leave the file line, delete the deployment secret. This is documented in the `/pre-deploy` skill's "After the Gate Passes" section. It's a manual Replit-console action — Claude can't perform it, only remind.

Playwright CI (`playwright-ci.yml`) is a SEPARATE workflow (PR-triggered) and was failing ~1 min at setup on `drizzle-kit push --force` needing a TTY (SST-1011) — do not confuse a red Playwright CI with the pre-publish gate.

## What each stage actually runs

Verified against gate run 30594602550 (2026-07-30) by reading `gh run view --log`. Merged here 2026-07-30 from the former `gate-stage-shapes` and `unit-suite-oom` memories.

- **Stage 1 is the FULL unit suite, sharded** (`npx vitest run --config vitest.config.ts --shard=N/8`, inline in `pre-publish.yml`, `NODE_OPTIONS=--max-old-space-size=3072`, `maxWorkers: 2`). A single shard's log shows ~78 files / ~1113 tests, which looks like a narrow subset and is **not** — multiply by the shard count (≈623 files, matching a local `npx vitest run`). Don't conclude "the gate only runs a subset" from one shard's totals. Check the actual `--shard=N/M` line before quoting a count; it has been retuned repeatedly. The Summary step prints per-stage lines for `integ-core` / `integ-slow` but **no Stage 1 line**; Stage 1's own step does print its shard total.
- **Why sharding at all** (diagnosed 2026-07-17, and now written up at length in the workflow's own comment block — read that for the current numbers): the CI-only OOM comes from the ~197 env-gated DB-backed tests unlocked by `RUN_DB_REGRESSION_TESTS` / `RUN_SIGNUP_EDGE_CASES`, pushing the total to ~7100. Peak heap is proportional to **tests-in-one-process** (end-of-run result aggregation), so a `--max-old-space-size` bump is a no-op and vitest fork-recycling does not help — worker forks do not accumulate (39–132 MB/file, no upward trend). Only fewer tests per process fixes it. `npm run test:unit` is unchanged for local dev. (The old `scripts/run-unit-sharded.sh` / `test:unit:ci` wrapper no longer exists — the shard loop is inline in the workflow.)
- **`RUN_DB_REGRESSION_TESTS: "1"` is set in `pre-publish.yml` and nowhere else.** Suites gated on it (`optimizerEndpointsRequireScheduleType`) are `describe.skip` locally and execute **only** on the gate — so a local green run says nothing about them, and a behaviour change that alters their status codes fails first on CI.
- **integ-core baseline moved 864 → 867 → 869.** Derive the delta from your own commits; never quote the baseline as fixed.
- **The Stage 2a "residual skips" inventory is hand-written prose in the workflow** (the Summary step's `echo` lines plus the comment block above them). It does not read the suite — it asserts a list and a count a human must keep in sync. It kept printing "gameplanApplyFutureUsedTeamCollision — QUARANTINED" after SST-1141 un-skipped it. **If you change what skips, edit that block.**
- `client/src/backtester/__tests__/verification.test.ts` fails locally because it needs the `SurvivorPulse-BackTesting-Prototype` sibling repo (CI checks it out via `CROSS_REPO_PAT`) — environmental, not a real failure.
- **No stage anywhere runs `tsc` or `npm run check` (verified 2026-08-02 by reading `pre-publish.yml`, `release-guardian.yml`, and `playwright-ci.yml` directly — none of the three).** Stage 4a runs `check-module-boundaries.ts`, an import-boundary linter, not a typechecker. Every other stage is vitest (transpile-only) or a live-server HTTP check. Consequence: a type error in `server/`, `client/src/`, or `shared/` — the categories `tsconfig.json` actually covers — reaches production as long as no test's *runtime* behavior happens to exercise it. `npm run check` (which does run `tsc`) exists and is correct, but nothing automated ever calls it; it is exactly as CI-blind as `check:e2e` was before 2026-08-02 (see below), just never named as such until three sessions independently flagged it the same day. Ticket staged, not yet filed: `pending-notion-tickets/2026-08-02-ci-gate-never-typechecks.md`.
- **`npm run check:e2e` (the only typecheck covering `e2e/`, added under SST-1117) was itself unwired until 2026-08-02** — defined in `package.json` but called nowhere, so `npm run check` was green regardless of `e2e/` content. Fixed commit `f4df8d86` on `2026-v1`: `check` now runs `tsc && npm run check:e2e`. This makes `e2e/` consistent with `client/src`+`shared`+`server` (all four are now typechecked *locally*, none automatically in CI — see the point above). **`tests/**` is still typechecked by NO config at all, locally or in CI** — measured 2026-08-02 via a throwaway probe tsconfig: 112 pre-existing errors across 14 files, including two confirmed-dead-code `TS2304` bugs in `tests/helpers.ts` (`teardownTestContext` calls two names that are only re-exported, never imported — zero call sites found repo-wide, so latent rather than live). Ticket staged, not yet filed: `pending-notion-tickets/2026-08-02-tests-dir-zero-typecheck-coverage.md`.

To confirm a specific test actually RAN rather than self-skipped:

```bash
gh run view <id> --log > /tmp/gate.log
grep -E "yourTestFile" /tmp/gate.log | sed 's/\x1b\[[0-9;]*m//g'
```

A `✓ tests/foo.test.ts (N tests)` line is proof of execution; absence proves nothing on its own, because the file may have landed in another shard's log.

Related: [[project_survivorpulse_publish_prerequisites]], [[feedback_confirm_the_check_covers_what_you_changed]]
