---
name: feedback_survivorpulse_real_shell_rtl_tests_flake_on_default_1s_waits_raise_asyncutiltimeout
description: "A vitest file that mounts the REAL shell (AppShell, providers, page, view) failed 4 of 6 standalone runs because testing-library's findBy/waitFor wait only 1000 ms; configure({ asyncUtilTimeout: 10_000 }) fixed it (10 of 10). CI was green, so a green gate can hide a flake that a busy machine exposes."
metadata:
  node_type: feedback
  type: feedback
  originSessionId: 16cf4f84-760d-4785-80fa-19543ac4e60f
  modified: 2026-10-04T16:00:53.613Z
---

SST-1797 (2026-10-04): `tests/weekOnePicksShellStaleLogin.sst1797.test.tsx` (real `WeekOnePicksShell`, real
`useAuth`, real QueryClient) passed in CI but failed 4 of 6 standalone runs on a developer machine (one run
failed 3 tests), and in Vlad's two full 32-file runs. Cause: `screen.findByTestId(...)` and `waitFor(...)` default
to a 1000 ms wait, and a cold worker or busy machine needs longer to render the real shell. The tests were right.

**Fix that worked:** `configure({ asyncUtilTimeout: 10_000 })` from `@testing-library/react` at the top of the file
(vitest isolates files, so it does not leak). 10 of 10 standalone runs and 4 of 4 runs of all five sibling client
suites passed afterwards; the mutation tests that must go red still did. A longer async wait only delays a real
failure, because every wait resolves the moment its assertion holds. The project's `testTimeout` is already 30 s.

**How to apply:**
- Any new test that mounts the real shell or several real providers: set `asyncUtilTimeout` at the top, and measure
  stability BEFORE committing with a repeat loop (`tmp/build/repeat-stale-login.sh`-style: run the file N times
  standalone and count). A single green run proves nothing about a timing flake.
- A flaky test in the pre-publish gate is not "just CI noise": it randomly reddens everyone's push and trips the
  autonomous-push rule that treats a red gate as a hard stop. Fix it when found.
- A red gate on the tip can belong to ANOTHER ticket (here SST-1739); read the failing test names before assuming
  it is yours, and do not push your slice onto it if it is your own ticket's failure
  ([[feedback_autonomous_push_cadence_outruns_ci_signal]]).
- `git rebase` refuses when `git status` lists CRLF-noise files as modified. Do not `git stash` (shared stack):
  when `git diff HEAD` is empty and nothing is untracked, `git reset --hard origin/<branch>` then
  `git cherry-pick <your sha>` is the safe equivalent, and it clears the noise.
