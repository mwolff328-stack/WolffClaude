# Tests That Encode Bugs

The evidence file behind `rules/common/testing.md` → **"Tests Specify, They Don't
Describe."** Read that rule for what to do; read this for why it exists and how the
failure keeps disguising itself.

Scope note: this file is in a public repo, so it carries the **patterns** only.
Per-incident specifics — ticket IDs, file paths, endpoint names, algorithm constants
— stay in the per-machine memory store alongside the code they describe.

---

## Part 1 — The original disease: a test that describes the code

A test written AFTER the code, by the implementer, asserting what the code *does*
rather than what the requirement *says*, is a snapshot — not a specification. It is
structurally incapable of catching the bug it was written next to, and it is worse
than no test, because it certifies the defect.

Three defects in a single effort established the pattern. Every one was invisible to
a green suite and was caught instead by a live smoke or by reading the code:

- a reset that silently **re-confirmed** instead of clearing
- a **stale confirmation row** left behind by an update
- **non-distinct submitted picks** accepted where distinctness was the requirement

The common shape: the assertion was derived from the implementation sitting in the
next buffer. Tests authored from acceptance criteria at grooming — before any code
exists — cannot exhibit this, and did not. Every failure came from tests added later,
alongside the code.

**The tell:** ask what the test would do if the requirement were restated but the
implementation replaced. If the answer is "fail for the wrong reason" or "still
pass," it is characterization, not specification.

---

## Part 2 — Five ways the RED proof itself gets faked

A green test proves nothing until it has been shown red against code that is wrong in
the specific way the test claims to catch. Below are the ways that proof gets faked
while looking rigorous. All five were hit for real.

### 1. The RED demo validates the THRESHOLD, not just the fix

An assertion that has only ever been evaluated against correct code has never had its
**comparison operator, threshold, or direction** tested.

A layout test asserted `content.paddingTop > icon.top`. The broken state was
`paddingTop: 7`, `icon.top: 5` — so `7 > 5`, and the test **passed against the exact
bug it was written to catch**. The requirement was that content clear the icon's
*bottom edge*; the assertion measured the wrong quantity and no amount of green would
ever have said so.

A second instance the same day: a pre-fix demo showing "no indicator at all" only
proved the happy path. The load-bearing demo was the **plausible wrong
implementation** — driving the indicator from the value being null rather than from
the query's fetching state. Only that one proved the constraint was enforced rather
than satisfied by accident.

> Ask "what is the **closest wrong** version of this code?" and implement *that*, not
> merely the pre-fix state. If the test still passes, the assertion is measuring the
> wrong quantity.

### 2. RED proofs and git state

Reverting the fix to prove RED works only while the fix is **uncommitted**.

- `git stash push -- <paths>` stashes the diff **against HEAD**. Once the fix *is*
  HEAD, that diff is empty, the "reverted" tree still contains the fix, and the RED
  run comes back **green**. That reads as "the test doesn't guard anything" when in
  fact nothing was reverted.
- The mirror image destroys work instead of faking proof: a script that mutates a
  file and restores with `git checkout -- <path>` restores **to HEAD** — so if the
  fix is not yet committed, the restore *is* the revert and the fix is silently gone,
  looking like tidy clean-up. This ate uncommitted edits twice in one session.
- `git checkout -- <path>` fails outright on an **untracked** new file, so a mutated
  new test file is simply left mutated.

> **Commit the fix first**, then revert against the commit that precedes it
> (`git show HEAD~1:<path> > <path>`). That makes `git checkout --` safe as a restore
> *and* makes the revert real. **Always print a one-line invariant** — a `grep -c`
> for a token the fix introduces — before trusting any RED result. A RED run that
> comes back green means the revert failed, not that the test is weak.

### 3. Guard the guard, not the data

When you fix a scanner, validator, or tripwire that was **failing open**, a test
asserting against real production data does not guard the fix. The real data is
clean, so it passes under the fixed implementation *and* the broken one.

