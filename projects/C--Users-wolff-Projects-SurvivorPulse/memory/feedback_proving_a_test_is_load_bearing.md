---
name: feedback-proving-a-test-is-load-bearing
description: "How to prove a test actually guards its requirement — implement the closest WRONG version, revert against HEAD~1 with a printed invariant, assert the mechanism on fixed inputs, straddle the threshold, perform the real user action, land the guard before the fix, and check the RED is red for the RIGHT reason."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fa26fd53-3bfc-4421-99d2-4669e6b4fab0
  modified: 2026-08-03T04:28:31.433Z
---

A green test proves nothing until it has been shown RED against code that is wrong
in the specific way the test claims to catch. Five distinct ways that proof gets
faked, all hit for real on SurvivorPulse. Merged 2026-07-30 from five separate
memories that were restating one another.

## 1. The RED demo checks the THRESHOLD, not just the fix

Run the RED demo even when you are sure the test is right — the demo is what
validates the comparison operator, the threshold, and the direction. An assertion
that has only ever been evaluated against correct code has had none of those tested.

Two instances, same session (2026-07-30):

- **SST-1144.** The test asserted `cell.paddingTop > icon.style.top`. The broken
  layout was `paddingTop: 7`, `icon.top: 5` — so `7 > 5` and the test **passed
  against the exact bug it was written to catch**. The requirement is that content
  clears the icon's *bottom edge*; rewritten to derive that from the element's own
  declared style (`height` where set, `fontSize` as the line-box proxy) so the test
  reads the component instead of restating a number.
- **SST-1142.** The pre-fix RED demo (no indicator at all) only proved the happy
  path. The load-bearing demo was the **plausible wrong implementation** — driving
  the indicator from the value being null instead of from the query's fetching
  state. Only that proved the "a legitimately-null field exposure must still read as
  unavailable" constraint was enforced rather than respected by accident.

**How to apply:** for every guard test ask "what is the *closest wrong* version of
this code?" and implement that, not merely the pre-fix state. If the test still
passes, the assertion is measuring the wrong quantity.

## 2. RED proofs and git state

Reverting the fix to prove RED works only while the fix is **uncommitted**.
`git stash push -- <paths>` stashes the diff against HEAD — once the fix IS HEAD
that diff is empty, so the "reverted" tree still contains the fix and the RED run
comes back **green**. That looks like proof when it is nothing.

Hit for real 2026-07-30: after committing the jump-list DOM-order fix, a hardened
e2e selector needed a fresh RED proof. `git stash push` on the three pages returned
"4 passed", which would have been reported as the test failing to guard. The tell
was a cheap invariant printed alongside — `order-last count: 2` — the fix was still
present.

**The mirror-image failure** destroys the work instead of faking the proof. A
RED-proof script that mutates a file and restores with `git checkout -- <path>`
restores **to HEAD** — so if the fix is not yet committed, the restore *is* the
revert and the whole fix is silently gone, looking like clean-up. Hit twice in one
session (2026-07-30, `/api/entries/*` auth guards): the first RED run ate four
uncommitted edits to `server/routes.ts`; a later one-liner reverted a floor constant
back to its committed value before a `sed` could rewrite it, so the "corrected"
constant silently stayed wrong. Both times the printed invariant caught it —
`grep -c … = 0` where it should have been 1.

Also: `git checkout -- <path>` fails outright on an **untracked** new file, so a
mutated new test file is left mutated. Check `git status` at the end of any proof
script, not just the invariant.

**How to apply:**
- **Commit the fix first**, then revert against the commit that PRECEDES it:
  `git show HEAD~1:client/src/pages/terms.tsx > client/src/pages/terms.tsx`
  (save your current copies first; restore them straight after). This makes
  `git checkout --` safe as a restore *and* makes the revert real.
- **Always print a one-line invariant proving the revert happened** — a `grep -c`
  for the token the fix introduces. `git stash push` succeeding is not evidence the
  code changed.
- A RED run that comes back green means the revert failed, not that the test is
  weak. Check the invariant before concluding anything about the test.

**The same trap without a revert.** For NEW code there is nothing to revert to, so
the RED proof is a deliberate mutation instead — and a scripted find-and-replace can
silently no-op when the target string does not match exactly (whitespace, escaping,
a regex that never fired). SST-1007's doc-attachment guard, 2026-08-01: one of eight
mutations failed to apply and the run reported "17 passed", which is
indistinguishable from a test that guards nothing. The marker grep printed `0` and
gave it away. So: print the invariant proving the **mutation** landed, not only the
one proving the restore did — same discipline, both directions. Make the replacement
tool fail loudly on a missing target (`if (!s.includes(a)) process.exit(9)`) rather
than writing the file back unchanged.

