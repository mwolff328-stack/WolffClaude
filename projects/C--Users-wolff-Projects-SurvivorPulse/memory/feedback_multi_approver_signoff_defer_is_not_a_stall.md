---
name: feedback-multi-approver-signoff-defer-is-not-a-stall
description: "When a gate names two approvers (e.g. \"Ann/Luigi sign-off\"), one deferring to the other on a named open question is the gate working, not a stall — surface that question to the other approver rather than treating either response alone as sufficient."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e43fbfc7-cf05-4734-a8bd-17ecb510c88b
  modified: 2026-09-06T17:12:25.143Z
---

When a sign-off gate names multiple approvers, don't stop at the first approver's response if that response is a deferral naming a specific unresolved question — route that exact question to the other named approver instead of guessing or treating the deferral as a soft no.

**Why:** SST-1573's `bt1.repoint.contract.test.ts` gate requires "Ann/Luigi sign-off" for edits touching the file it treats as a frozen parity reference. Asked to approve repointing `client/src/backtester/lib/assignIndependentPicks.ts`'s local `NFL_DIVISIONS` to a shared import, Luigi declined to approve solo and named a real, specific concern: a shared import could silently undermine the golden snapshot's independence from the implementation if the shared module ever changes, even though today's values are byte-identical. He explicitly deferred to Ann as the acceptance-criteria owner. Ann's follow-up resolved it substantively — the golden snapshot diffs computed numeric *output*, not the constant's identity, so byte-identical values make this an ordinary import-site refactor, not the class of edit the gate exists to police. That resolution was the actual answer the gate wanted; treating Luigi's deferral as a "no" or a stall would have blocked correct, sign-off-worthy work, and treating it as silent approval would have skipped a real independence question.

**How to apply:** When a task names 2 approvers for a gate and you dispatch to both, don't average or pick a "majority" — read each response for whether it's a decision or a named open question for the other approver. If it's the latter, route that exact question (not a re-ask of the whole request) to the other approver and use their answer as the resolution. This generalizes beyond SurvivorPulse to any multi-approver sign-off gate.
