---
name: feedback_an_ac_with_no_test_citing_it
description: "Find untested code by mapping ACs to test cases and looking for orphans — two rounds of reading the code missed what the mapping found in seconds; 'the code is obviously correct' is the argument that leaves a chokepoint unguarded"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4233dbd4-4c4f-4211-baa1-08c236605893
  modified: 2026-08-02T08:53:49.116Z
---

Measured on SST-1206, 2026-08-02. Two rounds of adversarial code review read
`refreshCanonicalSpreadIfStale` closely, and one of them had *written* the
try/catch in it. Neither noticed that nothing anywhere in the repo had ever made
that write fail. The QA pass found it mechanically: build the AC → TC table and
look for an AC no TC cites. AC-7 was the only orphan, and it was the only
untested behaviour.

**Why the reading missed it.** The containment was deliberate, reviewed, and
described accurately in its own comment. Everything about it looked *considered*,
and considered reads as covered. That is the failure mode: "the code is obviously
correct" is the exact argument that leaves a chokepoint with no test. Correctness
by inspection is a claim about today; a test is a claim about every future
refactor. The try/catch was one "cleanup" away from turning every odds sync into
a hard failure with nothing to notice.

**How to apply:**
- Before signing off, write the AC → TC mapping explicitly. Any AC with no TC is
  where the untested code is. This costs a minute and does not depend on being
  clever about the implementation.
- The reverse orphan matters too: a TC tracing to no AC is either scope creep or
  an unlabelled characterization test.
- Defensive code — try/catch, fallbacks, guards, containment — is the highest-risk
  category for this, because its whole purpose is to handle a case the normal test
  path never produces. If a test would have to *force* the failure, assume nobody
  has.
- Forcing it is usually cheap. Spy on the collaborator and reject; distinguish the
  call you want by its **payload**, not by call order — a call-order counter
  silently retargets the moment the function gains another write.
- The forced-failure test needs its own guard that it actually fired
  (`expect(attempts).toBe(1)`), or a fixture that never triggers the path passes
  it having exercised nothing. Same trap as [[feedback_proving_a_test_is_load_bearing]]
  rule 7, one level up.

Related: [[feedback_guard_the_wire_not_just_the_helper]],
[[feedback_proving_a_test_is_load_bearing]].
