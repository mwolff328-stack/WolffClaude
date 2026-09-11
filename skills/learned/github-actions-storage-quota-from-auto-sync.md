# Auto-Sync Commit Volume Can Quietly Burn GitHub Actions Storage Quota

**Extracted:** 2026-09-11
**Context:** WolffClaude's SessionStart hook auto-syncs Desktop app skills into this repo, producing frequent small "chore: auto-sync" commits (100+ in a single overnight window on some days). A scheduled run's status check found GitHub Actions storage sitting at 90% of quota and traced it to this commit volume, not to any single workflow or large artifact.

## Problem

A hook or automation that commits on every session start (or at similarly high frequency) looks harmless per-commit, but it compounds fast if each commit triggers a workflow run. Actions storage/minutes quota can creep toward its ceiling silently, with no single commit, run, or artifact standing out as the obvious cause. This kind of issue tends to surface almost by accident during an unrelated status check, not because anything failed loudly or a build broke.

## Solution

For any repo with a frequent auto-commit or auto-sync hook, do the following. Check repo Settings, then Actions, then General, then Usage, periodically, especially once a hook is committing multiple times per session or per day. Don't wait for a failure to look. Set an explicit, shorter artifact and log retention policy rather than relying on GitHub's defaults, so old run data ages out faster. Question whether every auto-sync commit needs to trigger a workflow at all; path filters or a skip-ci marker on routine sync commits can cut runs dramatically without losing real CI coverage. If quota is already tight, squash or batch auto-sync commits, for example one commit per session instead of one per file, instead of committing on every change.

## When to Use

Activate when a scheduled task or session hook reports "storage near quota" or "Actions usage high," or when setting up any new auto-commit or auto-sync hook from scratch. Build the retention and frequency policy in up front instead of discovering the ceiling later.
