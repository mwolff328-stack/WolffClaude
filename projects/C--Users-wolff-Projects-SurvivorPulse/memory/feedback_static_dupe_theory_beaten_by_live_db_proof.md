---
name: feedback-static-dupe-theory-beaten-by-live-db-proof
description: "A plausible root-cause theory built from static source reading alone can be real AND incomplete at the same time -- it explained one failure branch but not all of them, and a sibling ticket's own live-DB RED->GREEN proof (read too late) had already found the OTHER branch's real, independent defect. Declared two bug tickets duplicates and recommended merging one into the other; that was wrong."
metadata:
  type: feedback
  originSessionId: 8b8b496f-ec1f-4ddc-94fc-6d0c171b830d
  modified: 2026-08-26T21:38:18.717Z
---

Investigating `tests/gameplanApply.integration.test.ts:688`'s flake, traced the fixture's random-UUID role assignment (`[eX.id, eY.id].sort(...)`) and a wrong-table `delete` no-op, and showed this fully explains a ~50% coin-flip failure in one branch (the "unlisted sibling" role landing on a genuine zero-state bystander). Concluded from that alone that a sibling ticket (SST-1479, filed by another session for the same test's failure) was "very likely a duplicate/misdiagnosis" and posted a comment recommending it be merged/cancelled — without re-reading SST-1479's own page fresh immediately before posting. It had moved on: a concurrent session's Felix agent had, in the interim, root-caused a **second, independent, real production defect** (the claim ledger recording a freshly re-simulated guess instead of a bystander's actual persisted team) with a genuine RED→GREEN unit proof at the real call site, and already landed the fix. The founder caught it — "I thought we were merging SST-1479 into 1477?" — prompting a re-check that surfaced the landed commit.

**Why the static theory felt complete but wasn't:** it correctly explained the branch where the unlisted-sibling role lands on a true bystander (zero persisted state) — nothing to fix there, that's the fixture's own defect. It did NOT rule out the other branch (unlisted sibling genuinely holds a persisted team) also failing for an unrelated reason. A theory that accounts for one observed failure mode is not thereby proven to account for ALL instances of a failure with the same error shape — "expected X not to be X" said nothing about WHICH mechanism produced it on a given run, and there were two.

**Why the correction lands on the "verify before you conclude" family, not a new principle:** the piece that actually broke was chronological, not analytical — SST-1479's page had new content by the time the "duplicate" comment posted, and it wasn't re-fetched immediately before writing that conclusion. The Notion comment right before it (an hour earlier) was treated as still current.

**How to apply:**
- Before declaring two bug tickets duplicates (or recommending a merge/cancel of either), re-fetch BOTH pages' current state immediately before writing the conclusion, not from earlier in the same session — an active multi-session repo can and does move a ticket in the interim, and "I already looked at this" has a short shelf life here.
- A static/source-level theory that fully explains ONE reproduction of a symptom is not evidence it explains every reproduction sharing the same error shape. Look for whether the theory is falsifiable against the SPECIFIC evidence on file (here: did the sibling ticket's own evidence — a live-DB RED→GREEN proof — actually get checked before concluding "misdiagnosis"? It hadn't.)
- A live, DB-backed RED→GREEN proof against the real call site outranks a static/local source trace, full stop — when one exists, read it before forming or asserting a competing theory, not after.
- Correcting a public mistake (posted to a shared ticket another session may act on) is not optional or something to fold quietly into later work — post the retraction on both affected tickets immediately, explain what was actually true in each, and say plainly what changed your mind.

Related: [[feedback_verify_a_reviewers_evidence_not_their_judgement]], [[feedback_resumed_background_agent_can_duplicate_orchestrator_actions]] (same "state moved since you last looked" root shape, different trigger), [[feedback_a_premise_measured_at_a_boundary_inherits_it]] (a conclusion true in the tested case, false outside it).
