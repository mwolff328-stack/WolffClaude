---
name: project_survivorpulse_beta_scope_and_rhythm
description: "SurvivorPulse beta scope cut, weekly operating rhythm tasks, and self-executing story standard set up in the efficiency/focus session"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9ffba12d-1463-491f-9d20-31afdbff75d9
  modified: 2026-07-21T21:17:47.607Z
---

3-part founder efficiency/focus session for the SurvivorPulse beta (ran ~2026-07-21; artifacts labeled "beta scope review 2026-06-28" per the founder's chosen clock — real ops date was later, and beta was already live in prod since 2026-07-14).

**Part 1 — Beta scope cut (Pam-led).** Open pre-launch backlog of 127 stories triaged to: **23 [BETA]** (P0/P1), **34 [CUT] duplicates → Cancelled** (auto-numbered "(X.Y): Feature" twins of raw stories — a recurring dedup issue in the DB), ~84 **[POST-BETA]**. Calls written as `[BETA]`/`[POST-BETA]`/`[CUT]` tags in the **Notes** property (founder chose new tags over reusing the existing `Phase` field). P0 stack order: 934→299→327→34→(941/877/897/940 pick-correctness)→(755/566)→(883/660)→(913/914/931 Game Plan IA)→790→522. Honest assessment: P0 (~17) is a realistic 4-week target; the two scary items #327 (2026 data) and #34 (auth) are both actually **size S** — real risks are external (Postmark provisioning, Odds API funding), not eng.

**Part 2 — Operating rhythm.** Two scheduled Claude Code tasks (in ~/.claude/scheduled-tasks/): `sp-daily-brief` (Luigi, cron `0 6 * * 1-5` = weekdays 8am CT) and `sp-friday-sprint-review` (Pam+Luigi, `0 13 * * 5` = Fri 3pm CT). Both read the real **Assigned To Agent** multi-select (Luigi/Pam/Ann/Deb/Felix/Vlad/Stan/Rita/Sky/Hank/Arlo), fall back to Category→persona inference (`~`-prefixed) when unassigned. Documented in a "Weekly Operating Rhythm" section appended to the Notion Operating Model page. NOTE: scheduled tasks only run while the Claude Code app is open. See [[reference_survivorpulse_operating_model]].

**Part 3 — Self-executing story standard.** Ann fills Description+AC, Vlad fills Test Cases, both into DB **property fields** (not page body); TC trace to AC and label `[verification]`/`[regression guard]` where a fix already shipped (no characterization). Key findings during grooming: **#755 fix already shipped** (3-tier `resolvePoolFieldSize` + EV≤prize clamp in shared/pools/fieldSize.ts) → verify-not-build; **#897 likely moot** (pick-confirmation concept fully removed via SST-940) → needs one dev smoke to close; **#790 deferred** (founder 2026-07-13: no founding members have joined pools yet, nothing to verify) → drop from upfront P0, make just-in-time; **#785 is ~60 files** touching the composite → needs a Deb surface audit + Constitution ruling; **#877** has AC only in page body, no property-field AC (needs Ann backfill). See [[feedback_survivorpulse_smoke_over_mocks]] and [[project_survivorpulse_grooming_workflow]].
