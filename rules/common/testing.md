# Testing Requirements

## Minimum Test Coverage: 80%

Test Types (ALL required):
1. **Unit Tests** - Individual functions, utilities, components
2. **Integration Tests** - API endpoints, database operations
3. **E2E Tests** - Critical user flows (framework chosen per language)

## Test-Driven Development

MANDATORY workflow:
1. Write test first (RED)
2. Run test - it should FAIL
3. Write minimal implementation (GREEN)
4. Run test - it should PASS
5. Refactor (IMPROVE)
6. Verify coverage (80%+)

## Tests Specify, They Don't Describe

A test written AFTER the code, by the implementer, describing what the code DOES rather than what the requirement SAYS, is a snapshot — not a specification — and is structurally incapable of catching the bug it was written next to. Such a test is worse than none: it certifies the defect and gives false confidence. This failure mode has recurred repeatedly — see `learned/survivorpulse-tests-that-encode-bugs.md` for the full case file — and every real defect was caught by a live smoke or by reading code, never by a green suite.

Enforce these to prevent it:

1. **Failing-first is the only proof.** Any test claiming to guard a behavior MUST be demonstrated RED before it lands: revert, run, capture the actual failure output, restore, show the pass. Report both. A test that has never failed proves nothing. ("A scan that has never failed isn't a tripwire.")

   Getting the revert *right* is most of the work, because a botched revert produces a green run that reads exactly like a weak test:
   - **Commit the fix first, then revert against `HEAD~1`** (`git show HEAD~1:<path> > <path>`). `git stash push` stashes the diff against HEAD, so once the fix IS HEAD it reverts nothing and the RED run comes back green. Conversely `git checkout -- <path>` restores TO HEAD, so on an *uncommitted* fix the "restore" silently destroys the work.
   - **Always print a one-line invariant** — a `grep -c` for a token the fix introduces — proving the revert actually happened. A RED run that comes back green means the revert failed, not that the test is weak.
   - **Revert to the closest WRONG implementation, not merely the pre-fix state.** An assertion only ever evaluated against correct code has never had its comparison operator, threshold, or direction tested — `paddingTop > icon.top` was satisfied by `7 > 5`, i.e. by the exact bug it targeted.
2. **Bug-fix flow audits existing tests in that area for ones encoding the bug** — a required checklist step, not a hope. Fix the test to assert the requirement; NEVER bend the code to satisfy a wrong test.
3. **Test names state the requirement, not the mechanism.** `"each week receives its own recommended team"` (requirement) — not `"computes week numbers as startWeek + offset"` (mechanism). A mechanism-named test is a review smell: it can only describe the implementation back to itself.
4. **Characterization tests (pinning current behavior) MUST be labeled as such.** Unlabeled characterization is the core disease — a snapshot masquerading as a spec. Labeling makes the distinction reviewable.
5. **Implementer-added tests trace to an AC**, or they are characterization tests (label them). Test Cases authored from ACs at grooming — before code exists — cannot describe an implementation that isn't written yet; that instrument works. The failures all came from tests added LATER, alongside the code.
6. **Assert where the truth lives.** The bugs that hid best were invisible in the UI (a reset that silently re-confirmed; a stale confirmation row; non-distinct submitted picks). A UI assertion cannot prove those — query the DB / the real layer. Asserting only that an operation "happened" (`outcome === 'written'`) without checking the state it produced is how defects ship. ("Not proof it's fine, proof nobody has looked.")

## Troubleshooting Test Failures

1. Use **tdd-guide** agent
2. Check test isolation
3. Verify mocks are correct
4. Fix implementation, not tests (unless tests are wrong)

## Agent Support

- **tdd-guide** - Use PROACTIVELY for new features, enforces write-tests-first
