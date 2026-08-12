---
name: project_survivorpulse_gameplan_scope_divergence
description: Game Plan orange stale-Proposed dot was Apply and the cockpit read computing entry plans under different pool scopes; fixed structurally by deleting both scope params (SST-1332)
metadata: 
  node_type: memory
  type: project
  originSessionId: 1822a37a-6806-42d1-a467-6dd43d564c56
  modified: 2026-08-12T05:43:43.103Z
---

The Game Plan orange "stale Proposed" dot fired on nearly every week of a multi-pool
2026 portfolio. Cause: the two halves of the comparison used **different pool scopes**.

- `POST /api/me/gameplan/apply` WROTE `proposed_picks` from a portfolio-wide,
  cross-pool-aware plan (forwarded `entryIds` as `applyEntryIdsScope`, SST-1249 —
  with several pools checked that spans them all).
- `GET /api/me/strategy/cockpit` READ back a pool-isolated plan
  (`isolateEntryPlansByPool: true`, SST-1313).

`isProposedBadgeStale` then compared a team chosen *under* cross-pool distinctness
against one chosen *without* it.

**The decisive engine fact** (`shared/strategyEngine/cockpitEntryPlans.ts`, four-way
tier table ~line 751): the cross-pool claim map is consulted **iff
`spreadAcrossPools === true`**. A pool-isolated call gives each per-pool invocation an
empty cross-pool map, so isolation *structurally disables* cross-pool distinctness — a
setting the user had switched on. Corollary: when `spreadAcrossPools === false` the two
planners are **byte-identical** (map built, never read; the value-descending pool sort
is also gated on the flag). So isolation was a no-op in one config and actively wrong in
the other.

SST-1313's own test file already documented the divergence without naming it: combined
gives pool-B `BUF`, isolated gives pool-B `KC`.

**Why it could not be fixed by matching two flag values.** SST-1313's goal was "match
what a pool-scoped Apply would write" — true only when Apply covers exactly ONE pool.
Apply is routinely run over several checked pools and is cross-pool aware there. The grid
cannot know which pools the last Apply covered, so any scope it picks is a guess and one
case is always wrong. Fix (SST-1332) **removed both scope parameters** from
`computeCockpitArchetypes`; entryPlans now depend only on (userId, season, preferences).

Related facts worth keeping:
- `entryIds` is a **write filter only** — `gameplanApplyService.ts:274`
  `if (filterSet && !filterSet.has(plan.entryId)) continue;`. Independent of the plan.
- Playoffs-only pools are excluded from the regular-season cockpit portfolio
  (`cockpitRecommendationService.ts:535`, `poolSupportsSchedule(..., 'regular')`).
- **A REC ranked far down the list is usually not a bug.** SST-1073 allocates
  highest-*value* pool first, so a $50k pool's entries take the top teams and a $10k
  pool's entry gets what's left. The Ranked list shows those claimed teams as plainly
  selectable, which is what makes it look broken — that transparency gap is its own
  ticket. Changing allocation contradicts SST-1073 (powered MC, flagged in-code as
  needing a ticket + evidence).

See [[feedback_survivorpulse_verification_query_traps]] for how this was almost
mis-diagnosed.
