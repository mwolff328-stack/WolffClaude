---
name: pre-deploy
description: Run the full SurvivorPulse pre-publish test suite and return a SHIP / DO NOT SHIP verdict before any Replit production deployment.
triggers:
  - /pre-deploy
  - "run pre-publish"
  - "ready to deploy"
  - "pre-deploy check"
---

# Pre-Deploy: Full Pre-Publish Test Suite

You are running the SurvivorPulse pre-deployment gate. Follow every step exactly. No skipping. No parallelism.

## Environment

Before running any command, confirm these env vars are set for the process:

| Variable | Value | Purpose |
|---|---|---|
| `RUN_HTTP_INTEGRATION_TESTS` | `1` | Enable HTTP integration tests |
| `RUN_DB_REGRESSION_TESTS` | `1` | Run regression tests against live database |
| `TEST_DISABLE_NETWORK` | `0` | Allow network access during tests |
| `RUN_SIGNUP_EDGE_CASES` | `0` | Skip signup edge case tests |

These are injected automatically by `scripts/pre-publish-check.sh`.

## Execution

Run this single command. It handles all env vars and sequencing internally:

```bash
npm run test:prepublish
```

This executes in order:
1. `npm run test:unit`
2. `npm run test:integration`
3. `npm run test:e2e:project`
4. `npm run test:regression:project`

**If any suite fails, the script stops immediately. Do not proceed.**

## Reporting

After the run completes (or fails), report back with:

### Per-Suite Status Table

| Suite | Status | Test Count | Notes |
|---|---|---|---|
| Unit Tests | ✅ PASS / ❌ FAIL | N | |
| Integration Tests | ✅ PASS / ❌ FAIL | N | |
| E2E Tests | ✅ PASS / ❌ FAIL | N | |
| Regression Tests | ✅ PASS / ❌ FAIL | N | |

### Failures (if any)

For each failure, list:
- **File**: `tests/path/to/file.test.ts`
- **Test**: exact test name
- **Error**: first meaningful error line

### Final Verdict

```
🚢  SHIP     — all suites passed
🚫  DO NOT SHIP — one or more suites failed
```

## Rules

- Do not skip any suite
- Do not run suites in parallel
- Stop and report on first failure; do not continue to the next suite
- Never modify test files to make tests pass
- Never suppress or filter test output
