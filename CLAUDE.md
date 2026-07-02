## ⚠️ Operating Model Precedence (READ FIRST)

**A project's Operating Model supersedes the generic pipeline.** If the active project defines a Product & Development Operating Model, follow that — the generic pipeline applies only where the project's model is silent.

- **SurvivorPulse** has a canonical operating model: see [`OPERATING_MODEL.md`](./OPERATING_MODEL.md) → **[Notion: Product & Development Operating Model](https://app.notion.com/p/37629ce5833d81eca755f86e4e001a33)**. For SurvivorPulse the heavy generic doc pipeline is **overridden** — groomed Notion stories serve as PRD/use-cases/QA, and the named persona team (Pam, Ann, Deb, Felix, Vlad, Luigi…) owns the flow, wielding the generic agents as tools.

Authority order: **founder's explicit instruction → project operating model → project `CLAUDE.md` → this global default.**

---

## Generic Development Pipeline (no project Operating Model)

Before planning or implementing a feature in a project that has **no** Operating Model of its own, read [`pipelines/generic-development-pipeline.md`](./pipelines/generic-development-pipeline.md) — it defines the documentation-first pipeline (PRD → use cases → architecture review → QA test cases → TDD slices → quality gates), the agency-role table, what a plan file must contain, and the mandatory Plan Critic pass before `ExitPlanMode`.

Trivial non-code tasks (typo fixes, comment edits) are exempt. Skip this file entirely for SurvivorPulse work.

## Claude Config Management

Before editing anything under `~/.claude` (this directory), read [`pipelines/config-management.md`](./pipelines/config-management.md) — it covers the WolffClaude git-backed repo, the auto-commit hook, and the Notion changelog requirement for significant config sessions.
