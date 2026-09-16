---
name: sp-week3-pick-data-check
description: Waits for Yahoo Week 3 pick data, then verifies Weekly Rankings opening scores, opening ranks, and pick % on dev and prod.
---

SurvivorPulse Week 3 pick-data check (repeat of the Week 2 check run on 2026-09-15). Read-only: do NOT change code, data, or Notion, and do NOT file tickets. The founder is Michael Wolff.

BACKGROUND
- Repo: C:\Users\wolff\Projects\SurvivorPulse (branch 2026-v1). The Weekly Rankings "Notes" column saves each team's OPENING values once, the first time Yahoo pick-distribution data exists for a week. The saving code is captureMissingOpeningSnapshots in server/services/publicWeekPicksService.ts. Saved values are write-once (never overwritten).
- Fix under test (SST-1581 rev 2, commit 969fee2b): opening scores must use the TRUE opening win probability, i.e. calculateWinProbability(openingSpreadHome, isHome) from shared/survivorMath.ts, not the current live winProbability.
- Week 2 result (2026-09-15): opening scores were correct for 28/28 teams, 0 matched the current line. BUT openingRanks was null for EVERY team. Cause: Yahoo's CSV leaves out teams with 0% of picks (WAS, TEN, ARI, MIA), so their nationalPickPercentage was null, and the capture code only saves ranks when every team in the 80_20_blend slate has a non-null winProbability AND nationalPickPercentage (the wholeSlateRankEligible check, around line 879). As of 2026-09-15 no fix for that had landed. Before judging, run `git -C C:/Users/wolff/Projects/SurvivorPulse fetch origin 2026-v1` then `git -C C:/Users/wolff/Projects/SurvivorPulse log origin/2026-v1 --oneline -40` and re-read that part of captureMissingOpeningSnapshots to see whether it has been changed since.
- Related fixes already landed: SST-1649, SST-1652, SST-1655 (pick popularity opening/current handling, and an admin path to correct stale opening snapshots).

SURFACES (check BOTH; both are public, unauthenticated, plain GET via curl):
- Dev: read DEV_BASE_URL from C:\Users\wolff\Projects\SurvivorPulse\.replit (was https://3faa879a-b955-4ac0-b132-e4ebbd482101-00-3f5q699y4opzy.worf.replit.dev)
- Prod: https://survivorpulse-beta.replit.app
Endpoint: <host>/api/public/week-picks?week=3 . Save responses to your scratchpad directory and analyse them with node. Use the strategies['80_20_blend'] array (safe_chalk has the same teams).

STEP 1 - Has Week 3 Yahoo data posted?
Posted means at least one team has a non-null nationalPickPercentage on EITHER surface.
If neither surface has any (or both fetches fail): this is a quiet no-op tick. Re-arm by calling create_scheduled_task with taskId "sp-week3-pick-data-check", cronExpression "17 9,21 * * *" (9:17am and 9:17pm local), and this exact same prompt text verbatim. Do not message the user. Stop.
If you are already running on that recurring cron and still nothing has posted, do nothing else (the cron already repeats). But if today's date is after 2026-09-26 and still nothing has posted, send a short report that Week 3 data never appeared, and disable further runs by calling update_scheduled_task for this taskId with enabled false.

STEP 2 - Data posted: verify (for each surface that has data; re-fetch once first in case capture was mid-flight)
a. Coverage: list teams with null nationalPickPercentage. For teams that do have it, confirm openingFieldExposurePct and openingRankScores are non-null.
b. Opening scores use the opening line: write a small .ts script in the scratchpad that imports calculateWinProbability from 'C:/Users/wolff/Projects/SurvivorPulse/shared/survivorMath' and computeWeeklyRankingsScore + WEEKLY_RANKINGS_ARCHETYPE_IDS from 'C:/Users/wolff/Projects/SurvivorPulse/shared/scoring/weeklyRankingsArchetypes' (use ABSOLUTE import paths; relative ones fail from the scratchpad), and run it with `npx tsx` from the repo directory. For every captured team compute mild_lean (0.8*winPct + 0.2*(100-fieldPct)) twice: using openingWinProb*100 and using current winProbability*100, with fieldPct = openingFieldExposurePct. Stored openingRankScores.mild_lean must match the OPENING computation (tolerance 0.006). Count matches, and count how many teams' lines moved (openingSpreadHome != currentSpreadHome), since only those prove anything. Also check safe_chalk, max_equity, heavy_contrarian the same way (skip future_value_lean, its future-value input can drift).
c. Opening ranks: are openingRanks non-null? If yes, check that for at least one archetype the captured teams' ranks form a clean permutation (no duplicates, no gaps). If null, say whether the Week 2 cause applies (some team has null nationalPickPercentage and the wholeSlateRankEligible check is unchanged) or whether it is something new.
d. Pick % sanity: confirm nationalPickPercentage values are plausible (0-100, sum over listed teams roughly 100) and, if the repo has data/2026/Yahoo_pick_distribution/yahoo_pick_distribution_week3.csv, that the endpoint values match it. Note any dev vs prod differences.

STEP 3 - Report (final; do NOT re-arm after this)
Send one concise report to the user as your final output: pass/fail for opening scores (with 2-3 concrete team examples showing stored vs opening-derived vs current-derived numbers), opening ranks status, pick % coverage, dev vs prod. If something is wrong, describe exactly what you found, flag it clearly as needing attention, and stop investigating. Use real team IDs and numbers, not "looks correct". Then disable this task with update_scheduled_task (enabled false) so monitoring ends.