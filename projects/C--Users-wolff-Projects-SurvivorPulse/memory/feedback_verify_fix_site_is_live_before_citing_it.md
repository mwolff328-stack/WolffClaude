---
name: feedback_verify_fix_site_is_live_before_citing_it
description: "A file matching a bug's symptom pattern via grep can be entirely unreachable in production (wired only to the frozen V2 router) — confirm live reachability before naming it as the fix site, not just that the code pattern matches."
metadata:
  type: feedback
  node_type: memory
  originSessionId: 650a3b8f-b440-4da6-b014-83009fdf4214
  modified: 2026-08-03T16:59:13.436Z
---

Before filing SST-1253 (top-nav Season Selector missing a season the user had a pool in),
a code-read root-cause pass found the exact missing-`/api/seasons`-invalidation gap in
`client/src/pages/pool-form.tsx`'s pool-creation `onSuccess` handler — plausible, well-evidenced,
written into the ticket's Proposed Resolution. It was wrong. `pool-form.tsx` is wired only into
`client/src/router-v2.tsx`, and V2 returns `410 Gone` in production (`shared/appVersion.ts`) — that
handler never runs live. The real, live fix site was `PoolCreationWizard.tsx`, reached via V1's
router. Two independent triage-panel reviewers (Felix, Vlad), working separately, both caught this
and converged on the same correct file:line without coordinating — a strong corroboration signal,
but it means the *first* pass (mine) had already written the wrong file into a filed ticket.

**Why this is a distinct trap from [[project_survivorpulse_dual_app_entry_trap]]:** that memory is
about a concern needing to be wired into *both* `App.tsx` and `App-v1.tsx` (a symmetry failure —
forgot one of two). This is different: *one specific candidate file* among several
similar-looking, symptom-matching ones is entirely dead in production, and grep has no way to tell
you that — a pattern match in dead code looks identical to a pattern match in live code.

**How to apply:** whenever a code-read identifies a candidate fix file — especially anything under
`client/src/pages/` or `client/src/components/` with an obvious "legacy-looking" or
oddly-duplicated sibling (`pool-form.tsx` next to `pool-wizard/PoolCreationWizard.tsx`,
`Step*.tsx` wizard screens with old and new versions, etc.) — confirm it's actually reachable from
the *live* entry point before writing it into a ticket or a commit: check which router
(`router-v1.tsx` vs `router-v2.tsx`) or `App*.tsx` variant imports it, and cross-check
`shared/appVersion.ts` / `APP_MODE` for whether that variant even serves traffic. A grep hit
proves the *pattern* exists somewhere; it proves nothing about whether that somewhere ships.

Related: [[project_survivorpulse_dual_app_entry_trap]], [[project_survivorpulse_split_route_registration]],
[[feedback_a_doc_saying_code_was_deleted_is_not_evidence]] (same family: a claim about what's live
needs its own verification, not inheritance from a plausible-looking prior).
