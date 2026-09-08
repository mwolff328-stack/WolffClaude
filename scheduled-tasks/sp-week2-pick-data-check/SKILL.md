---
name: sp-week2-pick-data-check
description: One-time check (starting 2026-09-14, after week 1 ends) for whether Yahoo pick-distribution data has posted for week 2 on SurvivorPulse; verifies the SST-1581 revision 2 opening-value capture fix if so, re-arms itself if not.
---

SST-1581 revision 2 follow-up: SurvivorPulse's deployed dev app shipped a fix (commit 969fee2b on branch 2026-v1, repo mwolff328-stack/SurvivorPulse) so the Weekly Rankings "Notes" column's opening-value capture (captureMissingOpeningSnapshots, in server/services/publicWeekPicksService.ts) uses each game's TRUE opening win probability rather than whatever win probability happens to be live when capture fires. This was proven correct on week 1 (with a manual data correction for week 1 itself, since the bug had already shipped bad data before the fix landed), but week 2 is the first week the mechanism fix gets to run for real, once Yahoo pick-distribution data posts for that week. The check is gated on Yahoo data posting because that's the trigger for captureMissingOpeningSnapshots to fire for a week at all.

Do the following:

1. Fetch https://3faa879a-b955-4ac0-b132-e4ebbd482101-00-3f5q699y4opzy.worf.replit.dev/api/public/week-picks?week=2 (a public, unauthenticated JSON endpoint -- plain GET, no auth needed) and inspect the `strategies.safe_chalk` array for whether `nationalPickPercentage` is now populated (non-null) for any team. This is the signal that Yahoo pick-distribution data has posted for week 2 for the first time.

2. If still all null (or the fetch fails): this is a no-op/inconclusive tick.
   - Re-arm continued monitoring by calling create_scheduled_task with taskId "sp-week2-pick-data-check", cronExpression "17 9,21 * * *" (9:17am and 9:17pm local, twice daily), and this exact same prompt text verbatim (so the next fire repeats this same check on a recurring cadence going forward, since this initial task was one-time and auto-disables after firing).
   - Do not message the user in this case -- a no-op tick should stay silent.

3. If `nationalPickPercentage` HAS posted for at least one team: this is the important case. Re-fetch the same endpoint (in case of a race with in-flight capture) and:
   a. Confirm `openingFieldExposurePct` / `openingRankScores` / `openingRanks` are now populated (non-null) for the teams whose field data posted -- this means the capture mechanism fix fired for real, for the first time on a genuine future week.
   b. For a couple of teams, independently verify the captured `openingRankScores.mild_lean` was computed using the TRUE opening win probability (derived from `openingSpreadHome` via the standard NFL spread-to-win-probability formula the app uses elsewhere, `calculateWinProbability` in shared/survivorMath.ts), NOT the current live `winProbability`. Reproduce the math -- the mild_lean archetype formula is `0.8*winPct + 0.2*(100-fieldPct)` -- using both `openingSpreadHome` and the current spread, and confirm the stored `openingRankScores.mild_lean` value matches the OPENING-derived computation, not the current-derived one. This is the exact verification that caught the original week-1 bug, so redo it here to confirm the fix actually worked on a real week rather than assuming it did.
   c. Sanity-check that `openingRanks` values across the full week-2 slate form a clean permutation (no duplicates, no gaps) for at least one archetype, among the teams that got captured.
   d. Report the result to the user (Michael Wolff, mwolff328@gmail.com) via a clear message: whether the mechanism fix worked correctly on week 2 (with the concrete numbers proving it), or if something looks wrong (in which case describe exactly what was found and stop investigating further, flag it clearly as needing attention). This is the final report -- do NOT re-arm a new scheduled task after this, whether the verification passed or found a real problem. Monitoring is complete either way once week 2 is verified.

Keep the report concise and concrete: cite actual team IDs, actual numbers, and actual math, not just "looks correct."