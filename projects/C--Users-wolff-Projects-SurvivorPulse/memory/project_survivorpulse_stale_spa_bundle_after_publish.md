---
name: project_survivorpulse_stale_spa_bundle_after_publish
description: A UI symptom reported right after a Replit publish is often the previous bundle still running in an open tab — read the deployed JS before debugging the code.
metadata: 
  node_type: memory
  type: project
  originSessionId: 606235bf-b91b-432d-b211-7da816a9d0aa
  modified: 2026-07-31T17:04:21.045Z
---

SurvivorPulse is a single-page app. A tab opened **before** a publish keeps the old
JavaScript in memory; wouter navigations are client-side, so signing in or moving around
runs stale code with no reload. `Cache-Control: private, max-age=0` on prod means a hard
refresh fixes it, but nothing forces one.

**2026-07-29:** the paywall was reported still showing on prod right after the open-access
publish. It was the old bundle in an already-open tab — the deployed code was correct.

**Diagnose from the deployed artifact, not the repo**, before touching anything:

```bash
curl -s https://survivorpulse.com/ | grep -oE '/assets/index-[A-Za-z0-9_-]+\.js'
curl -s https://survivorpulse.com/assets/index-XXXX.js > /tmp/prod.js
grep -c "some-new-string" /tmp/prod.js          # is my change in the shipped bundle?
grep -oE '.{80}/api/me/subscription.{200}' /tmp/prod.js   # read the COMPILED logic
```

Compile-time constants are inlined, so the gate is directly readable: open access compiled
to `return{isActive:!0,...}`, and the paywall had exactly one render site behind
`isAdmin||isTestUser||isActive` — provably unreachable. Client-only strings (`open_access`
is server-side) will be absent from the bundle; don't read that as a missing deploy.

Also: prod serves the **client build only** in the bundle — a client change can be live
while a server change needs the same publish. Both ship together on Replit.

**The same grep answers the inverse question: "is this actually user-facing?"** Source
containing a bug does not mean the bug ships. **2026-07-29:** a dead `/sign-in` link was
reported as live on the backtester prototype; the deployed bundle had **0** matches for
`sign-in` *and* for the CTA's own button text, because the landing component had no
importers in either repo and Vite tree-shook it. Grep the bundle for a **string unique to
the component** (button copy beats a URL — the URL may appear via another module) before
accepting that a source-level defect reaches users.

**The `Published your App` commit is NOT the publish.** Replit lands an empty marker
commit on `2026-v1` under author `Replit Agent`, but it is written per publish *event* and
lags the real deploy — so ancestry against it is not evidence. **2026-07-31:** the marker
sat at 15:40 UTC, three of my commits landed 16:04–16:55, and I concluded from
`git merge-base --is-ancestor` that the last ticket had missed the publish. It hadn't: the
founder published again, and all four of that ticket's client strings were in the live
bundle. The marker was a *previous* publish that day.

**So: grep the deployed artifact; never infer prod contents from git.** Two corollaries —
pick a marker that can actually appear where you're looking (a server-only symbol like
`pickedTeamsBeforeWeek` is absent from a *client* bundle no matter what shipped, so its
absence proves nothing), and verify server-side changes with a live request instead
(SST-1139's guards showed as `401` on `/api/optimizer/*` unauthenticated, with a public
route still `200` as the control).

Related: [[project_survivorpulse_open_access_mode]],
[[project_survivorpulse_production_smoke_access]],
[[project_survivorpulse_login_next_param_is_same_origin_only]]
