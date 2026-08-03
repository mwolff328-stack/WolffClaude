---
name: feedback_a_value_in_output_is_not_a_constant
description: "Three wrong assertions in one session, all the same shape — reading a number or a name from output and reasoning about it instead of reading the code that produces it."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c5af6e0a-2dbe-4f57-bcbd-437e2e737b83
  modified: 2026-08-01T17:47:48.486Z
---

In one SurvivorPulse session (2026-08-01) I asserted three things confidently and was wrong three
times, in the same way each time. A concurrent session caught all three.

1. **"The 2026 games resolve via the canonical spread field."** They resolve via the *imported*
   line — SST-866's plausibility guard rejects the canonical tier for all of them. I had read
   `spread_used_for_analysis_home` being populated and inferred it was therefore used.
2. **"This fix will flip my TC-5 assertion."** It could not: their change was write-path only
   (`deriveCanonicalFinalityTier`, called solely by the backfill) while TC-5 exercises the read
   path against a hard-coded fixture. I reasoned from the ticket's subject, not the diff.
3. **"The executed-count floor is 33, re-baseline it."** `resolveFloor` returns
   `Math.max(1, Math.ceil(collected * MIN_EXECUTED_RATIO))` — derived and self-calibrating. The
   `floor=33` in the output was `330 × 0.1`. I read a printed number as a configured constant.

**The shape:** a value in output, a field being non-null, or a function's *name* is evidence that
something exists — never evidence of how it is used, whether it is used, or where it came from.
Each time, the check was one grep or one `sed -n` away and would have taken seconds.

**How to apply.** Before asserting that a value is used / a constant is fixed / a change affects a
given path, read the producing code:
- printed number → find the function that computes it (is it derived?)
- populated column → find the reader (does anything consume it, and does a guard reject it?)
- "this change touches X" → read the diff for X, not the commit subject

Cheapest tell that you are about to make this mistake: you are about to warn *someone else* about a
consequence you have not executed. Two of the three above were advice to other sessions, which is
how they got caught — they checked. Verify before broadcasting, because a confident wrong warning
propagates faster than a quiet right one.

**Fourth instance, a different session, within the hour of reading this file — and it inverts the
direction, so the pattern is broader than "output value".** Asked whether E2E teardown should reap
the 148 e2e-named production user accounts, I answered that they came from `tests/helpers.ts`
(`testuser_${TEST_RUN_ID}`) and were "already reaped by username prefix in scoped mode", citing
`scripts/cleanup-test-pools.ts:180,185`. The auditing session re-queried production: **zero**
accounts match `testuser_` or `testadmin_` anywhere. The real creators are
`tests/eliminationEndpointsHttp.e2e.test.ts:64` (`http_e2e_user_${Date.now()}`),
`tests/backfillCanonicalSpreads.e2e.test.ts:121,129`, and
`tests/email-service.integration.test.ts:46,50` — none reapable in either mode.

The inference ran *backwards*: I read the CONSUMER's match patterns and concluded which PRODUCER
must have made the rows, without grepping the producers or checking what actually exists. So the
rule generalises: **a cleanup/validator/matcher's pattern tells you what it would catch, never what
is actually out there.** Same correction either way — read the producing code, and check the real
data before asserting coverage. The consequence here was a wrong priority signal on a
founder-gated destructive ticket (SST-1215), which is worse than a wrong number.

**Fifth instance, same session, ~30 minutes later — and this one was answerable from my own
notes.** Asked whether a users assertion could be added to the pre-publish gate's Stage 4c
verifier, I argued it might "red the gate on pre-existing residue" and proposed inventory → clean
→ assert. Wrong premise: `pre-publish.yml:31-44` declares a **`postgres:16` service container**
(`POSTGRES_DB=ci_test`, DATABASE_URL at `localhost:5432/ci_test`), created fresh per job. There is
no history to inventory. The real mechanism is worse and more useful — Stage 3
(`vitest.projects.config.ts` project `e2e`, include `tests/**/*.e2e.test.ts`) mints
`http_e2e_user_*` / `backfill_e2e_*`, Stage 4b reaps only `testuser_`/`testadmin_`, so the
assertion would go red on **every** run on *same-run* residue.

The aggravating detail: [[project_survivorpulse_prepublish_gate_mechanism]] already documents what
each gate stage runs. **I had written the answer down and asserted without reading it.** So add a
step before broadcasting: *check whether you already have a memory on this subsystem.* Recall is
not automatic; a memory you don't consult is worth nothing, and infrastructure claims are exactly
the class most likely to be already-documented and least likely to be re-derived correctly from
intuition.

Related: [[project_survivorpulse_playwright_teardown_coverage]] — the same session correctly
*measured* a teardown gap rather than reasoning about it, so the discipline is achievable; it
lapsed both times on claims made in passing, about work owned by someone else.

Sibling failure in prose rather than in values:
[[feedback_a_doc_saying_code_was_deleted_is_not_evidence]]. Sibling at the AC level:
[[feedback_an_ac_can_launder_an_ungroomed_commit_into_a_decision]].
