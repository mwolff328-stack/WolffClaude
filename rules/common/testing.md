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

A test written AFTER the code, by the implementer, describing what the code DOES rather than what the requirement SAYS, is a snapshot — not a specification — and is structurally incapable of catching the bug it was written next to. Such a test is worse than none: it certifies the defect and gives false confidence. This failure mode recurred **three times in one effort** (see `learned/survivorpulse-tests-that-encode-bugs.md`), and every real defect was caught by a live smoke or by reading code, never by a green suite.

Enforce these to prevent it:

1. **Failing-first is the only proof.** Any test claiming to guard a behavior MUST be demonstrated RED against the broken state before it lands — revert the fix (`git show HEAD:path` swap), run, capture the actual failure output, restore, show the pass. Report both. A test that has never failed proves nothing. ("A scan that has never failed isn't a tripwire.")
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
