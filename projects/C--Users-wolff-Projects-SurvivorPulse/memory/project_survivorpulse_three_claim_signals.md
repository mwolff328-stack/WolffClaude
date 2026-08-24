---
name: project_survivorpulse_three_claim_signals
description: "Three near-identical 'claimed team' fields exist on CockpitEntryPlan and answer different questions -- wiring a surface to the wrong one caused a bug that survived seven tickets"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8d35d19f-aeb7-4ae6-b7f5-aee4d4a4c715
  modified: 2026-08-24T22:26:01.057Z
---

`CockpitEntryPlan` (shared/strategyEngine/cockpitEntryPlans.ts) carries **three**
similar-looking fields about teams other entries hold. They are NOT
interchangeable, and picking the wrong one is a defect that reads as correct in
review because every individual field is right about what it says.

| Field | Answers | Scope |
|---|---|---|
| `crossPoolWithheld` (SST-1341) | "did a cross-pool claim CONSTRAIN this pick?" | cross-pool only, **walk-time only**, contributing-entries only |
| `crossPoolOverlap` (SST-1402) | "did someone else land on the team I adopted?" | post-hoc, cross-pool, only teams THIS entry adopted |
| `claimedByOtherEntry` (SST-1330, 2026-08-24) | "who already has each of these teams?" | post-hoc, **pool-order independent**, **same-pool included**, `isSamePool` flag |

**Only `claimedByOtherEntry` is correct for a UI that annotates a LIST of
candidate teams** (the pick modal's ranked list / CLAIMED badge). The other two
are narrower by design and will silently under-report.

**The trap that made this survive so long.** `crossPoolWithheld` is a *walk-time*
snapshot, so for the pool the allocator walks FIRST it is necessarily EMPTY —
and SST-1073 walks pools by **value descending**, so the user's highest-value
pool is exactly the one that shows nothing. Live symptom (founder, 2026-08-24):
Goldflam Suicide 2025 ($100k) displayed zero CLAIMED badges and no banner, while
CMEA ($1k, walked second) displayed them correctly. Same-pool siblings were
missing everywhere, because that field excludes them by definition.

**The generalisable lesson.** SST-1329, 1331, 1341, 1385, 1405, 1407 and 1414 all
refined `crossPoolWithheld`, each correctly, while the badge above it stayed
wrong. When a bug recurs and every prior fix was individually justified, the
defect is in the MAPPING between the question the UI visibly asks and the field
it reads — not in either end. Stop refining the source; check whether it answers
the right question.

**Gating (founder ruling 2026-08-24):** the badge is constraint-based, not
informational — "only show CLAIMED badge due to enforcing no duplicates across
or within pools when applying a strategy." So cross-pool rows gate on
`spreadAcrossPools` and same-pool rows independently on `withinPoolDistinct`.
These are separate axes; conflating them reproduces the original defect class.

**Testing note that matters more than the fields.** Every pre-existing claim test
hand-wrote `crossPoolWithheld` into a fixture, so all of them stayed green
through a live production defect — a test that SUPPLIES the field under test can
never catch that field arriving empty. The wire test that closes this is
`client/src/components/__tests__/TeamPickerModal.claimedByOtherEntry.sst1330.test.tsx`:
it runs the real `buildDistinctEntryPlans` into the real `TeamPickerModal` with
nothing stubbed between. See [[feedback_guard_the_wire_not_just_the_helper]].

⚠️ Grepping a **production** bundle for a function name (e.g.
`isProposedCellEditable`) returns 0 because identifiers are minified; string
literals survive. Use a copy string to prove a build contains a change. Also:
the dev Replit preview runs an **unbundled Vite server** serving source, so
comments are present there and stripped in prod — a phrase found in dev and
absent in prod is not a discrepancy. See
[[project_survivorpulse_dev_preview_runs_vite_dev_server]].
