---
name: survivorpulse-tsc-excludes-tests-directory
description: "tsconfig.json's include list is only client/src, shared, server — the top-level tests/ directory is never typechecked by npx tsc --noEmit / npm run check, regardless of file extension."
metadata: 
  node_type: memory
  type: project
  originSessionId: fd2a6533-9f56-4aba-bc36-5e4f6343c6e7
  modified: 2026-09-02T00:09:14.115Z
---

`tsconfig.json`: `"include": ["client/src/**/*", "shared/**/*", "server/**/*"]`, `"exclude": ["node_modules", "build", "dist", "**/*.test.ts"]`. The top-level `tests/` directory (where most unit/integration test files live) is **not in `include` at all** — `npx tsc --noEmit` silently skips every file there, `.test.ts` or not. Confirmed via `npx tsc -p tsconfig.json --listFilesOnly | grep -c "/tests/"` → `0`.

Two consequences that aren't obvious from a green `npm run check`:
- A real TypeScript type error inside a file under `tests/` will never be caught by `npm run check` — only by whatever vitest's esbuild transpilation happens to catch at runtime (which doesn't type-check, just strips types), or not at all.
- The `exclude` pattern `**/*.test.ts` doesn't match `**/*.test.tsx` — a `.tsx` test file *under `client/src/**`* (e.g. `client/src/pages/__tests__/my-home.test.tsx`) **is** typechecked, while a `.ts` or `.tsx` file directly under top-level `tests/` never is, regardless of extension. This asymmetry is easy to miss: two test files that look equivalent get different real enforcement depending only on which directory they live in.

**Why this matters:** a type-level "does this really enforce X" claim (e.g. "adding a field to a canonical type breaks the build unless callers update") can only be trusted if the actual enforcing file lives under `client/src/`, `shared/`, or `server/` — a compile-probe placed in `tests/` is decorative no matter how correct its logic looks, because `npm run check` never reads it. See [[feedback_survivorpulse_source_text_guards_fooled_by_text]] for the related but distinct problem of source-scanning guards being fooled by comments.

**⚠️ `e2e/` is the EXCEPTION — do not generalise "outside `include` means unchecked" to it (verified 2026-09-01).** `npm run check` chains `check:e2e`, which runs `tsc --noEmit -p tsconfig.e2e.json`, and that config's `include` is `e2e/**/*.ts`, `shared/**/*.ts` plus `scripts/seed-e2e.ts`, `scripts/seedE2eData.ts`, `scripts/cleanup-e2e-fixtures.ts`, `scripts/capture-e2e-baseline.ts` and `scripts/lib/**`. It was added by SST-1117 for exactly this reason (a missing import landed in `e2e/fixtures.setup.ts`). So a new Playwright spec IS typechecked by `npm run check`, including its cross-directory imports of `server/` and `client/src/` modules. Reasoning from the main `tsconfig.json` alone leads to building a throwaway config that already exists — confirm coverage with `npx tsc --noEmit -p tsconfig.e2e.json --listFiles | grep <yourfile>` instead of inferring from `include`. `tests/` remains genuinely unchecked; the gap is directory-specific, not "everything outside the main include".

**How to apply:** before claiming "`npm run check` would catch a regression here," check the file's path against `tsconfig.json`'s actual `include`/`exclude` (not just its own vitest config, which has separate rules) — a file in `tests/` needs a different enforcement mechanism (a source-shape guard, or a check on the real `client/src`/`server` files that consume it) to have any real teeth.
