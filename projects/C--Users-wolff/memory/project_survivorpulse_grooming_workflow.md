---
name: survivorpulse-grooming-workflow
description: "Story grooming workflow rules for SurvivorPulse — Kanban status stages, agent responsibilities, comment requirements, review/approval gates"
metadata: 
  node_type: memory
  type: project
  originSessionId: 05ccac44-e27d-4fd9-9c82-33667d4544ae
  modified: 2026-09-22T15:04:38.605Z
---

Story grooming workflow for the SurvivorPulse Notion backlog (SP Stories & Tasks database).

**Why:** Establishes a structured, auditable process for story quality before dev work starts.

**How to apply:** Enforce these rules whenever creating, updating, or reviewing SP stories in Notion.

## Kanban Status Flow (Grooming-Related)

**Backlog → Grooming → Ready**

- **Backlog** — discovery and initial scoping only. Pam creates the story here and then immediately moves it to Grooming.
- **Grooming** — all active grooming work happens here. Ann writes Description + AC, Vlad writes Test Cases, conditional spec owners (Deb/Stan/Rita/Sky) add their specs, Cass runs an adversarial spec review, and the approval gate (Pam + Deb + Felix + Cass) runs here. Stories stay in Grooming until the approval gate passes. (Cass — Adversarial Reviewer, added 2026-09-05 — is a 12th persona; see [[project_survivorpulse_operating_model_cass_and_deb_additions]] if that memory exists, or the Notion page directly, for full detail.)
- **Ready** — groomed and approved; at least one Feature and one Epic assigned; queued for build.

## Grooming Entry Requirement

**A story cannot move from Backlog to Grooming until at least one Feature, at least one Epic, and a Size are assigned.** This is Pam's gate to enforce before changing status. A story without all three stays in Backlog until Pam sets them. Use the abbreviated options: S / M / L / XL.

**Note:** Stories can also move to Blocked from Grooming (as well as from Ready, In Progress, In Review) and must return to Grooming when unblocked.

## Agent Responsibilities

- **Pam** — creates the story (initially in Backlog), immediately moves it to Grooming, assigns Feature (SP Features database), Epic, and Size (S/M/L/XL) when scoping; sets Assigned To Agent to the agents currently working on the story
- **Ann** — writes/updates Description and Acceptance Criteria in the dedicated database property fields (not the page content area)
- **Vlad** — writes/updates Test Cases in the dedicated database property field (not the page content area)
- **Deb** — provides UI spec and mockups for any story with a UI component (required before review)
- **Stan** — provides research/calculation specs and reference models for any story with a research, algorithm, or calculation component (required before review)
- **Rita** — provides integration specs for any story with an integration component (required before review)
- **Sky** — provides copy specs for any story with a UI component involving user-facing copy (required before review)
- **Cass** — runs an independent adversarial review of the spec (Description/AC/Test Cases) via the Codex plugin, trying to break it rather than confirm it; required on every story
- **Pam, Deb, Felix, Cass** — all four must review and approve every story before work can start

## Comment Requirements

Every agent that touches a story must add a Notion comment documenting what they did. This creates an audit trail.

## Required Story Fields

**Convention:** All grooming content must be written into the story's dedicated database property fields — never into the general page content area. This keeps data structured, queryable, and consistently located.

Every story must have all required fields before entering review:
1. Feature (Pam) — at least one SP Features database assignment; required on all stories
2. Epic (Pam) — at least one Epic relation; required on all stories
3. Size (Pam) — S / M / L / XL; required on all stories; set at scoping, before Grooming entry
4. Description (Ann)
5. Acceptance Criteria (Ann)
6. Test Cases (Vlad)
7. UI spec + mockups (Deb) — required if story has a UI component
8. Research/calculation specs + reference models (Stan) — required if story has a research, algorithm, or calculation component
9. Integration specs (Rita) — required if story has an integration component
10. Copy specs (Sky) — required if story has a UI component involving user-facing copy

## Review & Approval Gate

- All four of Pam, Deb, Felix, and Cass must approve a story before development work can start. Pam/Deb/Felix sign off on product/design/architecture fit; Cass's is a distinct adversarial pass (trying to break the spec, not confirm it looks right)
- Each reviewer adds a comment with their review verdict and approval
- If changes are needed: reviewer adds a comment explaining what needs to change, and the story is kicked back to Ann (for Description/AC), Vlad (for Test Cases), or the relevant spec owner (Stan/Rita/Sky); story stays in **Grooming**
- Stories without at least one Feature, at least one Epic, and a Size cannot enter the approval gate — any missing field kicks back to Pam
- Stories with UI components cannot enter review until Deb has attached a UI spec and mockups
- Stories with research/calc components cannot enter review until Stan has attached his specs
- Stories with integration components cannot enter review until Rita has attached her specs
- Stories with UI copy components cannot enter review until Sky has attached her copy specs
- **Pre-vote field check:** before any approver votes, verify Description/AC/Test Cases are in property fields (not page body) AND that each carries its 🗣️ plain-English line (see Human-Readable Grooming below) — missing either is a grooming defect that fails the gate
- On approval: all four approvers have commented, story moves from **Grooming → Ready**

## Human-Readable Grooming (added 2026-09-22)

Agent-level Description/AC/Test Cases/Comments stayed exactly as-is (agents need the precision), but every one now also gets a 🗣️ plain-English companion line, using the `explain-simply` skill's principles (plain before jargon, one short sentence, no forced analogy for something this small):

- **Description** — one 🗣️ line at the very top of the field, summarizing the whole story, then the existing detailed Description below it
- **Acceptance Criteria / Test Cases** — both are numbered lists inside one property field; every individual numbered item gets its own 🗣️ line directly above it, not one summary for the whole field
- **Comments** — every comment (grooming, verdict, block/unblock, Done transition, etc.) opens with a 🗣️ line before its technical content
- 🗣️ is the fixed marker — a human scanning a ticket reads only the 🗣️ lines
- **Author:** Ann (Description/AC) and Vlad (Test Cases) write both layers; whoever posts a comment writes its 🗣️ line
- **Backfill scope (founder ruling 2026-09-22):** tickets in Ready/In Progress/In Review get Description/AC/Test Cases retrofitted; Backlog/Grooming tickets pick it up naturally through normal grooming; Done/Cancelled are not backfilled

## Assigned To Agent Field

The **Assigned To Agent** multi-select property tracks who currently owns a story. It is a living field — not a grooming gate — and must be kept current at all times until Done.

- **Set by Pam** at scoping (when moving to Grooming) to the agents who will be actively working on it
- **Updated by each persona** when taking ownership or handing off
- **Multiple agents allowed** simultaneously (e.g., Ann + Vlad during parallel grooming)
- **Cleared** when the story reaches **Done**
- **Must never be blank** on any story in Backlog through In Review

## Kickback Flow

Reviewer flags issue → comment logged → story kicked back to the responsible agent → updated → re-enters review (stays in Grooming throughout)
