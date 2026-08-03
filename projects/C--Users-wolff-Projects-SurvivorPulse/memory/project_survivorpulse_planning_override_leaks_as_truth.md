---
name: project-survivorpulse-planning-override-leaks-as-truth
description: "A planning-time override must not ride the same DTO field the client reads as truth — overriding cockpit currentWeek to 1 silently re-classified every concluded week from past to live odds, and no test could catch it."
metadata: 
  node_type: memory
  type: project
  originSessionId: 934ead4d-d534-45a5-b163-a22e49249c1a
  modified: 2026-07-29T22:55:07.111Z
---

`GET /api/me/strategy/cockpit`'s `week` field serves two masters: where the engine
starts planning, and where the season actually is. SST-1112 (2026-07-29) overrode
`currentWeek` to 1 so a concluded season would plan all 18 weeks instead of
collapsing to `[18,18]` (`determineCurrentWeek` returns the LAST week when every
game is complete). That override reached the client, which derives cell
classification from it — every 2025 week flipped from `past` to live `odds`,
dropping the `past` branch's all-persisted-picks rendering (multi-pick pools
showed only the first pick), the "No pick was made this week" state, and Week
View's default focus week (18 → 1).

**Fix:** `ForwardAdapter` computes `naturalCurrentWeek` BEFORE applying
`currentWeekOverride` and returns both; `cockpitRecommendationService` reports the
natural week on the DTO and uses the override only internally (engine input,
`resolveUsedTeamsAsOfWeek`, `buildDistinctEntryPlans`). Also fixed the
`CockpitDataIncompleteError` diagnostic, which was leaking the same override into
a client-visible string.

**Why:** no test could have caught this. Every SeasonGridSection/WeekViewSection
test passes `currentWeek` explicitly (fixtures use 3), so the past-season +
`currentWeek=1` combination is never rendered. It surfaced from a code review
reading the classification chain, and was confirmed by a live DOM measurement:
cell kinds read `odds: 18` before the fix, `past: 18, odds: 1` after.

**How to apply:** when you add an override to widen an engine's window, ask which
consumers read that field as *state* rather than as *configuration*. Return the
un-overridden value alongside and report that outwardly. Verify by measuring
`data-cell-kind` distribution on a real past-season grid in the browser — jsdom
fixtures pin `currentWeek` and are structurally blind to this class of bug.

Related: [[project_survivorpulse_past_season_apply_cascades]]
