---
name: survivorpulse-curl-status-check-needs-set-e-wrapper
description: "GitHub Actions curl status-checking idiom in this repo needs a set +e/CURL_EXIT wrapper, or a transport-level failure aborts before the diagnostic runs"
metadata: 
  node_type: memory
  type: project
  originSessionId: e98d06bf-f0ff-4981-9dc9-afbb2103d228
  modified: 2026-09-06T01:16:39.336Z
---

This repo's established idiom for checking a curl call's outcome in a `run:` block is
`HTTP_STATUS=$(curl -sS -o <file> -w "%{http_code}" ...)` followed by a
`[ "$HTTP_STATUS" -lt 200 ] || [ "$HTTP_STATUS" -ge 300 ]` range check (used in
`pick-popularity-nightly-refresh.yml`, `games-odds-nightly-refresh.yml`,
`4for4-lookahead-nightly-refresh.yml`, and now `pre-publish.yml`/`release-guardian.yml`/
`playwright-ci.yml`'s Notify steps as of SST-1572).

**Gap this repo had not closed anywhere:** GitHub Actions runs `run:` blocks under
`bash -e` by default. A bare `VAR=$(curl ...)` assignment's exit status IS curl's own exit
status, so if curl itself transport-fails (DNS error, connection reset, TLS failure,
timeout — exit code nonzero, no HTTP response ever received), `set -e` aborts the script
**at that line**, before the `::error::` annotation, the response-body dump, or any other
diagnostic ever executes. The step still fails (so the AC "fail loudly" is technically
met), but the nice diagnostic is silently lost and you get a bare `curl: (N) ...` on
stderr instead.

**Fix:** wrap the assignment —
```bash
set +e
HTTP_STATUS=$(curl -sS -o /tmp/response.json -w "%{http_code}" ...)
CURL_EXIT=$?
set -e
if [ "$CURL_EXIT" -ne 0 ]; then
  echo "::error::... request failed (curl exit $CURL_EXIT) -- transport-level failure"
  exit 1
fi
if [ "$HTTP_STATUS" -lt 200 ] || [ "$HTTP_STATUS" -ge 300 ]; then
  echo "::error::... failed with HTTP $HTTP_STATUS"
  cat /tmp/response.json
  exit 1
fi
```

**Also worth knowing:** `continue-on-error: true` on a step masks that step's `conclusion`
to `success` for job/run aggregation purposes — the job and workflow-run status stay
green, which is exactly the surface (commit-status dot, Actions list) that let SST-1571
sit undiscovered. If the whole point of adding a check is visibility, pair
`continue-on-error` with a `$GITHUB_STEP_SUMMARY` write on every failure branch — that
renders on the run's summary page regardless of the masked conclusion, whereas an
`::error::` annotation alone requires someone to already know to look for it.

**Sibling nightly-refresh workflows (`pick-popularity-nightly-refresh.yml`,
`games-odds-nightly-refresh.yml`, `4for4-lookahead-nightly-refresh.yml`) have this SAME
gap** — they use the range-check idiom without the `set +e`/`CURL_EXIT` wrapper. Not fixed
as part of SST-1572 (out of that ticket's file scope); worth sweeping if anyone touches
those files next. See [[feedback_source_scanning_guards_need_three_meta_tests]] for the
related lesson about regex-based bash-text audits (comments/one-sided checks defeating
them) — SST-1572's own `tests/unit/helpers/ciNotifyBashAudit.ts` needed the same hardening
after code review found it.
