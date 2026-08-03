---
name: project-survivorpulse-dual-app-entry-trap
description: "The production build compiles App-v1.tsx, NOT App.tsx — wiring an app-root hook into App.tsx alone ships a bundle without it while every jsdom test stays green."
metadata: 
  node_type: memory
  type: project
  originSessionId: 9506305b-cbe2-42d0-b9b7-09aeddfb687c
  modified: 2026-08-03T23:22:20.157Z
---

SurvivorPulse has **two app roots**, and the one you edit by default is not the one that ships:

- **Dev:** `client/index.html` → `client/src/main.tsx` → `client/src/App.tsx`
- **Production:** `scripts/build-v1.js` swaps in `client/index-v1.html` → `client/src/main-v1.tsx` → **`client/src/App-v1.tsx`**

(There is also an `App-v2.tsx` / `main-v2.tsx` pair for the frozen V2.)

**The `<head>` is a mirror too, not just the React root** (hit 2026-08-03 adding the favicon + OG/Twitter tags). `scripts/build-v1.js:94` literally `copyFileSync(index-v1.html → index.html)` before running vite, then restores the original in a `finally`. So **static `<head>` content — `<title>`, meta description, favicon links, OG/Twitter tags — added to `client/index.html` alone is overwritten at build time and never reaches production**, while local `npm run dev` shows it working perfectly. That is why prod served a bare `<head>` for so long. Add head tags to **both** `client/index.html` and `client/index-v1.html`, and prove it by grepping `dist/public/index.html` after a build, not the source file.

**Why:** anything mounted at the app root — a global hook, a provider, an analytics or SEO side effect — must be added to **both** `App.tsx` and `App-v1.tsx`. Adding it to `App.tsx` only means it works in dev and in every jsdom test (which import the hook directly or render their own tree), while the shipped production bundle silently lacks it. Hit on 2026-07-28 wiring `useCanonicalUrl`; the canonical tag was absent from the real build and nothing in the test suite could see it.

**How to apply:** after adding an app-root concern, verify it reached the built artifact before believing it — `npm run build`, then grep `dist/public/assets/index-*.js` for a distinctive string from the new code, and load the built app in a real browser. Two probes that look decisive but are NOT: `import.meta.env.VITE_APP_MODE === "v2"` guards are dead-code-eliminated so their strings legitimately vanish, and generic Tailwind class strings appear in many files. Pick a literal unique to the new module. `client/src/hooks/__tests__/useCanonicalUrl.test.tsx` carries a source-level tripwire asserting both entries call the hook — copy that pattern for future root-level wiring.

Related: [[project_survivorpulse_max_entries_default_dual_mirror]] (same disease, different mirrors), the sp-live-verify skill, the sp-live-verify skill (the build + `CI_STATIC=1` path used to catch this).
