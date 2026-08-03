---
name: feedback_an_ac_can_launder_an_ungroomed_commit_into_a_decision
description: "A groomed AC pinned behaviour that came from an unreviewed Replit-Agent checkpoint — once it has an AC number nobody re-examines it, because by then it looks decided."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c5af6e0a-2dbe-4f57-bcbd-437e2e737b83
  modified: 2026-08-03T04:28:11.948Z
---

SurvivorPulse refused non-admins the ability to create a past-season REGULAR pool. It looked
settled: the server enforced it on two routes, the client mirrored it, and an acceptance
criterion covered it — **SST-424/AEP-3, TC-17 under AC-9**.

None of that was a decision. The rule entered in commit `359c91db` (2026-01-09),
`Replit-Commit-Author: Agent`, an `intermediate_checkpoint`, **no ticket**, as a side effect of a
broader "improve pool creation" change. It directly contradicted `HIST_YEARS_BACK = 5` in the
same file, which deliberately grants non-admins five years back. A later groomed story then
*ported* the client half ("ported from pool-form.tsx lines 463-479") and pinned it as a Test Case.
From that point it read as product intent.

**Why it survives:** an AC number is a stop sign. Reviewers check whether code matches the AC, not
whether the AC was ever decided. The laundering is invisible precisely because the paperwork is
in order.

**Two tells, both present here:**
- The rule **contradicts another rule in the same file**. Genuine decisions rarely fight their own
  neighbours; inherited artifacts do.
- The pinning test is **mechanism-named and asserts nothing**. TC-17 was called *"selecting season
  2023 sets poolScheduleType to playoffs_only"* but its body only checked that the next step
  rendered without crashing — it passed under both the old and the new behaviour. A test that
  cannot fail is not what a real decision produces. See
  `.claude/skills/learned/survivorpulse-tests-that-encode-bugs.md` (project skill, not a
  personal memory) for the same disease one level down.

**How to apply.** Before treating an AC as a founder decision, `git log -S` the behaviour it pins
and read the introducing commit. If the author is an agent, the message has no ticket, or it is a
checkpoint inside unrelated work, the AC is *documentation of an artifact*, not a ruling — say so
and ask, rather than either obeying it or silently reversing it. Reversing it is a hard stop only
when it really was decided; this check is what distinguishes the two.

Related: [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]] (the same "authoritative text
terminates the search" failure, in prose rather than in an AC).
