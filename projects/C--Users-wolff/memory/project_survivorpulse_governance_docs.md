---
name: project_survivorpulse_governance_docs
description: SurvivorPulse governance doc authority split (Constitution vs Operating Model vs CLAUDE.md) and where detail lives after the 2026-07-02 CLAUDE.md cleanup
metadata: 
  node_type: memory
  type: project
  originSessionId: 5cd84915-67ea-4dbf-847a-5e37115aff66
---

SurvivorPulse's governance docs were reconciled on 2026-07-02 into a domain split, not a strict hierarchy:

- **`docs/PRODUCT_CONSTITUTION.md`** (project root `docs/`) — highest authority for product/data philosophy: mission, scope, golden-source/determinism rules, expansion guardrails, documentation hygiene, testing standards, user trust. Versioned (currently 1.0.1) with a mandatory amendment process: any edit requires a version bump + a decision-log entry in `docs/decision-log/` (enforced by `scripts/tripwire-constitution-and-decision-log.cjs` / `scripts/tripwire.config.json`, required sections: Context, Decision, Options Considered, Rationale, Consequences). Follow this process before editing the Constitution again — don't hand-edit it like a normal doc.
- **`docs/OPERATING_MODEL.md`** — pointer to the Notion Product & Development Operating Model, authoritative for *process* (org, delivery pipeline, tooling). Co-equal with the Constitution, not subordinate to it, and doesn't restate its content.
- **`CLAUDE.md`** (project root) — AI-operational instructions only now (branch rules, dev workflow steps, codebase reference, autonomous-operation gating). Points to the Constitution for philosophy/standards instead of duplicating them. Was condensed from 487 lines to ~180 as part of this cleanup; three situational chunks were split into `docs/MODELING_STANDARDS.md`, `docs/DB_OPERATIONS.md`, `docs/STRIPE_DEV_SETUP.md`.
- **`docs/PRODUCT_INTEGRITY_RULES.md`** — separate, no overlap: 3 concrete automated-enforcement invariants (eligibility source of truth, non-empty recommendations, query-key consistency) plus branch protection.

**Why:** the three docs previously made overlapping/conflicting supreme-authority claims (Constitution declared itself highest authority citing no one; Operating Model claimed supremacy over `~/.claude/CLAUDE.md` and separately assigned engineering-guardrail content to `CLAUDE.md`), and `CLAUDE.md` duplicated Constitution content verbatim — a silent-drift risk. See decision log `docs/decision-log/2026-07-02-authority-reconciliation-operating-model-claude-md.md` for the full reasoning.

**How to apply:** when adding new product/data philosophy content, it goes in the Constitution (with the amendment process), not in `CLAUDE.md`. When adding new day-to-day AI workflow instructions, they go in `CLAUDE.md`. Don't restate Constitution content in `CLAUDE.md` again — link to it. Original pre-split files are backed up at `CLAUDE.md.bak` (project root).

Related: [[project_survivorpulse_local_verification]]
