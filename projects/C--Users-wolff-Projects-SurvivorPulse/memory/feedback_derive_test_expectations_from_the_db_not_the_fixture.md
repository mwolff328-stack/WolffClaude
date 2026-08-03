---
name: feedback-derive-test-expectations-from-the-db-not-the-fixture
description: "For SurvivorPulse integration tests that cannot run locally, derive every expectation from the database and state the requirement — a hard-coded number tuned to your own fixture passes nowhere but your head, and CI is its first execution."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 934ead4d-d534-45a5-b163-a22e49249c1a
  modified: 2026-07-29T23:17:57.458Z
---

Gate run 30497639231 failed on a test I had just "tightened." The sequence is the
lesson:

1. First version asserted `expect(res.body.week).not.toBe(1)` — correctly RED
   against the bug, but a reviewer rightly flagged it as too loose (it also passes
   for `undefined`).
2. I replaced it with `expect(res.body.week).toBe(SEEDED_WEEKS)` — a hard number
   derived from my own 4 synthetic seeded weeks.
3. CI's database carries a full 2025 season, so the correct answer was 18. The
   product was right; my assertion was fixture-dependent. `expected 18 to be 4`.

Tightening a loose assertion into a **fixture-dependent** one is not tightening —
it trades a false pass for a false fail. The fix is to derive the expectation from
the same source of truth the code uses (`MAX(week)` for that season) and to phrase
the claim as the requirement: "the minimum written week is EARLIER than the natural
current week" is impossible to satisfy before the fix and independent of how many
games any particular database happens to hold.

**Compounding factor:** these suites cannot run locally at all (`dbHostGuard`
blocks non-disposable hosts), so the CI gate is their FIRST execution. There is no
local feedback loop to catch a fixture assumption. When you write a test you cannot
run, assume nothing about the environment's data and derive everything.

**How to apply:** before hard-coding any number in an integration assertion, ask
"is this number a property of the requirement, or of my fixture?" If the latter,
query it. And when a gate fails on your own test, say so plainly and retract any
Done transition — the failure is real process signal, not noise to route around.

Related: [[project_survivorpulse_past_season_apply_cascades]]
