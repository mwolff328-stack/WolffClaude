---
name: project_survivorpulse_wouter_redirect_chain_trap
description: "In SurvivorPulse's wouter router, a Redirect whose target is itself a Redirect silently renders a blank page"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6c0b78b2-4eb7-4add-9f6a-e7faf86d6562
  modified: 2026-07-29T04:53:52.931Z
---

In `client/src/router-v1.tsx` (wouter 3.x), a `<Redirect to="/x">` where `/x` is *itself* a redirect route **dead-ends on a blank page** — no error, no console warning, the route just renders `null`.

**Mechanism:** wouter's `<Switch>` selects the matching child with `cloneElement(element, { match })` and **no `key`**, so React reconciles the outgoing and incoming `<Redirect>` as the same element (same type/position) and reuses the instance. `<Redirect>` navigates from a `useIsomorphicLayoutEffect(() => redirect(), [])` with an **empty dep array**, which never re-fires on a reused instance. The second hop never happens.

A single-hop redirect works only because the previously-rendered element was a *different* component type, forcing the remount that fires the effect.

**Rule:** every `<Redirect>` must point at its FINAL destination, never at another redirect. This shipped and blanked `/week`, `/strategy`, and `/pools/:poolId/entries/:entryId/picks` (all → `/picks` → `/game-plan`), plus `/backtester` in production builds only.

**Tripwire:** `tests/router-redirect-chain.tripwire.test.ts` fails the build if any redirect targets a pure-redirect route.
