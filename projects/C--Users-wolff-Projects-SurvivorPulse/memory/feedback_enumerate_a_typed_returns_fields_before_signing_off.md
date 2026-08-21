---
name: feedback-enumerate-a-typed-returns-fields-before-signing-off
description: "Before passing a test suite, list every field of the return type under test and grep the suite for each name. A HIGH defect shipped in the one field of two that no assertion read — 6 assertions, all on `.entryWeeks`, zero on `.lastElimWeek`."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 21592230-06ea-476f-b7cd-e40061b85574
  modified: 2026-08-21T14:20:41.777Z
---

**Before signing off on a test suite, enumerate every field of the return type it exercises and
`grep -c` the suite for each field name. A zero demands an answer before PASS.**

## Why

SST-1424 A2, 2026-08-21. `tests/unit/backtesterSweepBuyback.sst1424.test.ts` had 6 assertions and
QA passed it. `SeasonSweepResult` has exactly **two** fields:

```ts
export interface SeasonSweepResult {
  entryWeeks: number
  /** Last week any entry was eliminated ('N/A' if all survived) */
  lastElimWeek: number | 'N/A'
}
```

All 6 assertions read `.entryWeeks`. **Zero read `.lastElimWeek`** — and that is precisely where a
HIGH defect was sitting: the server sweep stamped an elimination on the revival path, so a season
where buybacks kept every entry alive still reported `lastElimWeek: 1` while the client reported
`N/A`. The field even carried its correct contract in its own doc comment, one line away.

`grep -c '\.lastElimWeek' <testfile>` returns 0 in about ten seconds. That is the entire check.

## The generalisation

Coverage intuition tracks *scenarios* (did I test the deadline? the cap? the off case?) and is
blind to *surface*. A suite can be rich in scenarios and still never look at half of what the
function returns. The narrower the return type, the more dangerous — two fields feels like nothing
to miss, which is exactly why nobody counts.

Pairs with a second instrument from the same review, which is the scenario-side version:
**generalise every boundary you do test.** The deadline-week boundary WAS tested (it was groomed).
The unasked follow-up — *"is the pool-configured deadline the only boundary that can leave no week
to revive into?"* — is a one-sentence extension of a test already written, and it is the whole of
the other HIGH defect: an entry losing in the season's final week was billed for a revival that
had no week to happen in.

## Do not let "it wasn't groomed" end the conversation

Neither defect had a corresponding Test Case, and that IS a real grooming gap worth feeding back.
But both instruments above are mechanical, cost seconds, and need no AC to authorise them. A
reviewer who only checks what grooming asked for inherits grooming's blind spots exactly.

Related: [[feedback-an-ac-with-no-test-citing-it]] (the mirror failure — walking AC→test),
[[feedback-guard-the-wire-not-just-the-helper]], and
[[feedback-paired-assertions-both-vacuous-when-op-never-ran]].
