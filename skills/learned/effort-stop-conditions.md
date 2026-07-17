# Every Effort States Its Result and Stop Condition Before It Starts

**Extracted:** 2026-07-17
**Context:** SurvivorPulse pick-picker arc (2026-07-15 → 17). A founder review of a single display number ran for three days, produced four shipped stories and five genuine defect catches, and only ended when it collided with a launch date. Diagnosed by the Board of Advisors (Drucker).

## Problem

An effort was framed as **"review the pick modal"** — a activity, not a result. It had no definition of done. So it did not end; it **metastasized** until something hard enough stopped it. Here, that was the launch date. That is an expensive stopping mechanism.

The trap is not that the work was wasteful. It is the opposite, and that is what makes it dangerous:

> *"Nothing is so useless as doing efficiently that which should not be done at all — but the far more common trap is doing VALUABLE work that was never the work you set out to do."* — Drucker

The findings were all real: two metrics deleted that two independent reviewers said should never have shipped, a 6-month-old production bug, a bug in a neighboring team's shipped code, a wrong-week bug in a core write path, and a Critical caught before it reached users. **Every one of those was genuine, and their genuineness is exactly what made the effort impossible to stop.** Each thread justified the next. Nothing existed to say "this is finished."

## Solution

**1. State the result and the stop condition BEFORE starting.**
- ✅ "The pick modal displays numbers correctly" — a stop condition. You can tell when it's true.
- ❌ "Review the pick modal" — an activity. It has no end.

**2. Findings get FILED, not FOLLOWED. Discovery is not authorization to proceed.**
When work uncovers something valuable outside its scope, write it down and **let the current work still stop on time**. The new finding deserves its own decision — its own answer to "what result, by when, and what does the customer get." Absorbing it into the running effort skips that decision entirely.

**3. Use the bug/ticket process as a TERMINATOR, not a bookmark.**
Filing a discovery should end your involvement with it in this effort, not queue it for immediate pursuit.

**4. Ask, at each new thread: is this the work I set out to do?**
If no, it may still be worth doing — but it is a *new* effort and needs a *new* decision. The founder does not get that decision if the finding is silently absorbed.

**5. Watch for the tell.** If you cannot name the condition under which you would stop, you have no stop condition, and the effort will run until an external force ends it.

## When to Use

- Starting any review, audit, investigation, or exploratory effort — write the stop condition in the first message.
- Any time an effort uncovers a genuine, valuable finding outside its scope — file it and ask whether the original result has been delivered.
- Any time you notice an effort is on its Nth thread and the original goal was met several threads ago.
- Especially when the work is *good*. Valuable findings are the mechanism by which scope escapes; a useless tangent is easy to drop, a genuine one is not.
