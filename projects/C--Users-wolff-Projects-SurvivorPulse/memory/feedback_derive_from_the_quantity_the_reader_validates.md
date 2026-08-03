---
name: feedback_derive_from_the_quantity_the_reader_validates
description: "A write path that computes a field from a different quantity than the reader validates it against will drift; assert the round trip, not the two halves."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6e26ffc5-7ff9-4576-bec5-f5d527caee3a
  modified: 2026-08-01T22:52:20.498Z
---

When a write path stamps a value that a read path later **validates**, derive it
from the *same quantity the validator checks*. Anything else is two independent
implementations of one rule, and they drift.

**The case (SST-1193).** `backfillCanonicalSpreads` hard-coded
`spreadFinalityTier: 'closing_at_kickoff'`. The reader
(`resolveCanonicalFieldsLevel`) rejects that tier when
`spreadUsedAt < gameTime - 7d`, and a rejected row sends analytics down the
cascade to a different spread than the display shows.

My first fix derived the tier from **"has kickoff passed"** (`now` vs
`gameTime`). The guard asks **"was the line captured near kickoff"**
(`spreadUsedAt` vs `gameTime - 7d`). Both sound like "is this final?" — they are
different questions. The fix was green, gate-verified, and live-verified, and it
still left the original defect reachable for any completed game whose stored
line was captured early. It escaped only because the season under test had no
completed games. Code review caught it; none of my testing could have.

**Why my tests couldn't catch it:** I asserted the deriver's output and the
guard's behaviour *separately*. Both were correct in isolation. The defect lived
in the composition. The fix was a round-trip property test — for a matrix of
inputs, every tier the deriver produces must be accepted by the validator. It
found 6 failing combinations immediately.

**How to spot it before shipping:** if you can point at two functions and say
"this one writes X, that one checks X," ask what each computes X *from*. If the
answers differ, there is a drift bug whether or not today's data exposes it.
State the invariant as a single sentence spanning both — "a tier we write must
survive the reader" — and test that sentence.

Use that as a *reading* heuristic, not an automated scanner. The
test-efficacy session's caution, from its own measured failure: a static
"writer/validator pair" detector is exactly the shape of scanner it had been
certain about and measured at **5% precision**. If you ever automate this,
measure precision on a sample BEFORE trusting the output, not after — an
unmeasured scanner produces confident noise, and this specific class is easy to
over-match because most write/read pairs are perfectly fine.

Note also what mutation testing can and cannot see here. Mutating either half
does NOT surface this: each assertion genuinely dies when its own subject is
mutated, so both halves look well-guarded. What is missing is an assertion that
never existed, and no mutant reveals an absent test. The round-trip property
test is the remedy; mutation is not.

**Companion failure, found twice the same day by different means:** the
extracted helper gets tested and the CALL SITE does not. A reviewer found it in
my code (`storage.ts` backfill site untested; every fixture in the suite used
`completed: true`, so the shipped defect's exact condition had zero coverage at
the site that shipped it) and a mutation harness found the identical shape in
SST-1194's `SeasonGridSection.tsx` call site — mutating the helper killed 3
tests, reverting the call site killed none. Extracting a pure helper improves
the code and *moves* the coverage; it does not create it. Test the caller too,
especially when the helper's input type has all-optional fields, because a
narrowed `select()` that drops a field then type-checks cleanly and silently
changes behaviour.

**Second instance, same day (SST-1192/1194):** the identical disease wearing a prose disguise —
a ticket asserted two resolvers were "the same by construction" (they weren't: one sorts
alphabetically, the other walks candidate order), every artefact agreed with the false claim,
and it shipped. Full case, including the fixture and the control, is
[[feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect]] — that file is the dedicated
treatment; this pointer exists only so the "derive from the same quantity" heuristic above is
seen to generalise to prose equivalence claims, not just to code that computes two different
things.

Related: [[project_survivorpulse_fabricated_finality_tier_splits_the_paths]],
[[feedback_proving_a_test_is_load_bearing]],
[[feedback_guard_the_wire_not_just_the_helper]],
[[feedback_a_bug_tickets_proposed_resolution_can_carry_the_defect]].
