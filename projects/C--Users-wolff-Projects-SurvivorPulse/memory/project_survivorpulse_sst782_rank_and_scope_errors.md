---
name: survivorpulse-sst782-rank-and-scope-errors
description: "SST-782's \"chalk ranks #5-#18 everywhere\" claim was never checked against all 36 setups and is wrong in 2 of them; its wipeout table is a single-entry/no-buyback cell presented without that scope. Corrected 2026-08-25, quiet non-repeat on posts 1/2."
metadata: 
  node_type: memory
  type: project
  originSessionId: cf548c09-90e0-40a4-88b6-00a7c76990d7
  modified: 2026-08-26T03:30:10.343Z
---

While independently re-verifying SST-782's Future Value comparison (see [[project_survivorpulse_sst783_pseudo_replication_reversal]]), an adversarial stability pass surfaced two unrelated, previously-uncaught errors in SST-782 itself (`docs/research/backtesting/stan-winning-wipeout-metrics.md`), both already live in published content (post 1 and post 2 of the "backtesting series," Discord/Reddit/X).

**Post 1's rank claim was actually wrong, not just overstated.** "Chalk won 0 of 36 pool setups by EV. It ranks between #5 and #18 everywhere." The "0 of 36 wins" half holds. The "#5-#18 everywhere" half traced back to an unsaved console print — `scripts/research/sst782WinningWipeout.ts`'s rank loop (lines ~300-313) prints to stdout only, never writes a file, so the claim was never durably re-checkable. A full recheck against the canonical `scripts/research/sst782-winning-wipeout-results.json` (all 36 setups: field {20,250,1000} × prize {WTA,top-3} × buyback {off,on} × n {1,5,10}) found chalk outside the band in 2 of 36: **#2** at field 1000/WTA/buyback-on/n=1 (already sitting uncaught in SST-782's own section 3 illustrative table — two sections of the same doc contradicted each other and nobody reconciled it), and **#20** at field 250/top-3/buyback-on/n=5 (never checked before; the illustrative table never covered top-3 prizes at all).

**Post 2's wipeout numbers are real but unscoped.** The 56.7% exposure / 1.000 elimAlign figures for chalk are the single-entry, no-buyback cell only. At n=5-10 or with buyback on, chalk's exposure roughly halves (0.21-0.33) and elimAlign drops to 0.42-0.60 — still worst of the four strategies tested in every configuration, just far less extreme than the single headline cell implies when presented as chalk's general behavior.

Both corrected in the source docs 2026-08-25 (`stan-winning-wipeout-metrics.md` section 2, `methodology-executive-summary.md` section on SST-782 and claims-boundary item 4), with the reproducible recheck script committed (`scripts/research/stanRankAndQuantileStability.ts` / `stan-rank-quantile-stability-results.json`).

**Founder ruling: quiet non-repeat**, same as the earlier SST-783 reversal — no correction post for posts 1/2, just don't restate either claim in its old uncorrected form going forward. If a future post needs to reference chalk's EV rank or wipeout exposure, use the corrected framing from the doc, not the original published wording.

**How to apply:** this is now the *second* time in one day this content series shipped a claim that either (a) traced to a real math error (SST-783's pseudo-replication) or (b) traced to an unsaved/unreconciled computation nobody could re-check (this one). Before citing ANY SST-782/783 number in future content, verify it against the CURRENT state of the doc, not a cached memory of what it said, and prefer a number with a committed, reproducible script behind it over one that's only ever been printed to console or asserted in prose. See also [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]] and [[feedback_verify_a_reviewers_evidence_not_their_judgement]] for the same underlying discipline (verify the artifact, not the description of it).
