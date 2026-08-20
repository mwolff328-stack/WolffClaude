---
name: feedback-prefer-notion-oauth-connector
description: Use the Notion OAuth connector (plugin:productivity:notion) by default for all Notion work; the Notion MCP server (d77c6777-...) is a fallback only.
metadata:
  type: feedback
---

Default to the Notion OAuth connector (`plugin:productivity:notion`) for all Notion reads/writes. Only use the standalone Notion MCP server (tools prefixed `mcp__d77c6777-2678-446f-b1ea-d56a8303dfb6__notion-*`) as a fallback when the connector is unavailable or unauthenticated.

**Why:** founder correction, 2026-08-20 — the connector is the intended integration; the MCP server was only ever meant as a backup path.

**How to apply:** at the start of any Notion task, try `plugin:productivity:notion` tools first via ToolSearch. If the system reminder lists it under "requires authentication" (not yet connected), fall back to the `d77c6777...` MCP server tools and note in the response that the OAuth connector isn't authenticated yet, so the founder knows to connect it via claude.ai connector settings. This applies to the [sp-daily-acquisition-brief scheduled task](../scheduled-tasks/sp-daily-acquisition-brief/SKILL.md) and any other SurvivorPulse Notion work (bug triage, ticket filing, etc.).
