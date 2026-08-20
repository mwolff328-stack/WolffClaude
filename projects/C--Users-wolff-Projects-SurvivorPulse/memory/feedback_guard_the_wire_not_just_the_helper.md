---
name: guard-the-wire-not-just-the-helper
description: "A perfectly-tested helper proves nothing if the call site stops passing the argument — measured at 0 of 109 tests killed; the fix needs a behaviour test, not a source grep."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 449fbd91-3ff9-4db3-9f9b-2f5cba2d44a7
  modified: 2026-08-17T05:18:44.311Z
---

Testing the FUNCTION and testing the WIRE that reaches it are different jobs. A
thoroughly-mutation-tested helper can sit behind a call site that no longer passes it
anything, and every test stays green.

Measured on SST-1179 slice 2c, three instruments, one night, three sessions:

| Story | Helper mutations | Wire mutation |
|---|---|---|
| SST-1194 | 3 of 42 die | **0 of 363** |
| SST-1193 | thorough | **0** — every fixture `completed:true` at the site that stamped 256 games |
| SST-1179 2c | 2–6 each | **0 of 109** |
| SST-1208 | 6/6 (helper only) | **6/6 still pass with the 5-line call site fully removed** |

SST-1208 (2026-08-02): a security-auditor's own review flagged this independently of the
mutation-testing lineage above — same class, different discovery route. `decideEntryStatusPatch`
(a revival-bypass guard on an authenticated write endpoint) had 6 passing helper tests; deleting
the `await import(...)` + call + `if (!allowed) return 422` block from `server/routes.ts` left the
suite green. Filed as its own follow-on (SST-1228) rather than fixed same-session, matching the
SST-1198→SST-1211 precedent — closing the helper and closing the wire are legitimately separable
units of work, not one fix pretending to be two.

On 2c: changing `chooseTopRecommendation(recommendations, archetype)` to pass `null` —
leaving the selector and all 30 of its tests untouched and correct — **compiled cleanly
and passed 109/109**. The whole slice becomes a silent no-op. Every proof imported the
selector directly, which is exactly the blind spot.

Earlier instance, found by hand rather than by mutation: reverting all four call sites of
`computeEntryStatusFromPicks` left **121 tests green** — re-measured 2026-08-01 across the
full elimination/entry unit set, **178 green**. **Now FIXED** on `2026-v1` — find it by SUBJECT,
`git log --format='%h %s' origin/2026-v1 | grep 'SST-1211'` (6 commits), not by hash: the first
write-up cited pre-rebase SHAs a rebase then deleted. ⚠️ Do **not** use `git log --grep=` for this —
it matches the whole message body and returns 8, including SST-1213's own fix `c934083d`. The
function takes the `entry` rather than a droppable `entry.revivals ?? 0`, plus a behaviour guard on
the endpoint's HTTP response.

**Why:** unit tests import the helper and call it themselves, so they supply the argument
the production call site was supposed to supply. They can never observe that wire.

**The mechanism, stated once so it generalises: extraction MOVES coverage, it does not
create it.** Pulling a helper out of a call site and testing the helper reads as strictly
better work and is a coverage regression *at the site*, because the reviewer's eye follows
the new file. All three rows above are this. It is the predictable side effect of the
chokepoint refactors this repo keeps doing correctly — the chokepoint is right, and it
silently relocates where the coverage needs to be. Corollary for tooling: **a mutation pass
that only mutates helpers will report the codebase well-guarded while every caller is
naked.**

**Predict it before you measure it — the disagreement set.** When a fix swaps helper A for
helper B at a call site, that wire is observable ONLY through inputs where A and B return
different values. Enumerate that set first; if no fixture reaches it, the call site is
unguarded at any coverage level, and no amount of added tests elsewhere will change that.

Re-measured on SST-1194 at tip `c50b13b3` (founder-directed review, 2026-08-01): reverting
BOTH call sites to `primaryPickTeam` left **93 files / 1313 tests all passing**. Not a
sampling artefact — `allocatorAssignedTeam` and `primaryPickTeam` return identical values for
every `PickResolution` kind except `'tied'`, and no test in `client/src` renders a cell whose
`planPick` is `{kind:'tied'}`. The suite *could not* have caught it. Line coverage is no
signal here either: the call site executes on every render, so a coverage tool reports it
covered. In the same batch SST-1192's call site WAS guarded (severing it fails 2 of 4) —
solely because its test drives a tied fixture through `buildDistinctEntryPlans`.

