---
name: project_survivorpulse_login_next_param_is_same_origin_only
description: "login.tsx's ?next= return URL is same-origin only — wouter navigate() is pushState, which throws SecurityError cross-origin and surfaces as a generic sign-in error."
metadata: 
  node_type: memory
  type: project
  originSessionId: 8dedbdc5-b53d-4319-b5c6-229929f7edb8
  modified: 2026-07-29T15:24:05.024Z
---

`client/src/pages/login.tsx` reads the post-sign-in return URL from **`?next=`** (not
`?redirect=`) and hands it to wouter's `navigate()`. In wouter 3.10.0 that is literally:

```js
export const navigate = (to, { replace = false, state = null } = {}) =>
  history[replace ? "replaceState" : "pushState"](state, "", to);
```

`history.pushState` **throws `SecurityError` when the URL's origin differs from the
document's** (HTML spec). So a cross-origin `next=` cannot work.

Worse, the `navigate(redirectTo)` call sits **inside the sign-in `try` block**, so the
throw is swallowed by `catch` and rendered as `SIGNIN_UNEXPECTED_ERROR`. The failure mode
is: *the user is genuinely signed in, but sees a generic "unexpected error"* — the auth
succeeded and only the redirect blew up. Do not read that error as an auth failure.

This blocks any **hand-off back to a separately-deployed surface** — e.g. the CMEA
backtester prototype (`survivorpulse-backtester-prototype.replit.app`), a different origin
from `survivorpulse.com`. Fixing it needs `window.location.href` for off-origin targets
**plus an origin allowlist** — an unvalidated absolute `next=` is an open redirect. Don't
"just make it work" by passing the raw param through; that is the vulnerability.

Related: [[project_survivorpulse_wouter_redirect_chain_trap]],
[[project_survivorpulse_stale_spa_bundle_after_publish]]
