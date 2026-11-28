# Two GitHubs: claude.ai Connector vs plugin:engineering:github

**Extracted:** 2026-07-31
**Updated:**2026-11-27

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

## Update — 2026-11-27: full dial failure (404 / CLIENT_HTTP_NOT_IMPLEMENTED), not just an auth gate

A third failure mode, distinct from both the 2026-07-31 baseline and the 2026-10-09 partial-auth case above: the GitHub MCP server now fails to connect at all. Tool loading fails with a flat 404 at the MCP dial step itself — "SdkHttpError dialing https://api.anthropic.com/v2/.../mcp (CLIENT_HTTP_NOT_IMPLEMENTED)" — with zero GitHub tools surfaced to retry against, read or write. This is a connection failure, not an authorization gate: there is nothing to re-auth via /mcp because the server never answers the dial in the first place. Treat this error signature as a separate case from both the unauthorized and partial-auth cases above, and do not assume re-running /mcp will fix it.

Per the Daily Brief's own tracking, this has now held for 7+ consecutive weeks straight (reconfirmed in the Nov. 27 Daily Brief and in this same week's Weekly Key Learning Brief run), with the Weekly Plan already flagging it as a "fix it or stop carrying it as a to-do" item. A gap this size and duration is past the point where a scheduled run should keep quietly routing around it with browser automation every week. Once the same failure mode has recurred across several consecutive scheduled runs, flag it for an actual interactive fix (confirming whether the GitHub App installation was revoked, suspended, or needs reinstalling) instead of treating it as routine preflight noise to work around again.

## Solution

1. **Distinguish the two at preflight.** Do not treat "Settings shows GitHub connected" as proof. Check whether GitHub MCP tools actually load in the current session (for example via ToolSearch). If they do not, the plugin server is unauthorized regardless of the Settings toggle.
2. **Don't stop at "tools loaded."** Loaded read tools are not proof of write access — see the 2026-10-09 update above. If the task needs to create, edit, or delete anything in the repo, confirm a write call actually succeeds before relying on the API path; otherwise use the browser.
3. **Authorize the plugin server interactively.** The plugin:engineering:github server must be authorized in an interactive session via /mcp, which lists servers and lets you complete auth. A scheduled run cannot do this.
4. **Report, do not silently skip.** If GitHub tools are unavailable, or available for read but not write, say so at the top of the output and continue. Never let it block the whole run.
5. **Verify after connecting.** Confirm the fix in a fresh session by asking for a WolffClaude PR list (read) and, separately, by attempting a real write (branch create or file commit). If both work there, the next scheduled run can inherit it.

## When to Use

Activate when a task needs GitHub data (PRs, CI, repo contents), when the user says "GitHub is already connected" but tools still fail to load, when a GitHub MCP read succeeds but a write unexpectedly 403s, when tool loading itself fails with a dial-level error (404, CLIENT_HTTP_NOT_IMPLEMENTED) rather than an auth prompt, or when building any scheduled job that depends on the GitHub MCP server.
