# Product & Development Operating Model — Pointer (WolffClaude)

> **Canonical source of truth lives in Notion. Edit there, not here.**
> **[Product & Development Operating Model](https://app.notion.com/p/37629ce5833d81eca755f86e4e001a33)**
> (under 🛠️ Product & Engineering)

This pointer lives in the `WolffClaude` config repo so the operating model is discoverable alongside the Claude Code configuration. It is intentionally short — the real content is in Notion; duplicating it here guarantees drift.

## Why this matters for config

The operating model is **supreme over the generic heavy pipeline** defined in `~/.claude/CLAUDE.md`. For SurvivorPulse, the `/bootstrap-feature` doc-generation pipeline is **skipped** — groomed Notion stories serve as PRD, use-cases, and QA artifacts, and Felix's technical review satisfies the architecture-review step. Where the global config and the operating model conflict, **the operating model wins.**

`~/.claude/CLAUDE.md` references this pointer and treats its heavy pipeline as a generic default that is overridden per-project by the operating model.

## What it covers

Purpose & Authority · Mission & Strategic Guardrails · The Org (persona team canonical; generic agents are tools) · Delivery Pipeline (Kanban) · Governance & Non-Negotiables · Tooling & Systems · How We Change This Model · Open Questions.

## How to change it

Propose → founder decides → update Notion (canonical) → sync this pointer + `SurvivorPulse/docs/OPERATING_MODEL.md` + affected memory → log in the Notion change log.
