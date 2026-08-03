---
name: project-survivorpulse-playwright-teardown-coverage
description: "A Playwright teardown project runs on a FAILING spec but NOT on a globalTimeout abort — and is structurally WRONG for a sharded run over one shared DB, whatever it covers."
metadata: 
  node_type: memory
  type: project
  originSessionId: 4451b199-981e-48da-bb74-ced6875c1470
  modified: 2026-08-01T20:41:36.632Z
---

A Playwright `teardown:` project does **not** cover every abnormal exit, and the gap is
exactly the case people assume it handles. Measured 2026-08-01 (SST-1214, Playwright
1.62) with a minimal harness — setup writes a marker file, a spec fails, teardown
deletes it:

| case | teardown | marker |
|---|---|---|
| spec fails mid-run | **RUNS** | deleted |
| teardown not wired (control) | skipped | **survived** |
| `--global-timeout` abort | **DOES NOT RUN** | **survived** |
| SIGKILL | cannot run | survived |

On the abort, Playwright prints `Timed out waiting Ns for the teardown for test suite
to run` — it *tries*, but the abort budget is already spent, so teardown gets none of
it. `playwright.config.ts` sets `globalTimeout: 60 * 60_000` in CI as a hang backstop,
so **a hung shard still leaks whatever it created.**

**Why this matters here:** SST-1213 (`c934083d` + `3b2c3503`) deleted the past-season
pool-type gate, so `POST /api/pools` now succeeds and `e2e/fixtures.setup.ts`
provisions through the real API into whatever DB the suite is aimed at. Before that,
provisioning simply failed against the deployed dev app, and that failure was the only
thing keeping helium clean. See [[project_survivorpulse_e2e_fixture_provisioning]].

**How to apply:** never claim "teardown runs on failure" without saying *which* failure.
Design cleanup so the durable identifier lives in the database, not only in an
in-process manifest — SST-1214 tags every fixture pool `[e2e-run:<id>]` in its
description precisely so an orphan from an aborted or killed run stays findable
afterwards. To sweep: look for pools whose description contains `[e2e-run:`.

Also: the control run matters. Unwired, the teardown project ran *before* the setup
(as an ordinary parallel project), printing "nothing to delete" — a green-looking log
line that proves nothing. Related: [[feedback_proving_a_test_is_load_bearing]].

## The bigger problem: a `teardown:` project cannot be right for a SHARDED run

Coverage is the second-order question. The first-order one, found reworking SST-1214 on
2026-08-01: **`playwright-ci.yml`'s six shards are six independent GitHub Actions jobs on
six separate runners sharing ONE Neon database** (`E2E_CI_DATABASE_URL`), and they share
ONE fixture pool — the first shard to arrive creates it, the other five find it by
(name, season, owner) and reuse it. A per-process teardown therefore means **the first
shard to FINISH deletes the pool while the other five are still running specs against
it.**

Nothing inside a Playwright process can fix that. A shard cannot observe whether a
sibling GitHub job is alive, and `e2e/.auth/fixture-manifest.json` is on its own
runner's private disk. Only the workflow knows, via `needs:` on the matrix job.

Two things made this invisible for a while, and they are the interesting part:

- The race had **never fired**, because a second bug masked it — `scripts/seed-e2e.ts`
  pre-created the pool *untagged*, so every shard classified it as "reused" and deleted
  nothing. Run `30714117967` deleted 0 pools on all 6 shards and reported green. Fixing
  the tagging bug **alone would have ARMED the race.**
- The obvious fix for the six-random-run-ids problem — one shared `TEST_RUN_ID` — makes
  it strictly **worse**: all six shards become provable owners and the first to finish
  still wins.

**How to apply:** cleanup for a sharded suite belongs in a post-matrix CI job
(`needs: [setup, e2e]` + `if: always()`), never in a `teardown:` project. Keep the
project for the single-process local case (`BASE_URL=<deployed-dev> npx playwright test`),
which has no CI job behind it — but make it stand down when it is not the whole logical
run. `testInfo.config.shard` is `null | {total, current}` and is the structural signal;
an explicit env flag covers `shards=1`, which passes no `--shard` at all. Fail toward
leaking, never toward deleting: a leaked row still carries its tag and stays sweepable,
whereas a wrong delete breaks five shards mid-run irrecoverably.

Landed as `2a74c831..792edf59`. Verified end to end on run `30717200904`: shard 3 logged
`NOT deleting — E2E_FIXTURE_CLEANUP=deferred`, and the post-matrix job logged
`7 pool(s) visible, 2 tagged for this run` then deleted exactly those two — confirmed
absent by a `SELECT` against Neon project `damp-sunset-84903170`, not by the log.

A full `playwright-ci.yml` dispatch takes **~6-8 minutes**, not the hour its 60-min
globalTimeout suggests — cheap enough to use as real proof rather than reasoning about.

One harness trap worth remembering: the first version used `__dirname`, which is
undefined in ESM, so setup AND teardown both errored, the marker was never created,
and the check reported "marker GONE" — a false pass that read exactly like success.
Use `fileURLToPath(import.meta.url)`, and always assert the setup actually created the
thing before trusting its absence.
