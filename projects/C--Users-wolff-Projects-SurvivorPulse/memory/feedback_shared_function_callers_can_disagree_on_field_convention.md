---
name: feedback-shared-function-callers-can-disagree-on-field-convention
description: "A caller-agnostic shared function can have multiple callers supplying the same-named field under different, incompatible conventions -- fixing the obvious caller isn't enough"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d3bb8df3-bc49-40dc-9daa-df4ff230d7ab
  modified: 2026-09-12T23:21:47.101Z
---

When a shared, caller-agnostic function (e.g. `scoreTeamForStrategy` in `shared/strategyEngine/pickScoring.ts`) takes a parameter whose correct value depends on caller-side preprocessing (here: `futureValueNorm` must already be inverted from the raw signal before it arrives), do not assume every caller follows the same convention just because they pass the same-named field.

**Why:** SST-1644 (2026-09-12) needed to invert the direction of a "future value" scoring term. The obvious fix was to flip the shared function's own arithmetic. A pre-build engineering-gate review caught that two of the function's three callers (`assignIndependentPicks.ts`, `backtesterSweepService.ts`) already pre-inverted the value correctly on their own side -- flipping the shared function would have double-inverted those two and silently broken the Back Tester, the exact defect class the fix existed to prevent. The real bug was narrower: only the third caller (`ForwardAdapter.ts`) skipped the inversion.

Later in the same ticket, a DIFFERENT shared function (`computeRankScoreForWeights` in `archetypeRankScore.ts`) turned out to have the OPPOSITE convention from `scoreTeamForStrategy` for a field with the same name (`futureValueNorm`) -- one expects the raw signal and inverts internally, the other expects an already-inverted value and does not invert. A downstream pipeline (Season Grid) fed one function's output into the other's input without reconciling the conventions, producing a double-inversion bug that shipped past the first full review round and was only caught by an independent code-reviewer's re-derivation of the math.

**How to apply:** Before changing a shared scoring/transform function's arithmetic, trace EVERY real caller individually and write down what convention each one uses for the parameter in question. Never assume a shared parameter name implies a shared contract. When two systems that use the "same" field are wired together (one produces it, another consumes it), explicitly check whether their conventions for that field agree -- this is exactly the kind of place a single un-reconciled inversion hides.

See also [[feedback_guard_the_wire_not_just_the_helper]] -- the sibling lesson from the same ticket, about proving fixes at the real call site.
