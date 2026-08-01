# Two GitHubs: claude.ai Connector vs plugin:engineering:github

**Extracted:** 2026-07-31

**Context:** Scheduled and Cowork runs that need to read GitHub (PRs, CI, repo files) for the WolffClaude and SurvivorPulse repos.

## Problem

"GitHub is connected" is ambiguous, and the wrong reading has burned multiple scheduled runs. There are two separate GitHub integrations, each with its own auth:

1. The **claude.ai connector** toggled under Settings then Connectors.
2. 2. The **plugin:engineering:github** MCP server that the automations actually call.
  
   3. Authorizing one does NOT authorize the other. A scheduled run can show the Settings connector "on" and still get zero GitHub tools, because the plugin server reports as needing authorization. The run then flies blind on PRs and CI with no obvious error, and the report still looks complete (see scheduled-task-connector-preflight.md).
  
   4. Compounding it: the OAuth handshake cannot be completed inside a scheduled, non-interactive run. The automation cannot self-heal. It can only detect and report the gap.
  
   5. ## Solution
  
   6. 1. **Distinguish the two at preflight.** Do not treat "Settings shows GitHub connected" as proof. Check whether GitHub MCP tools actually load in the current session (for example via ToolSearch). If they do not, the plugin server is unauthorized regardless of the Settings toggle.
      2. 2. **Authorize the plugin server interactively.** The plugin:engineering:github server must be authorized in an interactive session via /mcp, which lists servers and lets you complete auth. A scheduled run cannot do this.
         3. 3. **Report, do not silently skip.** If GitHub tools are unavailable, say so at the top of the output and continue. Never let it block the whole run.
            4. 4. **Verify after connecting.** Confirm the fix in a fresh session by asking for a WolffClaude PR list. If it works there, the next scheduled run inherits it.
              
               5. ## When to Use
              
               6. Activate when a task needs GitHub data (PRs, CI, repo contents), when the user says "GitHub is already connected" but tools still fail to load, or when building any scheduled job that depends on the GitHub MCP server.
               7. 
