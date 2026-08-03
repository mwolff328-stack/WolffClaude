---
name: feedback_confirm_the_check_covers_what_you_changed
description: "A green check over an empty set is the same failure class as a green suite that ran nothing — verify the check's scope includes your files before citing it"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4c4dca3a-8902-4439-96af-1142489b8245
  modified: 2026-08-01T20:51:50.641Z
---

Before citing any check as evidence, confirm its **scope includes what you changed**.

On SST-1117 I reported "typecheck clean" four times. It was true and meaningless:
`tsconfig.json` includes only `client/src`, `shared`, `server` — **nothing under `e2e/` or
`scripts/` had ever been typechecked**, and vitest transpiles without typechecking. When I
finally built a config that covered them, it immediately caught a missing import I had just
introduced. `npm run check:e2e` + `tsconfig.e2e.json` now exist.

**Why:** this is the *same* defect class as the bug being fixed — a suite reporting success
while covering nothing. A tool that passes over an empty set is indistinguishable from a tool
that passes over your work, and both print exit 0.

⚠️ **"No test file in this repo is ever typechecked" is FALSE** — this file asserted it until
2026-08-01. Two independent gates decide each file, and both must be read:

- `include` is exactly `client/src`, `shared`, `server` — so everything under `tests/`, `e2e/`,
  `scripts/` is out regardless of extension.
- `exclude` is `**/*.test.ts` — which does **not** match `.test.tsx`.

Net, measured 2026-08-01 via `tsc --noEmit --listFilesOnly`: **149 `.test.tsx` files under
`client/src` ARE typechecked**; 0 `.test.ts` are; 0 files under `tests/` are. Proven live rather
than inferred from the file list — an unused `@ts-expect-error` appended to
`client/src/hooks/__tests__/useCanonicalUrl.test.tsx` raises `TS2578` against a 0-error baseline.
Being listed by `--listFilesOnly` and being error-checked are two different claims; that proof
checks the second. So `@ts-expect-error` and type-level assertions are a **working but currently
unused** guard surface in the client component tests (SST-981), and inert only under `tests/`.

The earlier "confirmed 2026-07-31, `tsc` exited 0 having never looked at them" observation was
right for the four files in question — they were `.test.ts` under `tests/`. The generalization
drawn from it was not. That is the trap: a correct local measurement, over-generalized to a rule
whose two gates were never separated. Execute an edited test (even one that self-skips) to prove
it at least parses and imports.

**How to apply:**
- Read the `include`/`exclude` globs (tsconfig, vitest config, lint config) before quoting a
  green result on new files, especially files in a directory the project doesn't normally build.
- `npx vitest run <file>` silently runs NOTHING for a `*.integration.test.ts` file under the
  default config — integration specs need `--config vitest.integration.core.config.ts`. A run
  reporting "1 skipped (1)" when you passed three files means two were never collected.
- Prove collection positively: for a new test file, check it appears in the default run, don't
  infer it from "the suite passed" — vitest's default reporter only names FAILING files.
- The same trap applies to `--reporter=` on a Playwright CLI run: it *replaces* config
  reporters, so any guard registered in `playwright.config.ts` is silently bypassed.
- An **invalid** `--reporter` name aborts vitest *before collection*: `--reporter=basic` does
  not exist in Vitest 4 and dies with `Failed to load url basic`, having run zero tests
  (2026-07-31, SST-1176). Worse, wrapping it as `npx vitest … > log 2>&1; echo "EXIT=$?"` makes
  the *shell* exit 0, so the background-task notification said **"completed (exit code 0)"** for
  a run that executed nothing. Never take the harness's exit code as the suite's verdict — read
  the log for a `Test Files N passed` line, and treat its absence as failure, not as silence.
- Always print a **non-zero executed count** alongside any green claim. "8528 passed" is
  evidence; "exit 0" is not.
- **`executed` is not `passed`.** Playwright's `executedCountGuard` prints
  `[e2e-coverage] executed=N` — N counts tests that RAN, pass or fail. I read `executed=1`
  from an auth-setup run as success and told the founder the credentials worked; the test had
  failed. With the html reporter no pass/fail line reaches stdout, so the count was the only
  visible number. The tell I ignored: the artifact it should have written (`e2e/.auth/user.json`)
  was still my 28-byte placeholder. **Check the artifact the step exists to produce, not its
  telemetry.**

Related: [[project_survivorpulse_e2e_fixture_provisioning]],
[[feedback_proving_a_test_is_load_bearing]].
