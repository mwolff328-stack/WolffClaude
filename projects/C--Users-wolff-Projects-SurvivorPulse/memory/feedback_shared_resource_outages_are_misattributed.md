---
name: feedback_shared_resource_outages_are_misattributed
description: "An outage YOU cause on the shared dev app gets diagnosed by a different session, which correctly rules out its own causes and lands on the wrong one. Announce your load; throttle workers; yield the window."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 60ee45d3-9224-433b-9277-eea5ce775ae9
  modified: 2026-08-02T07:16:16.719Z
---

2026-08-02. I ran the full 331-spec Playwright suite at **4 workers** against the deployed dev app (`*.replit.dev`) and took the container down — the knockout `sp-live-verify` §7 already documents. What was new was the *diagnosis*.

A concurrent session (`local_33ac3128`) hit the 502s and investigated well: 7 probes over ~2.5 min on `/` and `/api/me`, plus controls showing `survivorpulse-beta.replit.app` and `survivorpulse.com` both 200 at the same moment. It correctly concluded "not my network, not Replit generally." Then it explicitly **ruled out the unthrottled-workers cause on the grounds that it had not run Playwright that session** — true, and irrelevant, because I had. Its leading hypothesis became "the Replit preview hostname is stale and has rotated." It was about to chase a URL that was correct.

**The generalisable trap: on a shared resource, the evidence available to the observer systematically excludes the cause.** Every check that session ran was sound. The one fact that explained everything was invisible from where it stood, and its most careful reasoning step — eliminating a cause by checking its own behaviour — is exactly the step that misled it. This is not a diagnosis-quality problem; it is a visibility problem, and it is only fixable from the side generating the load.

**How to apply:**

1. **Throttle before you run.** `PLAYWRIGHT_WORKERS=2` against the deployed dev app. The config defaults to auto locally (`workers: … : undefined`), which is what knocks it over. Add `--retries=1` so a transient 502 self-corrects rather than reading as a real failure.
2. **Announce a long run to live neighbours BEFORE starting it**, not after they report symptoms. One `send_message` naming the host, the worker count and the expected duration converts a mystery outage into a known one.
3. **Yield the window for a short run.** Their 6-spec pass vs my 331-spec suite: sequential beat both of us failing, and cost me ~2 minutes of progress. Stop, hand over, restart.
4. **When a neighbour reports an outage, check whether YOU are the cause before helping them theorise.** My first instinct was to look for a fresher URL. The right first move was `wc -c` on my own run log.
5. **It self-heals.** Measured: 502 → 404 → 200 about 80 seconds after the load stopped. Don't escalate, don't restart anything, don't declare the URL dead — stop the load and probe for ~2 minutes.

**Corollary for reading failures.** Failures accumulating *as a long run progresses* is the signature of container degradation, not of a code defect — the first specs pass and the later ones fail. Two tells that confirm it rather than assuming it: page snapshots containing only the Replit development-preview banner (the app never rendered), and a direct `curl` mid-run. A run whose environment collapsed underneath it is not evidence about your change in either direction — say so instead of triaging its failures.

Related: [[project_survivorpulse_playwright_ci_evidence_traps]] for narrowed-run and reporter traps, and [[feedback_never_pkill_by_shared_entry_point]] for the other way concurrent sessions damage each other.
