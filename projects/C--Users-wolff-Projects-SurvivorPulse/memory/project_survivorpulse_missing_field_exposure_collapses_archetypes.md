---
name: project-survivorpulse-missing-field-exposure-collapses-archetypes
description: "With no field-exposure data the pick score's (100 − Field%) term is constant, so all three archetypes rank identically AND every team on the same spread ties exactly — the root cause of both unallocated cells and indistinguishable strategies."
metadata: 
  node_type: memory
  type: project
  originSessionId: 934ead4d-d534-45a5-b163-a22e49249c1a
  modified: 2026-07-30T13:23:29.950Z
---

The cockpit pick score is `wp×Win% + ps×(1−pickShare) + fv×futureValue`
(`pickScoring.ts`), and the three archetypes set `fv = 0`, differing ONLY in the
wp/ps split (90/10, 80/20, 70/30). Win% is a pure function of the spread. So when
real field-exposure (pick popularity) data is absent, two things follow
mathematically, and both showed up as separate-looking bugs in 2026-07-29:

1. **Exact ties are systemic, not rare.** The `ForwardAdapter` fallback for
   missing popularity is a softmax *of winProb* — itself spread-derived. Two teams
   on the same spread therefore score EXACTLY equal, `greedyPath` emits
   `{kind:'tied'}`, and Apply used to map that to `skipped-ambiguous` → no pick
   written. 16 of 80 cells in the founder's run. Entry 1 takes the unique best
   team; later entries walk forward and land on tied pairs, so gaps cluster in
   entries 2..N. ⚠️ **A spread-derived proxy for field exposure cannot fix this** —
   it is mathematically incapable of breaking spread-derived ties. Only genuinely
   independent popularity data (Yahoo ingest / CSV import) or a tie-resolution
   policy will. SST-1119 chose the latter: deterministic resolution at the apply
   layer + a `written-tie-resolved` outcome that marks the coin-flip.
2. **The archetypes become indistinguishable.** Treating unknown Field% as 0
   (SST-1121, founder ruling) makes `(100 − Field%)` a constant, which is the only
   term separating Safe Chalk / 80-20 / Max Equity — so all three produce pure
   win-probability order while the UI still displays three different formulas.
   That is why the fix ships with an on-screen caveat and
   `archetypeRanksAreIndistinguishable()`, and why a test pins the claim.

Note the DISPLAY path and the ALLOCATION path degrade differently:
`optimizerService` leaves `estPoolPickPct` undefined (→ "—" in the UI) while
`ForwardAdapter` substitutes the softmax — the Engine Coherence split tracked in
SST-882. Same missing data, two different behaviours.

Related: [[project_survivorpulse_entry_recommendations_payload]]
