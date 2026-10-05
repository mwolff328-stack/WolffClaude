---
name: feedback_survivorpulse_repoint_sweep_by_import_misses_tests_that_depend_on_a_module_implicitly
description: SST-1739 C1 push turned the pre-publish gate red on 4 files (10/4): an import-based sweep of "files that mock the old constant" missed tests that never mention it but rely on the real hook short-circuiting; local subsets proved green. Find dependents through the changed module's importers, then let CI shards be the net.
metadata:
  node_type: memory
  type: feedback
  originSessionId: d4bcb0a7-da9b-4249-a616-445975d3de36
  modified: 2026-10-04T16:05:00.561Z
---

When a shared hook or constant changes behaviour (SST-1739 C1: `useSubscription`, `signup.tsx`, `start.tsx` stopped short-circuiting on `OPEN_ACCESS_MODE` and began fetching the server paywall state), the tests that break are not only the ones that import or mock the old constant. Four files went red in CI while a 104-test local subset and the C2 "generated inventory" (0 unrepointed) were green:

- `tests/openAccessStartPageRedirect.test.tsx`, `tests/postAuthRedirectToHome.test.tsx`, `client/src/components/legal/__tests__/signup.legalModals.test.tsx` rendered `<Start />` / `<Signup />` with NO `QueryClientProvider`; they only worked because the real constant skipped the query. Failure: `No QueryClient set`.
- `tests/openAccessRetentionTripwire.test.ts` still asserted the client imports the constant.

**Why:** the inventory scanned by module-path suffix on `shared/accessMode`; these tests depend on the constant IMPLICITLY through the real components. Same class as [[feedback_survivorpulse_build_session_green_claim_is_a_subset_read_the_real_prepublish_log]] (a build session's green is a subset).

**How to apply:** (1) before pushing a behaviour change to a shared hook, find dependents by IMPORTERS of the changed module (grep who renders `<Start />`, `<Signup />`, etc.), not only by mention of the constant; (2) run every test file that renders a changed component, then push and READ the pre-publish shards, and fix forward in a fix-only commit (build it on the live origin tip with a temporary `GIT_INDEX_FILE` plus `git commit-tree`, so unfinished slices in the same worktree don't ride along); (3) a repointed test that renders a page now using `useQuery` needs a `QueryClientProvider` and `withClientPaywallState(false)` from `tests/helpers/withPaywallState.ts`.
