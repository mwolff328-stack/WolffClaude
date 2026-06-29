# Scheduled Brief Connector Preflight and Silent Failure

**Extracted:** 2026-06-26

**Context:** Recurring scheduled tasks (daily and weekly briefs) that depend on several connectors and signed-in accounts being live at once: Gmail, Calendar, Notion, GitHub, and multiple Chrome accounts.

## Problem

Scheduled brief runs quietly degrade when an input source is unavailable, and the report still looks complete. Two failure modes kept recurring:

1. Half-blind runs. The GitHub connector was disconnected across three straight daily briefs (Jun 24, 25, 26), so the briefs could not see CI state on the SurvivorPulse repo. The demo@survivorpulse.com account was never signed into Chrome (it resolves to michael.wolff@), so it kept getting skipped. The brief read fine but was missing a whole source each time.

2. 2. Silent death. The 2026-06-21 weekly brief failed on an SSL/API error and produced nothing at all. No output, no alert. A scheduled job that dies quietly is worse than one that dies loudly, because you assume it ran.
  
   3. ## Solution
  
   4. Preflight the connectors. At the start of the run, confirm each required connector and account is actually connected before relying on it. If one is down (for example GitHub), say so explicitly at the top of the report rather than silently omitting the section.
  
   5. Name skipped sources. If a source cannot be reached, list it as "unavailable this run" instead of leaving it out, so a missing section is never mistaken for "nothing happened."
  
   6. Write a heartbeat. End every run with a one-line success record (timestamp plus sources covered). On failure, surface the error somewhere visible instead of letting the job vanish. A run that produced nothing should be detectable.
  
   7. Do not let one missing source block the whole run. Note it briefly and continue. Partial output beats no output, as long as the gaps are labeled.
  
   8. ## When to Use
  
   9. Activate when building or reviewing any recurring scheduled task that depends on multiple connectors or signed-in accounts, when a brief looks complete but a source may have been silently skipped, or when a scheduled run appears to have produced no output and you need to know whether it failed.
   10. 
