# Two GitHubs: claude.ai Connector vs plugin:engineering:github

**Extracted:** 2026-07-31
**Updated:** 2026-10-09

**Context:** Scheduled and Cowork runs that need to read GitHub (PRs, CI, repo files) for the WolffClaude and SurvivorPulse repos.

## Problem

"GitHub is connected" is ambiguous, and the wrong reading has burned multiple scheduled runs. There are two separate GitHub integrations, each with its own auth:

1. The **claude.ai connector** toggled under Settings then Connectors.
2. The **plugin:engineering:github** MCP server that the automations actually call.

Authorizing one does NOT authorize the other. A scheduled run can show the Settings connector "on" and still get zero GitHub tools, because the plugin server reports as needing authorization. The run then flies blind on PRs and CI with no obvious error, and the report still looks complete (see scheduled-task-connector-preflight.md).

Compounding it: the OAuth handshake cannot be completed inside a scheduled, non-interactive run. The automation cannot self-heal. It can only detect and report the gap.

## Update — 2026-10-09: partial auth is its own failure mode

As of this date, the plugin:engineering:github MCP server authorizes far enough to serve READS against mwolff328-stack/WolffClaude — get_file_contents, list_branches, and list_pull_requests all succeeded in a live scheduled-task session. But WRITES still fail: create_branch returned a flat 403 "Resource not accessible by integration."

This is a sneakier failure mode than the fully-unauthorized case the rest of this note describes, because the reads working first builds false confidence that the connector is fixed, right up until a write silently 403s. Treat "reads work" and "writes work" as two separate things to verify, not one. Browser automation (GitHub's web editor, as this note's Solution section describes) remains the required path for any repo-changing action until a write call actually succeeds in a fresh session.

## Solution

1. **Distinguish the two at preflight.** Do not treat "Settings shows GitHub connected" as proof. Check whether GitHub MCP tools actually load in the current session (for example via ToolSearch). If they do not, the plugin server is unauthorized regardless of the Settings toggle.
2. **Don't stop at "tools loaded."** Loaded read tools are not proof of write access — see the 2026-10-09 update above. If the task needs to create, edit, or delete anything in the repo, confirm a write call actually succeeds before relying on the API path; otherwise use the browser.
3. **Authorize the plugin server interactively.** The plugin:engineering:github server must be authorized in an interactive session via /mcp, which lists servers and lets you complete auth. A scheduled run cannot do this.
4. **Report, do not silently skip.** If GitHub tools are unavailable, or available for read but not write, say so at the top of the output and continue. Never let it block the whole run.
5. **Verify after connecting.** Confirm the fix in a fresh session by asking for a WolffClaude PR list (read) and, separately, by attempting a real write (branch create or file commit). If both work there, the next scheduled run can inherit it.

## When to Use

Activate when a task needs GitHub data (PRs, CI, repo contents), when the user says "GitHub is already connected" but tools still fail to load, when a GitHub MCP read succeeds but a write unexpectedly 403s, or when building any scheduled job that depends on the GitHub MCP server.