## 3. Guard the guard, not the data

When you fix a scanner, validator, or tripwire that was **failing open**, a test
asserting against real production data does not guard the fix. The real data is
clean, so it passes under the fixed implementation *and* the broken one.

SST-1115 (2026-07-29): a governance tripwire's allowlist suppressed **every** banned
pattern across a whole string once any one allowlisted phrase appeared in it,
leaving 300+ character sentences unguarded. Fixed by subtracting allowlisted phrases
and matching the residue. But every test in the file scanned the actual landing
copy, which contains no overclaim — the reviewer ran the suite against both
implementations and got **9/9 green either way**. One "simplification" back to
`includes()` would have reopened it silently.

**How to apply:**
1. Add assertions with **hard-coded inputs** that exercise the mechanism directly
   (`expect(findBannedHits("a contrarian-edge read, guaranteed to beat the pool")).toHaveLength(2)`).
   These keep failing on regression no matter what the real content says.
2. **Prove RED by reverting the implementation**, not by breaking the data.
3. Recursive value-walkers have a standard blind-spot set worth attacking every
   time: `Map`/`Set` (`Object.entries` returns `[]` for both), functions returning
   strings, symbol keys, non-enumerable properties, prototype getters, and cycles.
   On the same story a probe file exporting a Map, a Set, and a zero-arg function
   each carrying blatant overclaim language passed **11/11 with zero hits**.
   Reverting the fixed walker also surfaced `RangeError: Maximum call stack size
   exceeded` on a cyclic object — a second latent bug nobody had noticed.
4. Beware the **cycle guard becoming a fail-open**: a `seen` set that skips
   already-visited objects can under-scan a legitimately repeated object.
5. Derived coverage beats hand-maintained lists. A "check every live string" test
   built from a hardcoded array of eight fields silently excluded eight other
   rendered fields and drifted with every copy edit while still reading like a
   complete check. Walk the exports and subtract the deliberate exemptions.

## 4. Threshold fixtures need a control test

When the fix is a *tuning* change (a weight, a penalty, a threshold) rather than a
new branch, the fixture may sit on the same side of the line in both regimes, so the
test passes before AND after. Nothing in such a test *looks* like it pins old
behaviour.

SST-1077 (2026-07-28): the playoff optimizer's duplicate penalty went from soft
(LAMBDA 0.75) to dominating. The first fixtures had a score gap *smaller* than the
soft penalty, so the soft regime already produced distinct picks — all 5 behavioural
tests passed against the unfixed code. Rebuilding with a gap exceeding the penalty
produced a real 3-failure RED.

**How to apply:** for any threshold/weight change add a **control test asserting the
OLD behaviour on the SAME fixture** (e.g. `selectPortfolio(fixture, n, SOFT_WEIGHT)`
still keeps the overlap). If the control passes, the fixture provably straddles the
threshold. Cheaper and more durable than reasoning about whether the numbers
discriminate.

⚠️ `npm run test:unit` exits 0 on Windows **without running** (POSIX env syntax);
use `NODE_ENV=test … npx vitest run --config vitest.config.ts` via Git Bash.

## 5. Cause the state, don't set it

A test that **sets** state directly — `el.scrollTop = 400`, `.evaluate(el => …)`,
assigning a property — proves the state is *reachable by code*, not that a user can
produce it.

SST-1093 (2026-07-29): an E2E test "proved" the Terms of Use modal scrolled by
setting `scrollTop` and asserting it moved. It passed. Meanwhile the modal body had
no `tabIndex`, so a keyboard-only user could not scroll it **at all**: Radix's
`FocusScope` excludes links from autofocus, focus landed on the Close button, and
its nearest scrollable ancestor was the dialog (`overflow-hidden`) then the
scroll-locked body. The only tabbable element inside the Terms body was the mailto
link in section 12 — **sections 2 through 11 were unreachable**. WCAG 2.1.1, on a
legal document, on the surface the story had just made primary. Caught by code
review, not by the suite. Fix: `tabIndex={0} role="region" aria-label`; the test now
focuses the region and presses PageDown. Vlad banked this as a standing review
heuristic after noting he had read that exact `scrollTop` line in his first QA pass
without flagging it.

**Why it recurs:** setting state is easy and deterministic; dispatching the real
input is fiddly. The easy version passes, so nothing pushes back.

**How to apply:** name the user action (key press, click, modifier-click, focus
move). If the test doesn't perform it, the test measures the component, not the user.

## 6. When the work is "add a guard AND the fix it demands", land the GUARD first

