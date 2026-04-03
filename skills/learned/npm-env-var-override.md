# npm Scripts Silently Override Exported Shell Env Vars

**Extracted:** 2026-03-30
**Context:** Shell scripts that set env vars and then delegate to npm scripts

## Problem
When a shell script exports an env var and then calls `npm run <script>`, the npm
script's inline `KEY=value` prefix overrides the exported value — silently and
completely. The exported value never reaches the underlying command.

```bash
# shell script
export TEST_DISABLE_NETWORK=0
npm run test:unit  # → package.json: "NODE_ENV=test TEST_DISABLE_NETWORK=1 vitest ..."
                   # TEST_DISABLE_NETWORK is 1, not 0
```

## Solution
Call the underlying command directly instead of through npm scripts, so the
exported env vars take effect.

```bash
# Instead of:
npm run test:unit

# Do this:
NODE_ENV=test TEST_FAST_OPTIMIZER=1 npx vitest run --config vitest.config.ts
# (omit TEST_DISABLE_NETWORK — the exported value now applies)
```

If some suites intentionally need a different value, set it explicitly inline
for those suites only:

```bash
# Unit tests: force network off
NODE_ENV=test TEST_DISABLE_NETWORK=1 TEST_FAST_OPTIMIZER=1 npx vitest run --config vitest.config.ts

# Integration tests: inherit TEST_DISABLE_NETWORK=0 from export
NODE_ENV=test TEST_FAST_OPTIMIZER=1 npx vitest run --config vitest.integration.config.ts
```

## When to Use
- Any shell script that exports env vars and then calls `npm run *`
- CI/CD scripts that need to override env vars set inside package.json scripts
- Pre-publish or pre-deploy scripts with env-controlled behavior per suite
