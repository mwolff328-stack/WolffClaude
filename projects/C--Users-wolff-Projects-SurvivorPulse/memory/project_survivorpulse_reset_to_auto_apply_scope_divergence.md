---
name: project_survivorpulse_reset_to_auto_apply_scope_divergence
description: "Founder ruling (2026-08-03) — Game Plan's single-cell reset-to-auto stays grid-matched, not Apply-scoped, even though this can disagree with a scoped Apply write."
metadata: 
  node_type: memory
  type: project
  originSessionId: 3ba832b0-5af9-4c3b-b584-022fb7de810e
  modified: 2026-08-03T13:21:01.178Z
---

SST-1249 scoped Game Plan's bulk "Apply [Archetype] to my entries" duplicate-pick enforcement
to only the pools checked in the modal's "Apply to:" list, instead of the user's whole
portfolio. The single-cell reset-to-auto route (SST-877; `server/routes.ts`, search
`reset-to-auto`) and the Game Plan grid's `GET /api/me/strategy/cockpit` recommendation both
stay UNSCOPED by design — neither has a checkbox-selection concept to scope by. Consequence:
after a scoped Apply excludes a pool that would otherwise have claimed a team, reset-to-auto on
that same cell can restore a DIFFERENT team than the scoped Apply just wrote, because reset
always recomputes against the full, unscoped portfolio (identically to what the grid itself
would show).

**Ruling: KEEP the divergence as-is.** Reset-to-auto stays grid-matched, not Apply-matched — no
scope-awareness was added. Recorded directly in code: `computeCockpitArchetypes`'s
`applyEntryIdsScope` doc comment (`server/services/cockpitRecommendationService.ts:643`) and the
reset-to-auto route's own doc comment (`server/routes.ts`, just above the route registration),
commit `4230c666`.

**Why:** there is no durable record of what scope a past Apply used — it's a one-shot request
param, discarded right after the write — so making reset "remember" it would mean inventing new
persisted state for an edge case that requires a multi-pool portfolio, a deliberately-unchecked
pool, a real team collision between pools, AND the user manually reopening that one cell
afterward, all at once. A tempting shortcut — binding reset's scope to the page's PoolSwitcher
selection, since that's already-visible, already-stateful selection on the same page — was
considered and rejected: the founder already rejected exactly this coupling for Apply itself
during SST-889 AC-6 (`client/src/components/cockpit/ApplyBar.tsx`'s own header doc comment), on
the grounds that "which grids render" is not the same thing as a write scope. The same reasoning
carries over to reset-to-auto.

**How to apply:** if this resurfaces (a bug report about a cell's team "changing back" after
reset, or a future pool-distinctness feature), don't re-litigate from scratch — the tradeoffs
were already surveyed for the founder and a direction chosen. Revisit only if it demonstrably
confuses real users in practice, not preemptively. Related pattern: distinctness/scoping rules
tend to live at multiple call sites that can drift independently — see
[[project_survivorpulse_per_call_site_rules_recur]].
