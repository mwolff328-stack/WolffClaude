---
name: survivorpulse-operating-model
description: Canonical home of the SurvivorPulse Product & Development Operating Model — Notion source of truth + repo pointers; supreme over the global heavy pipeline
metadata: 
  node_type: memory
  type: reference
  originSessionId: 82ca87e0-d1ce-4693-8b54-936d85de48ed
  modified: 2026-09-05T16:01:49.489Z
---

The SurvivorPulse **Product & Development Operating Model** is the single source of truth for how the company builds and runs product (org, delivery pipeline, governance, tooling).

- **Canonical (edit here):** Notion — "Product & Development Operating Model", page id `37629ce5-833d-81ec-a755-f86e4e001a33`, under 🛠️ Product & Engineering. URL: https://app.notion.com/p/37629ce5833d81eca755f86e4e001a33
- **Repo pointers (short, do not duplicate content):** `SurvivorPulse/docs/OPERATING_MODEL.md` and `WolffClaude/~/.claude/OPERATING_MODEL.md`
- **Authority:** this model is SUPREME over the generic heavy pipeline in `~/.claude/CLAUDE.md`. That file now opens with an "Operating Model Precedence" banner; its `/bootstrap-feature` pipeline is the overridden generic default. Authority order: founder's explicit instruction → project operating model → project `CLAUDE.md` → global default.
- **2026-07-02 refinement:** this supremacy is for *process* only (org, delivery pipeline, tooling). For product/data philosophy (mission, determinism, golden-source rules, expansion guardrails, testing/doc standards), `SurvivorPulse/docs/PRODUCT_CONSTITUTION.md` is the co-equal highest authority — not subordinate to this model, and this model doesn't restate its content. Project `CLAUDE.md` was cut down to AI-operational instructions only and now points to the Constitution instead of duplicating it. See [[project_survivorpulse_governance_docs]] for the full reconciliation and the decision-log entry.
- **Board & statuses (verified 2026-06-05):** active board is **✅ SP Stories & Tasks** (`35929ce5-833d-813d-ac22-ef23bb216120`, collection `35929ce5-833d-8156-9e29-000ba878443c`). Status flow: **Backlog → Ready → In Progress → In Review → Done**, plus **Blocked** (lateral) and **Cancelled** (terminal; added 2026-06-06 — use it to kill dropped/superseded/no-longer-needed stories rather than parking them in Backlog). Grooming + the Pam/Deb/Felix approval gate happen in **Backlog**, exiting to **Ready**. **"In Review" is a POST-build code-review + QA/E2E gate** (In Progress → In Review → Done) — NOT the pre-build approval gate. A SEPARATE board titled "SurvivorPulse Product Backlog" (`23c0e14a…`) also exists with 99 LARGELY DISTINCT stories (51 Backlog / 42 Done / 5 In Progress; only 1 title overlaps with SP Stories & Tasks) — it is NOT a duplicate; do NOT archive. Reconciliation (consolidate vs keep-both) is an open decision.

Covers (8 sections): Purpose & Authority · Mission & Strategic Guardrails · The Org (persona team canonical, generic agents are tools, incl. persona→generic mapping) · Delivery Pipeline (Kanban) · Governance & Non-Negotiables · Tooling & Systems · How We Change This Model (+ change log) · Open Questions.

- **2026-09-05: added Cass, Adversarial Reviewer** (§3.1/§3.2) — the 12th persona, wields the Codex plugin (`codex:rescue`) as her only tool, run independently (never shared with Felix/Deb/Vlad). Blocking, required on every story at two gates: the Grooming→Ready approval gate is now Pam+Deb+Felix+Cass (adversarial spec review of Description/AC/Test Cases), and In Review's always-required reviewers are now Vlad+Ann+Cass (adversarial code review). No size/risk exemption. Prompted by the founder installing the Codex Claude Code plugin and wanting an independent second-model reviewer distinct from Vlad's QA (executes documented tests) and code-reviewer/security-auditor (style/security) — Cass's charter is to actively try to break the spec/code, not confirm it.

It consolidates the previously-scattered rules: [[survivorpulse-grooming-workflow]], [[survivorpulse-dev-workflow]], [[survivorpulse-db-deployment]]. **To change the model:** propose → founder decides → update Notion → sync repo pointers + memory → log in the Notion change log. Created 2026-06-05.
