---
name: feedback-tests-that-pass-by-winning-an-animation-race
description: "An assertion made right after a click that unmounts its target can pass purely by resolving inside the exit animation — green on an idle machine, red under load, and never actually verifying its own name."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 29ab28e5-1bde-4292-b74b-031f40ea1c5c
  modified: 2026-07-31T07:54:00.034Z
---

`e2e/sf4-my-pools.spec.ts` UC-4.7-A asserted that clicking "Discard changes"
reverts the pool-name field. The product **always closes the modal** on that
click. The test passed anyway for months, because Radix keeps `DialogContent`
mounted for the exit animation (`dialog.tsx` carries `duration-200` +
`data-[state=closed]:animate-out`) — so for ~200ms the input still exists holding
the reverted value, and the assertion resolves inside that window on an idle
machine. Under CI shard load it loses the race and reports
"element(s) not found", which reads as a flake and is not one.

**The tell:** an assertion immediately after an action that unmounts its target,
where the target lives inside an animated container. Green locally, red under
load, no source change in the failing path. Before calling it a flake, check
`git log <lastGreenSha>..HEAD -- <the component file>` — zero commits means the
behaviour never changed and the TEST is the conditional thing, not the product.

**Do not "fix" it by awaiting the animation or raising the timeout.** That
re-cements the accident and re-hides the disagreement between test and
implementation. Assert something observable *after* the transition completes
instead (here: the breadcrumb still showing the original name).

**The product anti-pattern underneath it.** One button whose LABEL is
conditional while its HANDLER is not:

```jsx
<Button onClick={() => { cancel(); setOpen(false); }}>
  {isDirty ? "Discard changes" : "Close"}
</Button>
```

Two different promises ("revert and stay" vs "dismiss") rendered by one
unconditional action. Whoever writes the test reads the label and encodes the
promise; the code does the other thing. Surface it as a product question rather
than picking a side inside a flake fix.

Related: the `sp-live-verify` skill,
[[project_survivorpulse_radix_outside_click_arming_race]],
[[feedback_proving_a_flake_fix_without_reproducing_it]],
[[project_survivorpulse_e2e_ci_drift_traps]]
