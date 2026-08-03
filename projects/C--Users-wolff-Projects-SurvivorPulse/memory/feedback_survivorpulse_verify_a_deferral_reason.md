---
name: feedback_survivorpulse_verify_a_deferral_reason
description: "A stated reason for deferring — or a peer session's claim that a check is already done — is a claim to re-test, not a fact to inherit. SST-1124's \"it changes what My Picks displays\" was false; so was a concurrent session's \"the guardrail meta-tests are already confirmed, just spot-check.\""
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7bee96fe-5ff1-4875-ae75-e19361b3ff63
  modified: 2026-07-31T05:06:20.663Z
---

SST-1124 left `batch-hub-recommendations` resolving pools for `default-user-id` and recorded why:
changing it "changes what My Picks displays", so it needed live verification rather than a blind
edit. That reason was carried forward verbatim into the follow-up task, which specified a live
check against the deployed dev app because the route short-circuits under `TEST_FAST_OPTIMIZER=1`.

The premise was false. SST-827 had already redirected `/picks` and `/my-picks` to `/game-plan`,
so the only caller is unreachable and tree-shaken — see
[[project_survivorpulse_dead_page_live_redirect_route]]. The fix changes no rendered UI at all. The
deferral had been justified by a UI risk that stopped existing when a *different* story shipped.

**Why:** a deferral reason is a snapshot of the codebase at the moment it was written. Stories
that land afterwards can invalidate it silently — nothing re-opens the earlier ticket to say so.
Inheriting the reason imports a stale world-model and shapes the whole follow-up around the wrong
risk (here: an elaborate live-verification plan for a page nobody can open).

## The cross-session variant: "already confirmed, just spot-check"

Same failure, different source. During the SST-1124→SST-1139 comment sweep, the originating session
wrote that the surviving repo-wide auth guardrail had *already* been confirmed to keep its
prose meta-test and its multi-line-registration meta-test, and that the sweep could "treat it as
satisfied and just spot-check." It was not satisfied. Of the two competing replacements,
`tests/apiRoutesRequireAuthGuard.test.ts` had **no** prose meta-test at all — its header described
that exact failure mode and then never pinned it — and its per-line regex could not see the
multi-line `app.post(` registration of the real Stripe handler in `server/index.ts`, so its own
"scans server/index.ts too" assertion passed on the single-line 503 stub alone. Only
`tests/routesRequireAuthGuard.test.ts` had both. The claim was true of one file and asserted of
both.

**Why:** concurrent sessions summarize each other's work from partial visibility, and a summary
hardens into fact as it is relayed. "Another session confirmed it" carries the *form* of
verification with none of the evidence, and it arrives exactly when re-checking feels redundant.
The specific thing being waved through here was a guard against source-text checks being fooled by
prose — see [[feedback_source_scanning_guards_need_three_meta_tests]] — i.e. the check whose whole
purpose is to not take text at its word was about to be accepted on someone's word.

**How to apply:** when a peer session says a verification is done, treat it as a pointer to *where*
to look, never as the result. Open the artifact. This is cheap — reading two test files took one
step. Distrust it hardest when the claim covers several files ("both guardrails have X"): the
claim is usually true of the one they wrote and assumed of the rest. Report the divergence back to
the sessions that can act on it rather than only to the founder.

**How to apply:** when a ticket, commit message, or code comment says a change was deferred
*because* of some consequence, spend one step confirming the consequence still exists before
planning around it. Cheapest checks, in order: is the caller reachable (grep the router for
redirects on its path), does the string survive into a built bundle, does the route respond at
runtime. Report the finding explicitly — "the stated blocker no longer holds" is a result, and it
changes severity and scope. Same family as
[[feedback_survivorpulse_fetch_and_search_before_work]] and
[[feedback_check_distribution_before_inferring_convention]]: verify the premise, don't sample it.
