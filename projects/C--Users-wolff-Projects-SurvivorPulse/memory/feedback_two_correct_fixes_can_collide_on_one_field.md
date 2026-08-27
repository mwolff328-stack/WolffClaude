---
name: two-correct-fixes-can-collide-on-one-field
description: "When two fixes read the SAME field to answer DIFFERENT questions, each one's tests pass and the composition is broken — and no test of the pure function can ever catch it."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 511b6191-6bee-41e3-8574-17372c7adaac
  modified: 2026-08-27T04:50:21.415Z
---

Two independently-correct fixes can cancel each other out when they read one field for
two different questions. Every test for each fix stays green, because each was written
against the question its own author had in mind.

SurvivorPulse, 2026-08-26. `EntryContext.applyWriteTargetWeeks` answered:

- **who participates in claims** (SST-1476 set it for every alive entry on the READ path,
  fixing two same-pool entries converging on one team), and
- **which team a participant withholds** (SST-1479 reads it as "this week is about to be
  OVERWRITTEN, so claim the freshly simulated team, not the persisted one").

SST-1476 therefore made every read-path week look like a pending overwrite, and SST-1479's
persisted-team branch became unreachable there. The ledger withheld the SIMULATED team
while the badge reported the PERSISTED one — the team withheld and the team explained were
different teams, which is the exact defect SST-1479 existed to fix.

**How to find it:** when a field's own doc comment states a fact that is no longer true
("Absent on the read path, which has no run in flight"), that is the tell. A comment
silently falsified by a later fix marks the collision point. Grep every reader of the field
and ask what QUESTION each one is asking of it — not what value it holds.

**The fix shape:** one field per question. See [[guard-the-wire-not-just-the-helper]] —
the composition defect lives in the CALLER's choice of argument, so a test that hand-builds
the pure function's input **cannot** reproduce it. My first engine-level test file passed
against the buggy code for exactly that reason; the load-bearing test had to drive the real
service with storage mocked and assert on the SHAPE it builds, in both directions ("read
path sets A and omits B" AND "a real run sets both").

**Fixing the value does not fix the timing.** After the split landed, the symptom persisted:
claims are recorded only for *subsequent* entries in the allocation walk, so an entry
allocated earlier never sees a later entry's persisted team. Measured 24 of 24 residual
takeovers explained by walk order, 0 counterexamples. *Which* value is claimed and *when*
it becomes visible are separate axes — verify both before declaring a symptom fixed.
