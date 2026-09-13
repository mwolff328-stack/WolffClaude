---
name: feedback-disabled-gated-on-a-narrow-window-stays-enabled-outside-it
description: "A button's `disabled` prop gated on a transient in-flight flag can leave it wrongly enabled for the rest of its render branch's lifetime, if that branch never has anything for the button to do outside the narrow window the flag covers."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c9ab76e2-3a95-49c9-bce6-b72b1b340791
  modified: 2026-09-13T02:37:23.483Z
---

SST-1606's review cycle (13 rounds) found the same anti-pattern twice, in the same file, across different rounds: a button's `disabled` prop was progressively loosened from a hardcoded `true` to a flag meant to cover one narrow window (e.g. "still fanning out to other pools after the primary save succeeded"), but the render branch the button lives in has the control visible for far longer than that window — and has no `onClick` at all outside it. Once the flag goes false, the button looks fully live and does nothing when clicked.

**Why:** each round's author was solving the visible problem in front of them ("this button looks idle while work is still happening") and correctly widened the disabled condition to cover that specific window. Nobody asked the complementary question: "what is this control's correct state for the REST of its lifetime, once the window ends?" For a status-display button with no handler, the answer is "always disabled" — not "disabled only during the narrow window," which is what every incremental fix kept producing.

**How to apply:** when reviewing (or writing) a `disabled={someTransientFlag}` on a button, check whether that button has an `onClick` in every branch it can render in. If a render branch has no handler at all (a pure status display), its `disabled` should be unconditional, not conditioned on the same transient flag that governs the label. This surfaced identically to independent reviewers across rounds 7 and 9 before round 10's code-reviewer finally named it as its own defect — a sign the class was hiding in a place multiple reviewers were tempted to skip past because "the label already reflects the state."

Related: [[feedback_findings_inside_just_closed_classes_mean_wrong_instrument]] — this defect was found by the SAME reviewer role that had just declared the mechanism converged, in the very next round, which is why "the review found nothing new" is worth restating each round rather than trusting the prior round's convergence claim at face value until a genuinely clean round confirms it.
