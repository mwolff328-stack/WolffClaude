---
name: a-harness-disagreement-is-evidence-about-the-harness
description: "A comparison harness that shares state between its two arms manufactures false disagreements; scepticism applies to dramatic findings, not just green ones."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d4c09734-bb23-4a66-8c5d-fca90d763d7a
  modified: 2026-08-02T07:24:06.454Z
---

When you build a harness to compare two implementations (old vs new, A/B, "are these
equivalent?"), **a reported disagreement is evidence about the harness before it is
evidence about the code.** Dramatic findings feel like the harness working. They are
the case where it is least likely to have been checked.

Measured 2026-08-02 proving `option.waitFor({state:'visible'})` ≡
`expect(option).toBeVisible()` for the shadcn Select driver extraction. First harness
reported a confident **5-of-7 outcome disagreement**. All five were fabricated. With
each arm in its own browser context: **7/7 agreed**, on the verdict and on which
option was clicked.

**The mechanism, which generalises past Playwright:** the two arms shared one page.
`page.setContent()` resets the **document** but NOT the **window** — it is
`document.open/write/close`, so `window.__sentinel` survived from arm A into arm B.
Arm A's pending `setTimeout` callbacks were also still in flight during arm B. Any
shared surface does this: a module-level cache, a singleton client, `process.env`, a
DB row, a global counter. If arm B can observe anything arm A wrote, the comparison
is not a comparison.

**The tell was self-contradictory output** — a run reported as `timeout` while *also*
reporting it had clicked an option. Two fields that cannot both be true is the cheapest
possible signal that the instrument is broken, and it is only visible if the harness
prints more than a verdict. Print the corroborating detail, not just pass/fail, and
read it even when the headline looks decisive.

**How to apply:**
1. Give each arm its own everything — fresh context/process/fixture. Isolation is
   cheaper than diagnosing a false positive.
2. Log a second, independent observable per arm (what was chosen, what was written),
   and cross-check it against the verdict before believing either.
3. A comparison whose scenarios all *succeed* proves little — include cases where both
   arms must FAIL, or the agreement assertion is vacuous. (Here: "option never appears"
   and "no match for the name" both timing out.)
4. Before reporting "X and Y differ", flip it: re-run with the arms **swapped in
   order**, or run arm B alone. If the finding moves, it was the harness.

## Corollary: a mutation harness only tests what the FIXTURE RECORDS

Same session, same day, opposite direction. Six mutations of a Playwright Select
driver each killed ≥1 test, so the suite read as well-guarded. Independent review then
found **three mutants that survived 8/8 green** — including
`waitFor({state:'attached'})` instead of `'visible'`, which is the module's entire
purpose and the one Radix actually violates (the listbox is in the DOM before it has a
box).

The reason is mechanical and worth checking for by name: **every mutant I wrote changed
the SHAPE of the call** — dropped a step, reordered two, hard-coded a constant. The stub
recorded `{kind, target, timeout}` and silently discarded `options.state`. An argument
the fixture throws away is invisible to *every* shape mutation, so no amount of them
finds it. Two others survived for the same reason: ops were keyed on the selector
*string*, so resolving `.first()` twice was indistinguishable from correct, and nothing
counted trigger clicks, so clicking it twice (which toggles a real Radix Select shut)
was free.

Before trusting a mutation score, ask: **for each argument the code passes to a
collaborator, does the fixture record it?** If not, mutate that argument's VALUE, not
just the call's shape. A test named for a requirement whose input the stub discards is
pinning nothing, however many mutants died elsewhere.

Related: [[feedback_proving_a_test_is_load_bearing]] — same discipline pointed at the
other failure direction. That one is about a green run that proves nothing; this is
about a red one that proves nothing, plus a mutation score that flatters itself. All
come from not interrogating the instrument. Also
[[feedback_survivorpulse_verify_a_deferral_reason]] and
[[project_survivorpulse_local_flake_repro_traps]].
