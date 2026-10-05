Two Different Claude GitHub Apps, and the Repo-Access Fix Only Works on One of Them

Extracted: 2026-10-02, corrected 2026-10-05

Context: The Oct 2 version of this file said a SurvivorPulse 404 was a per-repo access-list gap, fixable by adding the repo under Settings, Applications, Installed GitHub Apps. That advice sent the next troubleshooting session to fix the wrong app's settings, which did nothing, because there are two separate GitHub Apps involved and the fix only applies to one of them.

Problem

GitHub has two different apps tied to Claude on this account, and they look similar enough to mix up under pressure.

"Claude" is the Claude Code GitHub Action app, used for running Claude Code from PRs and Issues in CI. This is the one with visible Permissions and a Repository access radio button, All repositories versus Only select repositories, under Settings, Applications, Installed GitHub Apps. Setting this to All repositories does nothing for the MCP connector.

"Claude GitHub MCP Connector" is the one that actually backs the GitHub tools used in Cowork and other Claude surfaces, reached through Settings, Customize, Connectors, GitHub in Claude, pointed at api.githubcopilot.com/mcp. Its GitHub authorization page, at github.com/settings/connections/applications/ followed by its client ID, has no repository access picker at all. Instead it lists three identity-level permissions, verify identity, know what resources you can access, act on your behalf, and a line that reads has not been installed on any accounts you have access to.

That line is the actual tell. A repo you know exists, owned by the account, that the connector 404s on while reading public repos fine, paired with that not installed on any accounts line on the MCP Connector's own authorization page, is a different failure mode than the classic per-repo access list gap, even though the symptom looks identical from the GitHub-tools side.

What was tried and did not fix it

All of the following were tried, in this order, across one live troubleshooting session, and none of them changed the has not been installed on any accounts line or fixed the 404.

Setting Claude, the Code Action app, the wrong one, to All repositories.

Removing the GitHub connector in Claude's Connectors settings and re-adding it as a custom connector.

Switching the custom connector's OAuth client setting from Use your own OAuth client to Use Claude's published identity, which is the correct setting for this server but still did not surface a repo picker.

Deleting unrelated personal access tokens, classic and fine-grained, found on the account. These were a different, unrelated auth path and had no effect either way.

Revoking access directly on GitHub's authorization page for Claude GitHub MCP Connector, then reconnecting fresh from Claude. Still showed zero installs afterward.

Checking the Discover tab in Claude's connector list for an alternate, non-custom GitHub connector. There isn't one, the custom connector pointed at api.githubcopilot.com/mcp is the only path.

Checking the repo's own per-repo GitHub Apps list, repo Settings, Integrations, GitHub Apps. Claude GitHub MCP Connector does not appear there either, consistent with it never having an installation anywhere on the account.

Status: unresolved as of 2026-10-05

This is not a self-service settings problem as far as this session could tell. Every lever GitHub's UI exposes was tried and the authorization page still reports no installation. Next step is an Anthropic support ticket, not more clicking through GitHub settings. If a future session resolves this, replace this section with the actual fix and keep the two-apps distinction above, since that part is durable regardless of how the install gap itself gets fixed.

When to Use

Activate when a GitHub-reading task 404s on a specific private repo while other repos work fine, before assuming it is the classic per-repo access-list gap. Check which of the two Claude GitHub Apps is actually involved first. If it is Claude GitHub MCP Connector and its authorization page says not installed on any accounts, the Installed GitHub Apps repository access picker will not help, and the fix, if one exists yet, needs to be found fresh rather than assumed from an older version of this file.
