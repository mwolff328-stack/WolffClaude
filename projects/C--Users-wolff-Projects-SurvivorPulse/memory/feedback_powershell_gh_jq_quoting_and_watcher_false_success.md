---
name: powershell-gh-jq-quoting-and-watcher-false-success
description: "In Windows PowerShell 5.1, gh --jq expressions with inner double quotes are mangled, and a background gate watcher built on it reported success on a run that had not finished; watch CI via a script file with ConvertFrom-Json and confirm directly"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c9ab76e2-3a95-49c9-bce6-b72b1b340791
  modified: 2026-09-20T19:15:46.410Z
---

2026-09-20: a background watcher for a pre-publish gate used `gh run view --jq '.status + "/" + .conclusion'` inside PowerShell 5.1. PowerShell strips the inner double quotes, jq failed to parse, and an earlier variant matched every run and printed a false "GATE ... success" while the run was still pending. The Bash tool and Monitor are also broken here (EOF in profile init), so shell watchers fail.

**Why:** a watcher that reports a completed state you did not verify is exactly how a red gate gets read as green (see [[project-survivorpulse-queued-gate-is-not-a-verified-commit]]).

**How to apply:** put the watcher in a `.ps1` script file (scratchpad `watch-gate.ps1`): loop on `gh run view <id> --json status,conclusion,headSha | ConvertFrom-Json`, exit only when `status -eq 'completed'`, print the conclusion; then ALWAYS re-read the run directly (`gh run view <id> --json status,conclusion`) before declaring a gate green or red. Never key a watcher on a commit-prefix filter over the run list.
