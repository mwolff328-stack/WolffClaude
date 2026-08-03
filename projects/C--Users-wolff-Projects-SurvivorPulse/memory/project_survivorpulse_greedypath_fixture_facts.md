---
name: project_survivorpulse_greedypath_fixture_facts
description: "Why strategy-engine tie fixtures silently fail to produce a tie, and why most allocator ties are legitimate rather than bugs."
metadata: 
  node_type: memory
  type: project
  originSessionId: edd6897b-aa09-4075-be87-3d101c9fd280
  modified: 2026-08-01T22:52:34.818Z
---

Two facts that cost real time when writing or reading strategy-engine tests.

**1. `TeamWeekData` / `GreedyTeamRow` carry NO `score` field.** The score is COMPUTED inside `buildGreedyPath` (`shared/strategyEngine/greedyPath.ts`, ~:500-521) by `scoreTeamForStrategy(winProb, pickShareFraction, futureValueNorm, config, context)`, where `context` derives from `isHome`, `isDivisionalMatchup(teamId, opponentId)` and a scarcity check. Hand-setting `score:` on a fixture row and casting `as any` compiles, is silently ignored, and produces no tie — the test then fails on its own precondition rather than on the defect.

To build an EXACT tie (`greedyPath` emits `{kind:'tied'}` only on `c.score === chosen.score`), two rows must agree on **every scoring input**. Set `opponentId: null` to pin the divisional flag false, and avoid real NFL abbreviations for tied pairs — BAL/CIN are both AFC North, so they separate under any config with `avoidDivisional` on. Also give the tied pair the TOP scores: a strictly-better third team means the walk takes that one and never reaches the tie.

`buildGreedyPath`'s signature is positional: `(entry, weekData, config, startWeek, endWeek, totalWeeks, claimedByOtherEntries, entryPosition?, opts?)`. Set `coordinatedDiversification: false` in test configs unless staggering is the subject — otherwise entry N starts scanning at `targetRank = N*(1+diversificationSkip)` and moves off the tie for an unrelated reason.

**A test that calls `buildGreedyPath` directly and hand-builds the claim map does NOT exercise the claim site.** Claims are built in `buildDistinctEntryPlans` (`cockpitEntryPlans.ts`); a fix there is invisible to a `buildGreedyPath`-level test, which will pass with the fix reverted. Go through `buildDistinctEntryPlans` when the claim map is the subject. See [[feedback_proving_a_test_is_load_bearing]].

**2. Most allocator ties are LEGITIMATE — the root cause (spread→winProb is a lookup table, so distinct spreads routinely collapse to identical probabilities) is the fuller subject of [[project_survivorpulse_missing_field_exposure_collapses_archetypes]].** Practical fixture consequence: verified live 2026-08-01 on one entry's plan, week 5 DAL/HOU (both −3.5 → 0.60) and week 7 DET/PIT (both −2.5 → 0.5633) are legitimate ties; week 3 SEA (−3.5 → 0.60) tied with NO (−3.0 → 0.58) is NOT, and that asymmetry was the actual defect (SST-1193). **The discriminating fixture is two teams whose inputs DIFFER** — a fixture with identical spreads passes under both the broken and the fixed implementation (that's SST-1119's case, not SST-1193's).

**How to check this without writing anything:** authenticated `fetch` from the founder's Chrome session — `GET /api/me/strategy/cockpit?season=<y>&week=1` returns `archetypes[].entryPlans[].pickPath.chosenTeams` including tie resolutions, and `GET /api/optimizer/entry-recommendations?entryId=…&week=…&season=…&scheduleType=regular` returns each team's `spread`/`winProbability`/`estPoolPickPct`. Reading the plan this way is far cheaper and safer than re-running Apply, and mutates nothing.
