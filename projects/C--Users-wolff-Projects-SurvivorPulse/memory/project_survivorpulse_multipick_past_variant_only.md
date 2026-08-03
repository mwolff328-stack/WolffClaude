---
name: project-survivorpulse-multipick-past-variant-only
description: "Game Plan playoff picks ALWAYS render through the 'past' cell variant, and the picker's slot count collapses to 1 without a forward plan."
metadata: 
  node_type: memory
  type: project
  originSessionId: 4b29870c-a605-4bea-8ac2-889dfc4768e1
  modified: 2026-08-01T22:53:05.511Z
---

Two non-obvious facts about multi-pick playoff rounds in the Game Plan grid (established while grooming SST-1000, 2026-07-23):

**1. Playoff picks only ever render through the `past` display variant.** `currentWeek` is derived from a regular-season-only (weeks 1–18) window, so playoff weeks 19–22 can never resolve as `odds` or `projected` — `basis` is undefined for them. A committed playoff pick always takes the `past` branch (`week >= PLAYOFF_START && persistedTeamIds.length > 0`), in a live season **and** a concluded one.

⚠️ **This narrows the PLAYOFF case only — do not over-extend it.** Multi-pick is **not** playoff-only: `PickRequirements` (`shared/schema.ts:1405`) supports `overrides.regular` (e.g. `{"week:12": 2}`) and a global `default` (1–10) applying to every period in both contexts, and Pool Settings exposes it (`pool-form.tsx` `advancedRegularOverrides`; help text names Thanksgiving). A regular-season multi-pick week renders through the **`odds`** variant, which drops picks the same way (`seasonGridCell.ts:164` takes `persistedTeamIds[0]`). Both `past` and `odds` carry the defect. I got this wrong once by inferring "regular season is always 1 pick" from product reasoning instead of reading the schema.

**2. RESOLVED (verified 2026-08-01) — was: the pick editor's slot count was inferred from the archetype plan, not the pool.** Game Plan used to derive `requiredPickCount` as `Math.max(1, allPickTeams(planPick).length)`, which collapsed to 1 for any concluded-season playoff cell (no forward plan) even though `TeamPickerModal` fully supports multi-select. Now shipped: `SeasonGridSection.tsx:634` calls `requiredPickCountForWeek(pool.pickRequirements, week)`, sourced from the pool's real `pickRequirements` via the canonical `getPicksForPeriod` helper — the exact fix this file originally prescribed.

**3. Prior-season REGULAR weeks do take the `past` branch** (verified live 2026-07-23, Goldflam Suicide 2025). Despite `isPast = week < currentWeek` comparing against the live season's week, prior-season regular cells resolve persisted picks correctly. Do not assume otherwise from reading that comparison alone.

**Diagnostic tell for which branch a cell took:** the `past` variant renders the literal `"No pick"` (`SeasonGridSection.tsx:1290`); the `no-pick` variant renders `"No pick yet"` + `"Tap to choose"`. Reading the empty-cell copy in a screenshot tells you the branch without instrumenting anything.

**Why:** both facts make multi-pick work look bigger than it is (fact 1) or smaller than it is (fact 2). Re-deriving either costs a full read of `seasonGridCell.ts`, `SeasonGridSection.tsx`, `WeekViewSection.tsx`, and `PickGrid.tsx`.

**How to apply:** when touching multi-pick rendering, widen `past` **and** `odds`; leave `projected`/`no-pick` alone (they carry no team field by design — Curie rule / SST-950). Multi-pick *editing* (fact 2) was fixed by plumbing `pickRequirements` into the cockpit DTO and calling the canonical helper `getPicksForPeriod(pickRequirements, scheduleContext, weekOrRound)` (`shared/schema.ts:1635`, also used by `PickGrid.tsx:2126`) rather than a new derivation — the pattern to copy for any future slot-count logic. Note `allPickTeams` is the plan-*suggestion* path (blank-until-committed per SST-950), never the persisted-pick path.

Related: [[project_survivorpulse_schema_drift_takes_down_dev_app]]
