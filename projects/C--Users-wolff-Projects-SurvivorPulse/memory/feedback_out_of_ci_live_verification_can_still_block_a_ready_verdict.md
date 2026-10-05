---
name: out-of-ci-live-verification-can-still-block-a-ready-verdict
description: "REL-57/58 (2026-09-30) -- a concurrent build session's own unresolved live/manual verification check (not CI) justified a NOT READY verdict even though the automated CI gate was fully green, until the session confirmed it with a re-run."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 45ac0a60-925d-4cba-9dea-987a4e92efce
  modified: 2026-10-01T12:47:56.244Z
---

A green automated CI gate (unit shards, e2e, pre-publish) is not the only thing that can justify a NOT READY ship verdict. A concurrent build session's own **manual/live verification step that sits outside CI** can be an open question just as blocking as a CI red, if that session's own QA has explicitly logged it as unresolved ("result to follow") rather than confirmed.

**Why:** SST-1772 (Back Tester Hub) landed with fully green CI on REL-57's tip, but Vlad (the story's own QA) had run `e2e/mobile-se17.spec.ts` live against the deployed dev app -- a pinned suite the Pre-Publish Gate never runs -- and gotten 21/76 failures. The pinned assertion the story actually cared about passed, and the 21 failures matched a known shared-dev-container load-flake signature (documented in the `sp-live-verify` skill), but Vlad had explicitly started a confirming single-threaded re-run and said "result to follow," not "confirmed clean." Filing READY at that point would have substituted this role's own judgment for a diagnosis the story's own QA hadn't finished proving -- exactly the thing [[feedback_survivorpulse_tests_that_encode_bugs]]-style rules warn against ("a red -- even one you're confident is a diagnosed flake -- is not resolved until proven"). One cycle later (REL-58), the re-run came back 4/76 failures with zero code changes in between, concretely confirming the flake theory, and the verdict flipped to READY with that proof cited.

**How to apply:** When auditing a window, check not just the CI gate but the dominant story's own comment thread for any self-described "result pending" / "re-running to confirm" state, especially on security- or gating-sensitive stories. If the story's own QA process has an open question about its own work, don't resolve it yourself by re-reading the diagnosis and calling it good -- wait for that session's own confirmation (or let the founder decide to proceed anyway). This is a narrower, more specific case than the general "any CI red blocks" rule: it extends to live-verification steps that live entirely outside the automated gate.