Sections 1-5 are about *manufacturing* a RED proof after the fact, which is fiddly
and is where the faking happens. Sometimes the work itself contains a free one, and
the only thing standing between you and it is the order you land two changes in.

Whenever a task is "extend a check to cover X" **and** "make X actually clean", the
instinct is to clean first so nothing goes red. Do the opposite. Land the assertion
first: it goes red against **real, production-shaped rows**, which is a genuine
failing-first proof you did not have to construct, and it simultaneously proves the
assertion is load-bearing rather than vacuous. Then land the fix and watch it go
green. Same two changes, opposite order, and the proof falls out of the sequence.

Worked example (SST-1215, 2026-08-01). Pre-publish Stage 4c
(`verify-no-test-pools.ts`) asserts only `count(pools WHERE isTestData) === 0` — it
is blind to users, so orphaned test accounts pass it. Stage 3 mints
`http_e2e_user_*` into the ephemeral `ci_test` container and Stage 4b
(`cleanup-test-pools.ts`) reaps only `testuser_`/`testadmin_`, so it cannot clean
them. My proposed order was extend-cleanup-then-assert; the better order is
assert-then-extend-cleanup, because the assertion goes red on rows the run really
created.

**Preconditions worth checking before relying on it**: the red must come from
*same-run* state, not accumulated history, or you have built an outage rather than a
tripwire — the ephemeral service container is what makes this safe here (see
[[project_survivorpulse_prepublish_gate_mechanism]]). And confirm the rows are
actually produced every run, i.e. the producing suites carry no `skipIf` /
`TEST_DISABLE_NETWORK` guard; ~241 integration tests here do self-skip, so that is a
live possibility, not a theoretical one.

**Corollary for gate-adjacent work:** an assertion that has only ever been added
*after* the data was cleaned has never been evaluated against dirty data — the
section-3 disease, arriving through scheduling rather than through fixture choice.

## 7. A RED that is red for the WRONG reason is not a proof either

Sections 1-6 are all about a RED proof coming back **green** when it should be red.
The inverse is just as deceptive and reads as success: the run goes red, you tick the
box, and the test never guarded anything. **Read the failure text and confirm it
names the specific defect** — a failure count is not a proof.

SST-1217 (2026-08-01). A schema-driven tripwire asserted `deletePool` issues a delete
against every non-cascading FK child of `pools`, comparing Drizzle table objects by
identity. First RED run: all **six** children reported missing, plus `pools` itself at
index `-1`. That is a far more alarming bug than the real one — and it was entirely an
artifact. A `vi.resetModules()` in `beforeEach` made the dynamically re-imported
`storage.ts` pull a **second copy of `shared/schema`**, so every `===` against the
test file's statically-imported tables failed. Removing `resetModules` and importing
`storage` statically gave the correct RED: exactly one table named,
`pool_historical_data_completions`, which is the actual defect.

The tell was arithmetic, not tooling: `deletePool` visibly deletes five of those six
tables, so "all six missing" contradicted the source. Had the list been accepted, the
fix would have looked like it needed five more deletes.

**How to apply:**
- State the expected failure **before** running it ("exactly one table, named X"). A
  RED that is redder than predicted is a broken instrument, not a worse bug.
- Any assertion resting on **object identity** (Drizzle tables, enum objects, class
  references) is silently broken by `vi.resetModules()`, `vi.isolateModules`, dynamic
  `import()` after a reset, or the same module reachable by two specifier paths.
  Compare by identity only when one module instance is guaranteed; otherwise compare a
  stable key such as `getTableConfig(t).name`.
- Corollary for invariants: a `sed -n 'A,Bp' file | grep -c token` invariant is pinned
  to **line numbers** and goes stale the moment anything above it changes. After a
  rebase onto 11 upstream commits, the SST-1217 invariant printed `0` ("fix gone!")
  purely because `deletePool` had moved from 2557 to 2581. Anchor on the symbol —
  `awk '/async deletePool\(/,/^  \}$/'` — not on a line range.
- The same staleness bites **within a single session**, with no rebase involved, and
  there it fails in the dangerous direction. SST-1220 (2026-08-01): a `sed -i '715s/…/…/'`
  call-site mutation silently hit a **comment** instead, because doc edits made earlier in
  the same session had pushed the target down ten lines. The run reported "2 passed" —
  which reads exactly like *"this call site is unguarded"*, the very finding the mutation
  existed to test for. The invariant (`must be 0`, printed `1`) plus echoing the before/
  after text of the touched line caught it; re-targeting by content match gave the real
  answer, 4 RED. So: **never target a mutation by line number**, match on the code text,
  and echo the line you actually changed — the ticket's own line references were already
  stale before the first edit.