**Two sub-shapes, and they need DIFFERENT remedies — don't let one fix read as closing both.**

| | shape | compiles after the defect? | remedy |
|---|---|---|---|
| (a) | **argument omission / upstream reassign** — the call site stops passing a value | yes | change the signature so it's unexpressible (pass `entry`, not `entry.revivals ?? 0`); omission becomes a compile error. The SST-1189 move. **Still needs a behaviour test — see the warning below.** |
| (b) | **same-signature swap** — the call site passes the right argument to the WRONG function | yes, cleanly | signature hardening is **blind** to this. Only a behaviour test through an input where the two collaborators DISAGREE sees it. Nominal/branded return types are the analogue if you want it unexpressible. |

⚠️ **Even for (a), the signature is not sufficient on its own.** Measured on SST-1211: hard-coding
`0` at all four call sites — a real unwiring, same silent-no-op effect as omission — **typechecks
cleanly** and was caught only by the behaviour assertion. Full mutation matrix on that guard:
drop-the-argument → RED; hard-code `0` → **compiles, RED only via behaviour**; revert the helper →
RED; restore the pre-fix call text → `TS2554` ×4; make everything return alive → all three CONTROLs
RED. So the signature is what scales to call sites you cannot mount, and the behaviour test is the
load-bearing guard. Never let a green `tsc` stand in for the second.

SST-1194 is (b): `primaryPickTeam` and `allocatorAssignedTeam` are byte-identical in signature
(`(resolution: PickResolution | null | undefined): string | null`), so there is no argument to
drop. A recommendation of "make omission a compile error" closes (a) and leaves (b) open while
reading as solved — worth saying out loud on SST-1211, which is the standing ticket for the class.

**How to apply:**

1. **After proving a helper, mutate its CALL SITE and re-run.** If nothing goes red, the
   wire is unguarded. Do this before claiming a slice is proven.
1a. **For an A→B swap, first name an input where A and B differ, then confirm a fixture
   builds it.** That is the same discipline as testing-standards rule 7 (the fixture must be
   able to violate the requirement), applied to the wire instead of the assertion.
2. **Prefer a behaviour test over a source grep.** "This method is DB-bound so a
   call-path test isn't reachable" is usually false — SurvivorPulse already does
   `vi.mock('../server/storage')` + drive the real method + assert on mock arguments
   (`tests/collectWeeklyDataBatching.test.ts`,
   `tests/importOddsMatching.test.ts:245`). Spy on the collaborator with
   `vi.fn(actual.fn)` so it delegates, then
   `expect(spy).toHaveBeenCalledWith(expect.anything(), 'max_equity')`.
   Tolerate a throw AFTER the call site (assert the spy was called at all proves you
   reached the wire); a throw BEFORE it leaves the spy uncalled and fails, which is
   correct.
   **This extends to a whole DB-bound ROUTE HANDLER, not just a service method** — demonstrated
   on SST-1211 for `poolEntriesCurrentWeekPickHandler`, asserting on the real HTTP response with
   zero DB. The trick is choosing a fixture that misses the *incidental* queries: make the
   requesting user the pool OWNER so `canParticipateInPool` short-circuits before its `db` call,
   and request a week in which no entry holds a pick so the team-name lookup never fires. Then
   only `storage` needs `vi.mock`, and it runs in the plain unit config. Assert the status is 200
   first — an unmocked method throws, and without that assertion an empty body reads as a pass.
   Runs in `tests/entryStatusCallSiteWiring.sst1211.test.ts`.
3. **A source-shape guard is a fallback, and it is blind to an upstream reassign.**
   Measured: `archetype = null;` inserted before the call leaves the call-site text
   byte-identical — source guard 24/24 green, behaviour guard 3 of 4 red. Keep both
   (source fails faster and more legibly), but never let the source one carry the load
   alone.
   **Second blind spot, measured on SST-1342 (2026-08-16): a source guard cannot see a
   WIRE CUT either, when the call text lives inside the helper.** The SST-1340 AC-8 guard
   asserts `client/src/backtester/lib/assignIndependentPicks.ts` imports
   `@shared/strategyEngine/tieBreak` and contains `sortTiedTeamIds(`. Severing all five
   call sites of the local `resolveTiedWinner` wrapper — leaving the wrapper defined,
   imported and calling `sortTiedTeamIds` inside its own body — kept BOTH source
   assertions green while **10 behavioural tests went red**. The guard proved the text
   exists; nothing proved anything calls it. Generalises: whenever the shared rule is
   reached through a local wrapper, the source guard's target is the WRAPPER's body, not
   the wire, so it degrades from weak evidence to none. Full revert of the same file
   (the coarser mutation) does fail it — so the guard only looks load-bearing until you
   mutate at the right granularity.
