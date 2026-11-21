# A Status Property Can Contradict Its Own Notes Field

Extracted: 2026-11-20

Context: The SurvivorPulse Sprint Review for week ending Nov 20, 2026 counted 12 items as "shipped" by filtering the board for Status=Done with a completion date in the current week. Two of those twelve ("Game Plan: one Strategy summary module" and "Strategy page: Select Pools and Entries modal") have Notes/gate-record text that says the opposite of Done: one ends "Founder has NOT yet approved the build, and nothing is built or pushed," the other ends "Status left at Grooming pending founder go-ahead." The sprint review flagged the contradiction instead of silently trusting the Status property, which is what caught it.

## Problem

A board's Status dropdown and a ticket's own free-text Notes/gate-record field are two independent surfaces that can drift apart on the very same ticket, not just across two different documents (see plan-and-board-must-reconcile for that sibling failure). Whatever process sets Status to Done, maybe a template default, a copy-paste, an automation triggered too early, doesn't necessarily write or check the Notes field, and vice versa. A shipped-count or status report that filters purely on the Status column will confidently report work as done that the ticket's own history says never started.

## Solution

When tallying "shipped" or "done" counts from a board for a status report, do not trust the Status property alone. For each item the filter picks up, especially right before publishing a count people will plan around, spot-check its Notes/gate-record/description field for language that contradicts the status (such as "not yet approved," "nothing built," "pending go-ahead," "left at Grooming"). If any contradiction surfaces, report the shipped count as provisional and name the specific contradicting tickets rather than quietly including or excluding them. Treat a contradiction between a status field and that same record's own notes as a data-integrity finding worth a founder's five minutes, the same tier as a plan referencing dead IDs.

## When to Use

Activate when compiling any shipped/done/completed count from a board or database for a status report, standup, or sprint review, and the source has both a status property and a free-text notes or history field that could have drifted independently. Spot-check at minimum the items nearest the count's edge (newly marked Done) before publishing the number.

## Related

plan-and-board-must-reconcile (the sibling failure across two documents instead of within one record), status-reports-must-diff-not-restate, red-ci-blocks-shipping.
