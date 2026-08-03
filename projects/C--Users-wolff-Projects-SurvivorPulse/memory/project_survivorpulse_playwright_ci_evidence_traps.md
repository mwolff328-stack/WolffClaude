---
name: project_survivorpulse_playwright_ci_evidence_traps
description: "Five ways a Playwright/CI run lies about what it proved — narrowed runs aren't controls, retain-on-failure records everything, a test can pass for years on an animation race, current_database() can't tell the three Neon DBs apart, and the pre-publish gate cannot run Playwright specs at all."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0bc8ce6a-82e1-49d4-bda8-86318368d7ee
  modified: 2026-08-02T07:04:08.137Z
---

Learned 2026-07-31 chasing one `sf4-my-pools` failure through six CI runs. Each trap cost a wrong conclusion that was published before it was corrected.

**1. A narrowed run is not a control, and "success" hides how little ran.** `gh run list` showed a green `2026-v1` run 25 minutes before a red one; it had been dispatched with `test_spec`, executed **6 tests per shard** versus 50, and never ran the failing test. Always read `[e2e-coverage] executed=N skipped=N did-not-run=N collected=N` from each shard before treating any run as a baseline. Two runs are comparable only when their per-shard executed counts are comparable. This nearly produced a false "your commits broke it" and, separately, another session listed such a run in a SHIP report as broad evidence.

**Corollary: contention failures cannot reproduce in a narrowed run at all.** The informative axis for "passes alone, fails in company" is **narrowed vs full**, not tip vs control-branch. Running the code axis first wastes a round trip.

**2. `trace: 'retain-on-failure'` RECORDS every test — only the discard is conditional.** Triage adopted it over `on-first-retry` believing it cost "near-zero because it captures the failing attempt instead of tracing every passing run." That is true of retention and false of recording. On a 2-core runner with `PLAYWRIGHT_WORKERS=2` the overhead across ~330 tests destabilised a contention-sensitive spec — green without it, red twice with it, invisible in narrowed runs. Scope it per-file with `test.use({ trace: 'retain-on-failure' })` on the spec being investigated. See [[feedback_proving_a_test_is_load_bearing]].

**3. A test can pass its entire life on a CSS exit-animation race.** `UC-4.7-A` asserted "Discard reverts it" against an input that only still existed because Radix keeps `DialogContent` mounted for `duration-200` (`client/src/components/ui/dialog.tsx:47`). `my-pools-detail.tsx` closes the settings modal **unconditionally** on that button — it is one control whose *label* alone switches on `isDirty`. So the assertion resolved inside a ~200ms window on an idle machine and lost it under load. It had never verified its own name. When a test's outcome tracks machine load, suspect it is racing an unmount, not that the product is flaky — and never "fix" it by awaiting the animation, which re-cements the accident.

**4. `current_database()` cannot distinguish the three Neon databases — all are named `neondb`.** A post-connect name assertion returns the same string for the E2E CI DB, shared dev (helium), and production, so it reads as a safety guard while discriminating nothing. `scripts/ci-reset-e2e-db.mjs` runs `DROP SCHEMA public CASCADE`; its real boundary is a positive URL-host allowlist. A post-connect check needs a genuinely distinguishing fact — `inet_server_addr()` or a marker row. See the wrong-host trap in CLAUDE.md.

**5. The pre-publish gate CANNOT run Playwright specs.** Stage 3 runs `vitest.projects.config.ts --project e2e`, whose include is `tests/**/*.e2e.test.ts` — a different directory AND extension from `e2e/*.spec.ts`, so there is no glob overlap at all. A green gate says nothing about the browser suite.

**Where the evidence actually lives.** Download the shard artifact and unzip the `data/*.zip` traces: `0-trace.network` gives request URLs+statuses (this is what exonerated a 30-route auth sweep — the pool GET was 200, not 401), and `0-trace.trace` gives the timestamped action list that showed the failure was at the *end* of the test, not at page load. The `data/*.md` files are Playwright's page snapshot at failure.

Related: [[project_survivorpulse_e2e_ci_drift_traps]], [[project_survivorpulse_prepublish_gate_mechanism]].
