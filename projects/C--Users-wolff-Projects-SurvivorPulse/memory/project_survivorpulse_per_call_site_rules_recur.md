---
name: project_survivorpulse_per_call_site_rules_recur
description: "SurvivorPulse's used-team and ranking rules are applied at each call site, so 'fixed' means 'fixed in the branch you read' — one defect has produced nine tickets"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4f1a6b03-d33e-4e23-b4ad-7dea9506e0fe
  modified: 2026-08-01T02:29:46.020Z
---

Two rules in this codebase are re-implemented at every call site instead of enforced at one
chokepoint, and both have produced a long tail of "same bug, different branch" tickets.

**The directional used-team rule** ("earlier weeks block later weeks, never the reverse"):
SST-1159 shipped it correctly — and missed `regular_playoffs` pools (SST-1178, an early
`return` that accepted `beforeWeek` and never read it) and playoff rounds (SST-1181, two more
paths). `getWeeklyRecommendations`, the non-entry sibling, still does raw
`available = !teamsUsed.includes(team.id)`.

**The displayed ranking**: SST-1176 made it entry-independent, which exposed the availability
path, which exposed the pool-dynamics `qPick` renormalization (SST-1188). Separately the grid
and the modal each carry their own comparator, and they disagree on ties (SST-1183) because
only one has a tie-break.

**Why:** the defect is not "a branch is missing a clause" — it is that the safe behaviour is
the one you must remember to opt into. A new call site gets the wrong semantics by omission.

**How to apply:**
- Fixing one instance, grep for the whole class first. `grep -n "poolScheduleType === 'regular_playoffs'"`
  returned 5 hits in one file; the first was an unrelated `return 22`.
- Each channel is invisible while a larger one dominates: ~45-point defect masked a ~5-point
  one masked a ~0.3-point one. Assert the property on the FINAL displayed value and let it
  fail — a test scoped to the input you changed ships looking complete.
- Invert the default when fixing: name the exception (`getTeamsUsedSeasonWideForPlanner()`),
  so directional is what you get unless you ask otherwise.
- The season-wide view is genuinely required for the PLANNER (SST-1141) — never "unify" the
  two views. See the warning block in `shared/priorWeekPicks.ts`.

Related: [[feedback_sweep_for_the_class_not_the_change]],
[[project_survivorpulse_apply_write_order_collision]].
