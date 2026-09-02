---
name: project_survivorpulse_ship_coverage_caveat_241_is_obsolete
description: "The \"~241 integration tests self-skip under TEST_DISABLE_NETWORK\" SHIP qualification is obsolete — SST-1088 fixed it; the real residual is 9, of which 5 execute in Stage 2c."
metadata: 
  node_type: memory
  type: project
  originSessionId: 88a5d466-d14f-4d17-9ff0-30dfd4f60857
  modified: 2026-09-02T04:24:59.094Z
---

Do NOT qualify a SurvivorPulse SHIP verdict with "~241 integration tests self-skip under
`TEST_DISABLE_NETWORK`". That claim is stale and **understates** the gate's coverage.
`~/.claude/skills/pre-deploy/SKILL.md:170` says so explicitly, and the pre-publish workflow's own
Summary step carries the same correction inline.

What is true now: SST-1088 re-gated those 24 suites on real DB availability
(`tests/guards/dbIntegrationGate.ts`) rather than on `TEST_DISABLE_NETWORK`, which they had been
using as a proxy for "no database here" — true on a laptop, false in CI, where the gate disables
outbound internet *and* provisions a Postgres. Since SST-1088, `TEST_DISABLE_NETWORK=1` means only
"no outbound internet" and does not decide which suites run.

The residual Stage 2a skip count is **9**, enumerated by the gate itself:
- 5 `tests/strategies` — needs a live server, so it runs in **Stage 2c**, not skipped overall
- 3 `tests/strategyApply.ss6` — pre-existing manual/unreachable cases
- 1 `tests/strategyRecommendation.ss4` — manual live-UI smoke

So only **4** tests genuinely execute nowhere, all manual/unreachable by design. Confirmed on gate
run 33587649762 @ `3a4fc19a` (2026-09-02): Stage 2a `991 passed | 9 skipped`, and
`tests/strategies.integration.test.ts (5 tests)` visibly green in Stage 2c.

The gate's Summary block ends with "if this list and the printed count ever disagree, the list is
stale — re-derive it before trusting the verdict." Quote the gate, don't re-derive by hand.

The residual caveat that IS still live is a different one: **SST-1095** — some tests can pass
without asserting anything via an early `return` before any `expect()`, so they report as *passed*
and no skip count can reveal them. The 8 fail-open `*.tripwire` guards in that set are fixed; the
rest are open.

This stale caveat is actively circulating — it was repeated verbatim in a 2026-09-02 SHIP
aggregator's own spawning prompt. Related: [[project_survivorpulse_prepublish_gate_mechanism]],
[[project_survivorpulse_queued_gate_is_not_a_verified_commit]],
[[feedback_a_doc_saying_code_was_deleted_is_not_evidence]].
