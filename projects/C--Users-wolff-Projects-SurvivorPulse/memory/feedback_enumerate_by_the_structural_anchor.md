---
name: feedback-enumerate-by-the-structural-anchor
description: "Grepping for a VALUE's formatting finds only the instances that share it — sweep by the structural anchor (the call), then read the real rows back."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 22184c48-fd1c-4a10-8d8e-27f95ec37336
  modified: 2026-08-01T20:41:54.447Z
---

When sweeping a file for "every place that does X", anchor the search on the **call or
construct**, not on how the value happens to be written.

Measured 2026-08-01, SST-1214. `scripts/seed-e2e.ts` creates **three** pools and each
needed a run tag. I grepped for ``description: `Seeded`` — the template-literal form —
found two, and treated that as the complete set. The third wrote
`description: 'Seeded E2E demo pool for backtester UI (regular season 2025).'` as a plain
single-quoted string, so it never matched. Two of three, reading as all three.

The anchor that would have been right the first time was `grep -n "\.insert(pools)"` —
three hits, unambiguous, independent of quoting. The value's formatting is a style
choice that varies within one file; the construct is not.

**Why:** a grep pattern that includes any part of the *value* silently scopes the sweep
to instances sharing that value's formatting — quote style, template vs literal,
line breaks, a different but equivalent word. The result looks like a complete
enumeration, and nothing about the output says "partial." This is the same family as
[[feedback_survivorpulse_source_text_guards_fooled_by_text]] and the global rule that
grep is text matching, not an AST.

**How to apply:**
1. Enumerate by the structural anchor — the function call, the import, the JSX tag —
   then read each hit. Count the hits and say the count out loud.
2. Cross-check the count against reality when reality is reachable. Here the miss was
   caught by `SELECT id, name, description FROM pools` against the CI Neon branch after
   a run: three seeded rows, two tagged, one not. **The database knew; the file didn't
   volunteer it.** Whenever a sweep has an observable output, verify against the output.
3. If a defect class can recur (a *fourth* pool later), leave a runtime tripwire rather
   than trusting the next sweep — SST-1214 added a report-only "looks seeder-written but
   carries no tag" warning, which needs no one to remember anything.

Related: [[feedback_guard_the_wire_not_just_the_helper]],
[[feedback_check_distribution_before_inferring_convention]].
