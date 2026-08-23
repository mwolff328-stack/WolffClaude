---
name: feedback_a_source_guard_must_assert_the_wire_is_reached
description: "A source guard that asserts a call site's TEXT is blind to that site being unreachable — plus three fail-open traps that made guards green and wrong in one story."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b1702ff6-f38a-4ca1-a935-e054bfa64700
  modified: 2026-08-23T08:37:27.847Z
---

**A source-shape guard must assert the wire is REACHED, not merely that it is PRESENT.** Measured three separate ways in SST-1439, and every time the instrument was green and wrong.

1. **Unreachable but correct-looking code.** A resolver call was added to `GET /objects/*objectPath` and a guard asserted that call site's text. The middleware it depended on was mounted at `/api` only, and that route lives outside `/api` — so the call could never do anything. The guard passed, and the fix it existed to enforce was inert. Reading the source, it looked done.

2. **A regex that could never match the real spelling.** `/req\.customUser!?\.id/` — `!?` makes the **non-null assertion** optional; it never matches the **optional-chained** `req.customUser?.id`. Eleven such reads existed in the file. A probe route written with `?.` stayed green across all 176 tests, while its byte-identical `.` twin was caught instantly. The route was *invisible*, not merely unguarded: it fell out of every bucket the reconciliation counted. Behind that hole sat a real defect — an admin seeing their own P&L rendered as the target's.

3. **An assertion that could not fail for any input.** A "nothing unattributed" sum whose buckets were `(param | !param) × (resolves | reads-directly)` — a partition by construction. Confirmed over 200,000 randomly generated tables: zero failures. Its comment claimed it proved completeness.

**Why this matters more than an ordinary weak test:** a guard that overstates its coverage is worse than one known to be weak, because it stops anyone from looking again.

**How to apply:**
- **Mutate the thing you claim to guard and require RED.** Verify the mutation actually applied (a `grep -c` invariant on a token the change introduces) and that the restore was byte-identical. A guard whose failure mode has never been observed is a claim, not a test.
- After adding a source guard, ask separately: *can this code path execute at all?* Mount points, route prefixes, dead files and shadowed routes all make "present" ≠ "reached".
- Prefer a **positive enumeration** over `not.toMatch`. Three `not.toMatch` patterns guarding an authorization invariant stayed green against the exact mutation they forbade, and would go green on any rename.
- **Scope an allowlist by position, not by name.** Admitting a variable name (`effectiveOwner`) let any call site be rewritten to use that name and pass — the precise swap the entry claimed to prevent.
- **Watch the exit code, not the summary.** A suite printed "82 passed" and exited 1 on an unhandled rejection, which would red CI. (`logAuthEvent` reads `req.headers` outside its own try/catch, so a bare `void` call from middleware can reject.)
- Window-based source slicing fails in both directions: too narrow and it misses named handlers entirely; too wide and it credits a route with a neighbour's calls, masking a real offender. Bound at the next registration and cut the tail at the argument list.

Related: [[feedback_guard_the_wire_not_just_the_helper]], [[feedback_source_scanning_guards_need_three_meta_tests]], [[feedback_survivorpulse_source_text_guards_fooled_by_text]], [[project_survivorpulse_glob_in_comment_breaks_block_stripper]].