4. **If you do write a source guard, make it POSITIVE.** Assert the correct wire is
   PRESENT (`toContain('…, archetype)')`) — that fails loudly on severing *and* on
   renaming. `not.toContain('…, null)')` goes fail-open the moment anything is renamed.
   Add an anti-vacuity anchor so the scan can't pass by reading nothing (see
   [[feedback_source_scanning_guards_need_three_meta_tests]]).

Full write-up — this class plus the two adjacent ones (one-hop-short; tautology via the
implementation's own helper) and the instrument precision numbers (static scanner 5%,
mutation survivors 33%) — is Part 3 of
`SurvivorPulse/.claude/skills/learned/survivorpulse-tests-that-encode-bugs.md`, commit
`b2c9c5d4`.

Related: [[feedback_proving_a_test_is_load_bearing]],
[[feedback_confirm_the_check_covers_what_you_changed]],
[[feedback_derive_from_the_quantity_the_reader_validates]].
(The `survivorpulse-tests-that-encode-bugs` skill cited above at line 131 is a project skill
file, not a personal memory — no wikilink for it; that plain path is the pointer.)

---

## Recurrence, 2026-08-20 (SST-1416) — the ADDED SIDE EFFECT variant, and it bit the session that had just proved this rule twice

Worth recording because of *when* it happened, not just that it did. In a single
session this rule was demonstrated twice, deliberately and successfully:

- mutating a helper's lock guard killed 6 of 14 (4 helper tests + 2 planner tests,
  the planner deaths proving the planner genuinely called the helper);
- severing ONLY the handler's call into the service turned **8 of 11 wire tests
  red while all 14 pure tests stayed green**.

One commit later, closing a security finding, the same session added admin
audit-logging to a route handler and guarded it by asserting
`res.body.adminOnBehalf` — **the data that FEEDS the side effect, not the side
effect**. Deleting the handler's entire `for (const onBehalf of …) logAuthEvent(…)`
block left **all 14 tests green**, silently restoring the unattributable-delete
state the finding was filed about. Caught only by an independent re-review.

The precedent was already in this repo and went unapplied:
`tests/gameplanClearPicks.sst961.integration.test.ts` records *"removing the whole
logAuthEvent block left all 22 original tests passing."*

**Why this variant hides so well:** with a helper, the missing wire usually shows
as a *wrong value* somewhere. With an added side effect — logging, metrics,
audit records, cache invalidation, notifications — the happy path is **identical
whether the effect fires or not**. The response body is the same. The DB rows are
the same. Nothing observable changes except the thing nobody asserted.

**How to apply, specifically:**

1. **Asserting the INPUT to a side effect is not a wire guard.** `adminOnBehalf`
   in the response proved the service produced the data; it said nothing about
   whether the handler consumed it. Mock the collaborator
   (`vi.mock('../server/authEventLogger')`) and assert the CALL, with its
   arguments.
2. **For any observable effect a fix introduces, delete the producing code and
   confirm something goes red.** This is mechanical, takes two minutes, and is
   the only defence that does not depend on remembering the rule at the moment
   it matters — which is precisely what failed here.
3. **Ordering matters for audit records.** The same fix originally pushed the
   record BEFORE the delete it described, so a failed delete still logged
   "these weeks were cleared" while the rows survived. Record side effects that
   describe a mutation *after* the mutation succeeds.
4. **A wholesale-mocked-storage suite that never mocks the logger is doing real
   DB writes.** `authEventLogger` imports `server/db` and swallows failures in
   its own try/catch, so the noise is invisible. Mocking it fixes the guard and
   the stray write together.

Related: [[feedback_a_helper_can_implement_half_a_rule]],
[[feedback_proving_a_test_is_load_bearing]].
