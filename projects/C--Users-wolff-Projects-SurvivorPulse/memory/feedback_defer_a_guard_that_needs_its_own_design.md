---
name: feedback_defer_a_guard_that_needs_its_own_design
description: Founder ruling 2026-09-01 — a regression guard that needs its own design belongs in the story owning the defect class, not bolted onto the instance being fixed.
metadata:
  type: feedback
---

**Founder ruling, 2026-09-01 (SST-1509):** *"the guard should have been deferred to SST-1510."*

SST-1509 was a one-line CI-wiring fix, correct and complete at commit `08ef083b`. Building the
regression guard in the same ticket took it to **5 commits and 4 review rounds — three of which
found defects in the GUARD and none in the fix.**

**Why:** `survivorpulse-bug-triage/SKILL.md:130-131` says a bug is Done only when "a regression
test exists guarding it," which reads as a Done requirement rather than optional scope. That is
right for the common case — a straightforward test of the fixed behaviour — and wrong when the
guard needs its own *design*: a new mechanism, a new file, or a shape review will iterate on. Then
the guard becomes a second project riding inside a bug fix, and its review rounds are charged to
the wrong ticket.

**How to apply:** at bug-fix time, ask whether the guard is a *test* or a *build*. A test → write
it here. A build → file it, link it from the bug, and let Done rest on the fix being verified
against a control. Say so explicitly in the Done comment so the class does not look closed. If the
written standard still says otherwise, name the conflict rather than silently picking one —
[[feedback_an_ac_can_launder_an_ungroomed_commit_into_a_decision]] is the same failure in the
other direction.

Do not revert an already-landed guard to comply retroactively: that leaves the fix unguarded and
costs a gate cycle to prove a removal. Move its *ownership* to the class story instead.

Related: [[feedback_findings_inside_just_closed_classes_mean_wrong_instrument]] — the signal that
told us the deferred design (a shared manifest) was the right one.