## 8. The test passed, but not because the code is right

Sections 1-7 are about the RED demo being faked. This is the GREEN run being
meaningless: the assertion never had a chance to fail, so no mutation of the code
under test can move it. Two mechanisms, both hit on SST-1214's follow-on
(2026-08-02), both found by the mutation pass and neither visible on review.

**a) The expectation is derived from the implementation.** A test asserted

```ts
expect(filled[0].selector).toBe(`[data-testid="${POOL_DESCRIPTION_TESTID}"]`)
```

— comparing the implementation against itself. Renaming the constant renames both
sides, so it is a tautology. Measured: pointing the helper at a field id that does
not exist in the product left **all 15 tests green**, under a comment claiming
this very test proved the field existed. Fix is two assertions, not one: hard-code
the literal on one side (`toBe('[data-testid="textarea-pool-description"]')`) and
pin that literal to the product with a second check that greps the component
source. Either alone is defeatable; together a rename on either side is caught.

**Smell:** any `expect(...).toBe(...)` whose right-hand side mentions a symbol
imported from the module under test. Interpolating a constant into an expected
string is the common disguise.

**b) Green by ordering — an earlier test's cleanup is the precondition.**
Three tests exercising an env-var fallback chain passed with the variable set,
because no env-reading test ran first and a previous test's `afterEach` had
already deleted it. Run in isolation (`vitest -t`), each failed instantly:
`expected 'ci-ambient-9999' to be 'ci-99-3'`. Clearing shared state in `afterEach`
alone leaves the FIRST test in the file — and any reorder, `.only`, shard split,
or `-t` filter — reading whatever the environment happened to have. Clear in
`beforeEach`; restore the ambient value in `afterEach` so nothing downstream is
disturbed.

**How to apply:** for any test touching ambient state (env vars, globals, module
registries, the clock), run it ALONE — `npx vitest run <file> -t "<name>"` — and
with the ambient value deliberately set to something wrong. A file that only ever
runs whole has never had its per-test preconditions tested. This one is cheap and
catches a class that a full green run advertises as fine.

## 9. "It can't be proven here" is a hypothesis too

Sections 1-8 are about a proof that was attempted and faked. This is the one that
never gets attempted: a real defect is spotted, no existing test comes close to its
branch, and it is deferred as unproveable — *documented honestly*, which is what
makes it feel like discipline rather than avoidance.

SST-1220 (2026-08-01). A known false positive in `sharedWeeks` was deferred with a
written rationale: every existing test used distinct-scored fixtures that never
reach the tie branch, and shipping an unguarded change to satisfy a tidiness
argument is exactly how the two fixes that ticket corrected had shipped. All true.
The founder said build the fixture anyway. It took **four chained preconditions**,
one line of fixture each: a one-team week to starve the entry, which makes fallback
tier 1 dead-end identically so it is skipped, which forces tier 2 (no claims) to be
adopted, which is the only thing that lets a peer-claimed team into the next week's
tie — plus handing the peer the tie WINNER in `usedTeams` so it claims the LOSER.
Without that last line the false positive silently becomes a true one and the
fixture proves nothing. RED came back `[1, 2]` where it must be `[1]`.

**The tell is diagnostic, not moral.** "No existing test is near this branch" is the
condition under which defects survive — it is evidence the area is unguarded, not
evidence it is unguardable. Distinguish the two by asking what *specifically* blocks
the fixture. Here the answer was "reaching the branch", which is constructible.
Genuinely unproveable is different in kind: it needs infrastructure you don't have
(a real browser, a second DB host, a race you cannot schedule).

**How to apply:** before recording a deferral for unprovability, spend one honest
attempt naming the world in which the requirement WOULD be violated and writing it
down as fixture steps. If you can enumerate the preconditions, you can usually build
them. If you still defer, record the *specific* blocker — not "no test comes close",
which is the symptom the deferral is supposed to fix. And when a deferral is
overridden, the fixture is the deliverable: assert **both** directions (the case
that must fire and the case that must not), or the "fix" is satisfiable by doing
nothing — neutering the loop here failed 4 tests precisely because the control was
there.

---

Related: `.claude/skills/learned/survivorpulse-tests-that-encode-bugs.md` (project skill,
not a personal memory), [[feedback_delegating_is_not_agreeing]],
[[feedback_local_run_differs_from_ci_by_construction]],
[[feedback_survivorpulse_gate_page_not_viewer]],
[[feedback_survivorpulse_source_text_guards_fooled_by_text]],
[[feedback_sweep_for_the_class_not_the_change]],
the sp-live-verify skill
