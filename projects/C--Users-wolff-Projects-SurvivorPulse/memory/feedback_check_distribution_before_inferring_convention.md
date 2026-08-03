---
name: feedback_check_distribution_before_inferring_convention
description: "Don't infer a codebase/workspace convention from the nearest few neighbors — query the distribution, especially before overriding a documented standard."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f969b3e1-1a70-463c-b84e-35281ca63544
  modified: 2026-07-28T19:07:15.224Z
---

When a written standard (a skill, CLAUDE.md, a doc) says one thing and observed data
seems to say another, do NOT resolve it by sampling the closest few examples. Query the
whole distribution first, and default to the written standard unless the corpus clearly
contradicts it.

**Why:** filing SST-1086 (2026-07-28), the bug-triage skill said to set Type=`Bug`. I
checked the two most recent bug tickets, saw both used `Bug Fix`, concluded the skill was
out of step with practice, and used `Bug Fix` "for board-filter consistency". The founder
corrected it to `Bug`. Querying all ~100 bug tickets afterward showed ~95% use `Bug` —
the two I sampled were among only 8 outliers. The documented standard and the corpus
agreed; my sample was just adjacent to the exceptions. Recency bias is the trap: the
newest rows are the most likely to be someone else's one-off.

**How to apply:** before inferring convention from data, run the aggregate (`SELECT
Type, COUNT(*) ... GROUP BY Type`, or a repo-wide grep count) rather than reading the
last few instances. If the aggregate contradicts a written standard, raise the conflict
explicitly instead of silently picking a side — the standard may be stale, or the data
may be drifting, and which one is broken is the founder's call. See
[[feedback_survivorpulse_fetch_and_search_before_work]].
