# Scheduled Task Timing Drift on Time-Sensitive Drops

**Extracted:** 2026-06-12

**Context:** Scheduled tasks that must fire before a hard external deadline such as reservation drops, ticket on-sales, or limited inventory.

## Problem

Scheduled tasks do not fire at the exact wall-clock minute they are set for. Real runs drift, sometimes by 30 to 60 minutes. On 2026-06-12 a Cote reservation task meant to be staged at ~9:57 AM ET, just before the 10:00 AM July-10 drop, actually ran at ~10:46 AM ET. By the time the browser could check, every 7:00 to 8:00 PM slot was gone. The task did everything right except start on time, and that was enough to lose the booking.

## Solution

Stage the trigger early. Set the run several minutes before the real deadline, 5 to 10 minutes, not at the deadline itself. Treat the scheduled time as "no later than," not "exactly at."

Verify the run actually started on time. Capture the real start timestamp at the top of the run and compare it to the target. If drift exceeds the safety margin, flag it loudly in the report instead of failing silently.

Know the real open window. Confirm how far out the booking system actually opens before relying on it. Example: Cote 550 opens reservations 14 days out, not 30, so a July-10 attempt has nothing to book until roughly June 26.

Fail honest, do not improvise. If the priority options are gone, report that clearly and do not grab an undesired fallback unless told to.

## When to Use

Activate when building or reviewing any scheduled task tied to a hard external drop time, when a scheduled run missed its target and you need the post-mortem pattern, or when deciding how much buffer to bake into a time-sensitive automation.
