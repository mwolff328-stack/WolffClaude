---
name: project_survivorpulse_radix_outside_click_arming_race
description: "Radix arms its outside-click dismissal in a deferred macrotask, so a blind E2E click on a dialog overlay is silently dropped — the flake source behind the legal-interstitial test"
metadata: 
  node_type: memory
  type: project
  originSessionId: 41fa3408-6982-4ba7-b81f-d4d95c174366
  modified: 2026-07-30T18:09:42.242Z
---

`@radix-ui/react-dismissable-layer` (1.1.19, `usePointerDownOutside`) arms the outside-click
listener **inside a deferred macrotask**:

```js
const timerId = window.setTimeout(() => {
  ownerDocument.addEventListener("pointerdown", handlePointerDown);
}, 0);
```

Deliberate — it stops the pointerdown that OPENS a layer from immediately closing it. The
consequence for tests: **a pointerdown arriving before the listener is armed is dropped in
silence.** No dismissal, no error, the dialog just stays `data-state="open"` until the
assertion times out. Radix exposes no "armed" signal, by design.

**How it presents in CI.** `expect(locator).not.toBeVisible()` times out and the call log shows
every poll resolving to `data-state="open"` — i.e. the dialog never *began* closing. That
distinguishes it from an animation/transition artifact, where the state would be `"closed"`.
It is timing-sensitive, so it flakes: caught once in run 30564645399, and it passed on retry.
`await expect(modal).toBeVisible()` is NOT enough of a gate — it resolves on the React commit,
which can precede the passive effect that queues the arming timer.

**The fix pattern** (e2e/legal-interstitial-modals.spec.ts, commit `f0827e74`): poll the click
rather than firing it once, and click the overlay **as an element**, not at bare coordinates —
`page.getByTestId("dialog-overlay").click({ position: { x: 5, y: 5 } })` inside
`expect(async () => {…}).toPass()`. Locator clicks hit-test the point, so an occluding element
reports "subtree intercepts pointer events" instead of a mute timeout (cf.
[[project_survivorpulse_fixed_position_inside_dialog]]). `data-testid="dialog-overlay"` lives on
the shared `DialogOverlay` in `client/src/components/ui/dialog.tsx`. Polling does not weaken the
assertion — a genuinely broken dismissal fails every attempt.

**Proving it without reproducing the CI timing.** A fast dev box will not flake (45/45 passed),
and CPU throttling does not reproduce it either. Model the failure CONDITION instead of its
cause: `addInitScript` a patch that defers registration of the `pointerdown` listener by N ms.
The old form then fails 3/3 with the exact CI signature and the new form passes 3/3; setting N
to "never" proves the new form still goes red on a real regression. See
[[feedback_proving_a_test_is_load_bearing]].

**Only Radix layers are exposed.** The hand-rolled drawers (`MobileToolsDrawer`,
`MobileAccountDrawer`) put a plain React `onClick` on the scrim, attached at mount — the two
blind outside-click tests in `e2e/mobile-se17.spec.ts` are not at risk.
