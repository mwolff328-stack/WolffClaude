---
name: project_survivorpulse_fabricated_finality_tier_splits_the_paths
description: "A write path stamping an impossible spread_finality_tier makes SST-866's guard reject the canonical fields, silently diverting analytics onto importedHomeSpread while display reads homeSpread — the two surfaces then disagree with no error anywhere."
metadata: 
  node_type: memory
  type: project
  originSessionId: 6e26ffc5-7ff9-4576-bec5-f5d527caee3a
  modified: 2026-08-01T17:21:06.089Z
---

`spread_finality_tier` values `closing_at_kickoff` / `post_kickoff_adjusted` are
claims **about time** — the line was captured at or after kickoff. A game that
has not kicked off cannot carry them.

`storage.backfillCanonicalSpreads` hard-coded `closing_at_kickoff` for every row
it touched, with no reference to `gameTime` or `completed`. Run against an
un-started season it stamped **256 of 272** 2026 games with a claim ~70 days
before kickoff (`spread_used_at` 2026-07-14, kickoffs Sept–Jan). Fixed in
SST-1193 by `deriveCanonicalFinalityTier` (`server/services/odds/spreadCascade.ts`).

**Why that is not cosmetic — it forks the app onto two different data sources:**

1. SST-866's plausibility guard (7-day window) correctly rejects the impossible
   claim, so `resolveCanonicalFieldsLevel` returns null — for the WHOLE season.
2. `resolveEffectiveSpreadForAnalysis` then falls through override → locked →
   baseline → **`importedHomeSpread`** (a 4for4 CSV import).
3. Display never touches that cascade: `computeEffectiveSpread` (storage.ts)
   reads the latest snapshot then **`homeSpread`** (odds_api).
4. Where the two lines differ (14 of 272 games in 2026) the allocator scores
   teams off spreads the user never sees. Nothing logs, nothing throws.

Observed: `2026-02-LAR-NYG` canonical/live −9.5 (screen, 82%) vs imported −8.5
(79%) — and −8.5 is exactly LAC's line, so the allocator reported LAC/LAR as an
EXACT tie on genuinely identical inputs. `greedyPath`'s tie detection was
correct; it was fed a bad spread. See [[project_survivorpulse_greedypath_fixture_facts]].

**The divergence is INVISIBLE inside the modal row — do not look for it there.**
`optimizerService` (~:1075-1116) derives BOTH the displayed `spread` and
`winProbability` from the same `resolveEffectiveSpreadFromData` result, so a row
is always internally consistent (SEA −3.5 → 0.60, NO −3.0 → 0.58). Nothing on
screen contradicts anything else on screen. It only shows up when you compare
the ALLOCATOR's pick/tie/order against the display — which is why the ticket's
own prescribed RED fixture (two teams, different spreads, assert no tie) passes
under the broken implementation. A peer session nearly shipped triage guidance
saying "check whether the Spread column disagrees with Win%"; that check can
never fire.

**Debugging rule this gives you:** when the allocator and the screen disagree
about a number, do not start in the engine. Compare what each *resolver* returns
for the same row — there are three live resolvers and only two are canonical
(see CLAUDE.md "Canonical Spread Contract" and
[[feedback_a_doc_saying_code_was_deleted_is_not_evidence]]). The fastest live
probe: `GET /api/games/range?startWeek=N&endWeek=N&season=YYYY&scheduleType=regular&include=analysis`
returns the raw row with all four canonical fields plus `homeSpread` and
`importedHomeSpread`, so you can re-run both cascades by hand.

**Corollary worth remembering:** a guard that "correctly rejects bad data" can
still be the proximate cause of a user-visible bug, because rejection means
*fall through to something else* — and that something else may be a different
data source entirely. Ask what the fallback actually reads, not just whether the
rejection was right.
