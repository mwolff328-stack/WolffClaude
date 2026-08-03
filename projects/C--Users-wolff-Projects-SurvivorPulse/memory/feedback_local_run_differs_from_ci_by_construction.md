---
name: feedback-local-run-differs-from-ci-by-construction
description: "Windows-dev vs Linux-CI divergence that makes code and tests green locally and broken in CI — POSIX-vs-Windows path handling, env vars CI sets that your shell does not, and a runner exiting 0 without executing anything."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f99d0a63-4af6-4f8c-b996-d3e14dec4463
  modified: 2026-08-02T07:04:38.552Z
---

SurvivorPulse is developed on Windows and gated on Linux GitHub runners. Several
defect classes are **green locally by construction** — the local run cannot
express the condition that breaks CI. All three below were caught before landing
on 2026-08-02 (SST-1214 follow-on), each by deliberately reproducing the CI
condition rather than by reasoning about it.

## 1. Hand-rolled path/URL handling is platform-conditional

`decodeURIComponent(url.replace(/^file:\/\/\/?/, ''))` looks like `fileURLToPath`
and is not. On Windows `file:///C:/…` → `C:\…`, absolute and correct. On POSIX
`file:///home/runner/…` → `home/runner/…` — the optional third slash in the regex
eats the **leading slash**, yielding a relative path. Anything resolving against
it silently misses, and here it would have thrown in every pool-creating spec on
every CI run while passing locally forever.

Use `fileURLToPath` from `url` (the call `e2e/fixtures.setup.ts` and
`e2e/fixtures.teardown.ts` already make). More generally: never hand-roll
path/URL/separator logic on this repo. `path.sep`, drive letters, and the leading
slash are exactly where the two platforms disagree.

**How to prove it without a Linux box:** run both implementations over a
hard-coded POSIX-shaped and Windows-shaped URL in plain node and print
`path.isAbsolute` for each. Then pin the derived value with a test that anchors on
a file which must exist inside it (`fs.existsSync(path.join(dir, 'known-file'))`),
so an off-by-one or a relative result fails wherever it runs.

## 2. CI sets environment variables your shell does not

`.github/workflows/pre-publish.yml` writes `TEST_RUN_ID` into `$GITHUB_ENV` in a
step that runs **before Stage 1 (unit tests)** — so the unit suite executes with a
valid ambient `TEST_RUN_ID`, which a local `npx vitest` run does not have.
`playwright-ci.yml` sets it at **workflow level**, so it reaches every job there.

Any test asserting a fallback chain that consults `process.env` therefore tests a
different branch in CI than it does locally. Clear the variable in `beforeEach`
(not `afterEach` — see [[feedback_proving_a_test_is_load_bearing]] §8b) and
restore the ambient value afterwards.

**How to apply:** before trusting a green local suite for anything env-dependent,
`grep -rn "<VAR>" .github/workflows/` and check the *scope* — workflow-level `env:`
reaches every job; a `$GITHUB_ENV` write reaches every later step in that job.
Then re-run locally with the variable set the way CI sets it.

## 3. A runner can exit 0 without executing a single test

`npx vitest run --reporter=basic` on vitest 4 fails at startup ("Failed to load
custom Reporter from basic" — the name was removed) and the process still exits
**0**. The harness reports the background task "completed (exit code 0)". Nothing
ran.

This compounds the known Windows trap that `npm run test:unit` exits 0 without
running (POSIX env-var syntax in the script). Two independent ways to get a
green-looking nothing.

**How to apply:** never accept an exit code as proof a suite ran. Grep the output
for the test-count summary line and treat its absence as failure:

```bash
SUM=$(grep -E "^ *Tests +[0-9]" run.log | tail -1)
[ -z "$SUM" ] && echo "did not execute, regardless of exit code"
```

Also: vitest's default reporter writes **nothing until the end** when stdout is
not a TTY, so a redirected run legitimately sits at a few hundred bytes for many
minutes. Byte-growth is not a liveness signal for it — do not conclude "stalled"
from a flat log; wait for process exit.

---

Related: [[feedback_proving_a_test_is_load_bearing]],
[[feedback_confirm_the_check_covers_what_you_changed]],
[[project_survivorpulse_playwright_ci_evidence_traps]]
