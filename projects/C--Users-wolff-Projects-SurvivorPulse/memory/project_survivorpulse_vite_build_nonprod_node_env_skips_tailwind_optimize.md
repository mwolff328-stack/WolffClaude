---
name: project_survivorpulse_vite_build_nonprod_node_env_skips_tailwind_optimize
description: "`vite build` under NODE_ENV != production hard-fails on ANY invalid CSS Tailwind emits, because @tailwindcss/postcss skips its error-recovering optimize() and Vite's own lightningcss minify is strict. SST-1703."
metadata: 
  node_type: memory
  type: project
  originSessionId: bec00866-48ad-4e2d-881d-e00be3692c17
  modified: 2026-09-20T17:12:27.217Z
---

**The "sometimes" build failure is `NODE_ENV`, not the file you last edited.** SST-1703 (2026-09-20):
a bare `npx vite build` threw `[lightningcss minify] Unexpected token Ident("th")` on some runs and
only warned on others. Reproduced deterministically on an UNTOUCHED tree with
`NODE_ENV=development` or `NODE_ENV=test`; `NODE_ENV` unset (Vite then sets production) passes.

**Why:** Tailwind runs ONLY through `postcss.config.js` (`@tailwindcss/postcss`) — `vite.config.ts`
does not load `@tailwindcss/vite`. That plugin calls `optimize()` (lightningcss WITH errorRecovery,
so invalid rules are dropped with a warning) only when `NODE_ENV === "production"`. Otherwise the raw
CSS goes to Vite's `minifyCSS`, which calls lightningcss WITHOUT errorRecovery and throws. So a
production build can carry silently-dropped invalid rules (dead CSS) that a dev/test-env build turns
into a hard failure. `npm run build` (`scripts/build-v1.js`) forces `NODE_ENV=production`, so the
Replit publish path is safe; bare `npx vite build` in a shell that exported `NODE_ENV=development`
(common after running the API) is not.

**How to apply:**
- A `vite build` "Found N warnings while optimizing generated CSS" notice in a PRODUCTION build is a
  real defect: those rules are being dropped. Don't accept the warning as noise.
- If a build hard-fails intermittently, `echo $NODE_ENV` before theorizing about candidate sets or
  which class you edited. Two agents in a shell with `NODE_ENV=development` exported blamed a
  one-class `toast.tsx` deletion.
- Vite nests its OWN lightningcss (1.33.0 vs Tailwind's hoisted 1.32.0). A guard must resolve it FROM
  Vite (`createRequire(require.resolve('vite/package.json'))('lightningcss')`); the guard is
  `tests/indexCssStrictParse.sst1703.test.ts`.
- Tailwind's PostCSS scan base is `process.cwd()` (the repo root), not `client/` — docs, tests and
  notes are all candidate sources.
- `&th` (type selector straight after `&`) is invalid nesting; Tailwind rewrites `&` to `:is(.name)`.
  Re-spelling a dead rule as valid would ACTIVATE it (specificity 0,2,1) — SST-1657's `:where()`
  design depends on `.sp-table` th/td rules staying zero-specificity so `text-center` can win.
- The bug report named the wrong location (the valid `.sp-table` `:where(& th.numeric)` rules); the
  defect was in a separate `@utility numeric` block. See [[feedback_a_groomed_ac_can_assert_a_false_codebase_fact]].