A governance tripwire's allowlist suppressed **every** banned pattern across a whole
string as soon as any one allowlisted phrase appeared in it, leaving long sentences
entirely unguarded. Every test in the file scanned the actual live copy, which
contains no violation — so the suite returned **9/9 green under both
implementations**. One "simplification" back to a naive substring check would have
reopened the hole silently.

> Assert the **mechanism on hard-coded inputs**, not the state of today's data.
> Those assertions keep failing on regression no matter what the real content says.
> Prove RED by reverting the *implementation*, never by breaking the data.

Two recurring traps in this family:

- **Recursive value-walkers have a standard blind-spot set:** `Map`/`Set`
  (`Object.entries` returns `[]` for both), functions that return strings, symbol
  keys, non-enumerable properties, prototype getters, and cycles. A probe fixture
  exporting a Map, a Set, and a zero-arg function — each carrying blatant violations
  — passed **11/11 with zero hits**. Reverting the fixed walker also surfaced a
  stack overflow on a cyclic object, a second latent bug nobody had noticed.
- **A cycle guard can itself become a fail-open:** a `seen` set that skips
  already-visited objects will under-scan a legitimately repeated one. Prevent
  infinite recursion without silently dropping coverage.

And a corollary on scope: **derived coverage beats hand-maintained lists.** A "check
every live string" test built from a hardcoded array of eight fields silently excluded
eight other rendered fields, and drifted further with every copy edit while still
reading like a complete check. Walk the exports and subtract the deliberate
exemptions.

### 4. Threshold fixtures need a control test

When the fix is a **tuning** change — a weight, a penalty, a threshold — rather than
a new branch, the fixture may sit on the same side of the line in both regimes. The
test then passes before *and* after, and nothing about it *looks* like it pins old
behaviour.

A scoring routine's duplicate-suppression weight went from soft to dominating. The
first fixtures had a score gap smaller than even the soft penalty, so the old regime
already produced the desired output — all five behavioural tests passed against
unfixed code. Rebuilding with a gap that exceeded the penalty produced a real
three-failure RED.

> Add a **control test asserting the OLD behaviour on the SAME fixture**. If the
> control passes, the fixture provably straddles the threshold and the sibling
> assertions are testing the contract rather than the fixture. Cheaper and far more
> durable than reasoning about whether the numbers discriminate.

### 5. Cause the state, don't set it

A test that **sets** state directly — assigning `scrollTop`, `.evaluate(el => …)`,
writing a property — proves the state is *reachable by code*, not that a user can
produce it.

An E2E test "proved" a legal modal scrolled by setting `scrollTop` and asserting it
moved. It passed. Meanwhile the modal body had no `tabIndex`, so a keyboard-only user
could not scroll it **at all** — the focus library excluded links from autofocus,
focus landed on the close button, and its nearest scrollable ancestor was a dialog
with `overflow-hidden` above a scroll-locked body. The only tabbable element in the
body was a mailto link near the end, leaving the bulk of a **legal document**
unreachable. A WCAG 2.1.1 failure on a surface the story had just made primary,
caught by code review rather than by the suite.

It recurs because setting state is easy and deterministic while dispatching the real
input is fiddly. The easy version passes, so nothing pushes back.

> Name the user action — key press, click, modifier-click, focus move. If the test
> does not perform it, the test measures the component, not the user.

---

## Checklist before claiming a test guards something

- [ ] Does its **name** state the requirement, not the mechanism?
- [ ] Does it trace to an AC — or is it labelled as a characterization test?
- [ ] Has it been shown **RED**, with a printed invariant proving the revert happened?
- [ ] Was the RED run against the **closest wrong** implementation, not just the
      pre-fix state?
- [ ] Does it assert the **mechanism on fixed inputs**, rather than the state of live
      data?
- [ ] For a tuning change: does a **control test** prove the fixture straddles the
      threshold?
- [ ] Does it **cause** the state through a real user action rather than assigning it?
- [ ] Does it assert **where the truth lives** (the DB or the real layer), not merely
      that an operation reported success?
