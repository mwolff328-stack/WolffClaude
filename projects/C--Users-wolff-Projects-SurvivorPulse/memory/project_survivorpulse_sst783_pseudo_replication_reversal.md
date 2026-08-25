---
name: survivorpulse-sst783-pseudo-replication-reversal
description: "SST-783's pooled-CI method was pseudo-replicated; the mild-lean n=1 \"confirmed\" claim and part of the ps50 \"significant\" claim reversed on 2026-08-25 re-verification"
metadata: 
  node_type: memory
  type: project
  originSessionId: cf548c09-90e0-40a4-88b6-00a7c76990d7
  modified: 2026-08-25T14:58:00.748Z
---

SST-783 (`docs/research/backtesting/stan-powered-buyback-nonnaive-field.md`) computed its confidence intervals by pooling 7,500 Monte Carlo draws (1,500 draws × 5 real NFL seasons) into ONE variance calculation in `evByPs()` (`scripts/research/sst783PopConcentratedProbe.ts`), treating all 7,500 as independent samples. They aren't — only the 5 real seasons are independent evidence; the within-season draws are resampling noise around that season's own true mean. This is textbook pseudo-replication, and it silently narrowed every CI the function produced.

Independently re-verified twice (Stan found it, Vlad independently reproduced and confirmed both passes) by decomposing into 5 season-level means and using the correct clustered statistic (SD across seasons ÷ √5, t-distribution df=4, since k=5 clusters). Results:

- **Item 6, "mild lean beats chalk, confirmed for a single entry"** (+$16.1 ±15.5 originally, reported significant): **REVERSED.** Clustered 95% CI [−$7.40, +$39.64], crosses zero. Direction still positive in 4 of 5 modeled seasons, but one season (2022) does 3–5x the work of the others — not proven. n=10 was already known not significant and stays that way, now on firmer footing.
- **Item 8, "swinging hard away from the crowd is worse"** (ps50/heavy contrarian, previously "significant in 3 of 4" configurations): **PARTIALLY REVERSED.** n=1 uniform-model cell reverses (CI [−$60.29, +$9.71], crosses zero — small negatives with one large-outlier season). Both n=10 cells hold up fine (large, seasonally consistent effect, not close to zero). n=1 pop-concentrated was already known not significant. Corrected count: significant in 2 of 4, both n=10 only.

Both corrections are made in `docs/research/methodology/methodology-executive-summary.md` (section 3 and appendix items 6/8), dated 2026-08-25, with the reproducible verification scripts committed alongside (`scripts/research/sst783PerSeasonDecomposition.ts`, `sst783PerSeasonDecompositionPs50.ts`, `sst783CalibVerify.ts` — all pushed to `2026-v1`).

**Scope of the bug, per Vlad's check:** contained to SST-783's `evByPs()`. SST-782 makes no CI/significance claims at all (point estimates only). SST-779 already clusters correctly by season via `bootstrapCI()` on the per-season deltas array. Not a wider methodology collapse — just this one function's significance claims.

**Content-series fallout:** post 2 of the "backtesting series" (Discord/Reddit/X, posted 2026-08-21/22) already published the teaser calling the mild-lean claim "the one number-backed finding... confirmed for a single entry," and a later comment-reply also used the now-corrected "significantly worse everywhere" ps50 framing before it was first partially corrected on 2026-08-24 (3-of-4) and now fully corrected on 2026-08-25 (2-of-4). Founder ruling: **quiet non-repeat** — no separate correction post, just don't restate either overstated claim going forward. Post 3 was redrafted entirely around the correction itself (a self-correction narrative: "we teased a finding, checked it before publishing, it didn't hold up") rather than trying to salvage the original claim.

**How to apply:** before citing SST-783's mild-lean or contrarian significance claims in any future content or doc, check `methodology-executive-summary.md`'s current wording first — do not trust an older cached version of these numbers, including ones that may still be floating in other conversations or drafts from before 2026-08-25. If asked to verify any OTHER pooled-CI significance claim in this research arc that hasn't been explicitly re-checked yet, treat it as unverified rather than assuming it's fine, since this exact bug class already reversed 2 of 5 checked cells.
