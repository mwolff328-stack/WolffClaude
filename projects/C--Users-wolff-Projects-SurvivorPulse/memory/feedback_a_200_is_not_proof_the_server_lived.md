---
name: feedback_a_200_is_not_proof_the_server_lived
description: "A server can serve a 200 and then die — status-code-only probes read green, and the exit code that proves it gets explained away as a port conflict."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f8c8a42e-f441-4153-aff9-4a83881d1a26
  modified: 2026-08-02T02:20:48.302Z
---

2026-07-31. I reported that a local recipe "fixed the SPA-404 trap outright" on the
strength of `GET /pools` → 200. A peer session reproduced it and found the server
`process.exit(1)`s moments **after** serving that 200. My claim was wrong and had
already reached the founder as "this unblocks local UI work today."

**Why:** `curl -o /dev/null -w "%{http_code}"` answers "did something respond
once," never "is the process still alive." When the crash is triggered *by* the
request being measured, the measurement always reads green — the probe and the
defect are causally linked, so the check can literally never fail.

**Why I missed it despite having the evidence.** The backgrounded server reported
**"failed with exit code 1"** and I attributed it to a port conflict without
checking. A second signal — a preview-managed run that vanished — I filed as
tooling flakiness. Both were the same crash. Two independent contrary signals,
each individually explained away with a plausible story I never tested. That is
the actual failure: not a weak probe, but a narrative absorbing its own
counter-evidence.

**How to apply:**
1. For any "the server works now" claim, probe **twice with a gap** and assert the
   process is still listening on the second. Grab the body, not just the status —
   a 200 carrying an unrendered shell is not a working page.
2. Read the boot log for the window AFTER the successful response, not just the
   startup banner. The error that kills a process arrives late by definition.
3. **A non-zero exit code is evidence, not noise.** If a claim requires explaining
   away a failure signal, the explanation must be tested before the claim ships.
   "Probably a port conflict" is a hypothesis, and `netstat` costs one line.
4. When a peer session says it reproduced your result and got a different answer,
   re-run the exact case they could not cover before defending anything. Here they
   flagged that they hadn't tested from a dot-segment worktree path; that was my
   burden and it confirmed their finding, not mine.

Same family as the `sp-live-verify` skill (frozen
animations produce identical, convincing, wrong measurements) and
[[project_survivorpulse_stale_spa_bundle_after_publish]]. The SurvivorPulse-specific
trap lives in the `sp-live-verify` skill.

## The SPA fallback turns a malformed API call into a convincing 200

2026-08-02, same disease on the **write** side, where it is worse. Deleting one E2E pool with
`curl -X DELETE "$ORIGIN/api/pools/$ID"` where `$ID` had silently come back **empty** returned
**HTTP 200** — because `/api/pools/` (trailing slash, no id) matches no API route and falls
through to the SPA's `index.html`. The status alone reads exactly like a successful delete. The
body was `<!DOCTYPE html>`. A real delete returns `{"message":"Pool deleted successfully"}`.

This is more dangerous than the read-side version because the conclusion drawn is "cleanup
happened" — so a session reports a database left clean while the row is still there, which is the
exact failure mode ([[project_survivorpulse_admin_pool_classification]], SST-1187) that fixture
tagging exists to prevent.

**How to apply:** for any API call built from an interpolated variable, **assert the variable is
non-empty before issuing the request** and refuse rather than send (`[ -n "$ID" ] || exit 1`).
Then verify by **re-reading the collection**, not by trusting the response — count before, count
after. Related: shell extraction failing silently is the usual root cause here, and an empty URL
also produces `http=000`, which reads as "host unreachable" rather than "my variable is empty"
(see [[project_survivorpulse_env_database_url_two_lines]] for the `grep BASE_URL` trap that
produced exactly that).
