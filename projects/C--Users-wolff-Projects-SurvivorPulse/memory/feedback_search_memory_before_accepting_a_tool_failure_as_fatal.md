---
name: feedback_search_memory_before_accepting_a_tool_failure_as_fatal
description: "A tool error that looks like infrastructure flakiness may already be a documented, solved problem — search memory before working around it, not after."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 27155f8c-6a75-42a7-9434-704c2005f449
  modified: 2026-08-16T03:37:44.784Z
---

On SST-1361 (2026-08-15), the Notion API-key connector (`mcp__notionApi__API-create-a-comment`) failed with a `missing_version` header error. Five triage subagents plus the orchestrator all hit it, all accepted it as fatal, and all fell back to writing the audit trail into the ticket's Notes field instead. The founder had to ask "did you try Notion OAuth instead of API?" — the second connector (`mcp__d77c6777-...__notion-create-comment`) worked on the first call. [[project_survivorpulse_notion_comment_outage_is_connector_specific]] had documented this exact failure and its fix three days earlier (2026-08-12, SST-1333), including the explicit instruction "do NOT immediately fall back to the Notes property... load the other connector and retry." Nobody searched memory before treating the error as a dead end.

**Why:** a tool failure gets pattern-matched as "known quirk of this API, proceed with a workaround" rather than "check whether this is already solved." The workaround itself was silently worse (Notes is a lossy substitute for real comments that downstream reviewers won't think to read), so the cost wasn't just wasted retries — it degraded the actual deliverable.

**How to apply:** when a tool call fails in a way that looks environmental or infrastructure-specific (auth error, malformed-header error, connection refused, "service down") rather than clearly caused by my own input, search memory for the tool/service name before adopting a workaround — especially before applying that workaround repeatedly across multiple subagents in the same session. If a documented fix exists, use it. If none exists after a real search, then the workaround is justified — but say so explicitly and record the failure as a new memory so the next session doesn't repeat the same dead end.
