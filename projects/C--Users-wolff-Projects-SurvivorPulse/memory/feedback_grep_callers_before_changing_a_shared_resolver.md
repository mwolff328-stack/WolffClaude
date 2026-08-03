---
name: feedback-grep-callers-before-changing-a-shared-resolver
description: "Before changing what an exported pure function RETURNS for an existing input, grep its callers and say what each does with the changed case — a scoped founder ruling does not scope the blast radius."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 934ead4d-d534-45a5-b163-a22e49249c1a
  modified: 2026-07-30T14:22:20.072Z
---

SST-1119 changed `resolvePlannedTeamsForWeek` (server/services/gameplanApplyService.ts)
so a `{kind:'tied'}` resolution auto-resolves instead of skipping. The founder's
ruling was explicitly about **auto-allocation** (bulk Apply). But that function has
TWO callers: `buildApplyCandidatePlan`, and the SST-877 single-cell
**reset-to-auto** route (`server/routes.ts` ~6569), whose documented contract is a
422 `NO_AUTO_RECOMMENDATION` / `ambiguous-tie`. The change silently flipped that
endpoint's public API to 200. Caught only by the CI gate
(`tests/gameplanResetToAuto.integration.test.ts`, "expected 200 to be 422") —
20 minutes per round trip.

Fix: make the new behaviour **opt-in** (`{ resolveTies: true }`), passed only by
the apply path, so the default stays byte-identical; pin the default with a test
that names the other consumer.

**Why it was missed despite [[feedback_sweep_for_the_class_not_the_change]]
already being written down:** the change *looked* local — one small function, one
obvious caller, a narrowly-worded instruction. The tell that should have fired:
the function is **exported from a `*Service.ts` module**, which is the definition
of a shared contract, and the reasoning had only ever traced ONE path through it.

**How to apply:** when changing an exported function's output for inputs it
already handled, grep callers FIRST and write one line per caller describing what
it now does with the changed case. If any caller's behaviour would change in a way
the instruction didn't ask for, make the new behaviour opt-in rather than
assuming the ruling generalises. A scoped ruling scopes the *intent*, never the
blast radius — that is the author's job.

Related: [[feedback_sweep_for_the_class_not_the_change]]
