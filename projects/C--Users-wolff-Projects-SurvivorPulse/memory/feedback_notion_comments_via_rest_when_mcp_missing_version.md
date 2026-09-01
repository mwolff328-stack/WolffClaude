---
name: feedback_notion_comments_via_rest_when_mcp_missing_version
description: When mcp__notionApi__API-create-a-comment fails with 400 missing_version, post via the Notion REST API using NOTION_TOKEN from the shell env — do not fall back to the browser.
metadata:
  type: feedback
---

`mcp__notionApi__API-create-a-comment` returns `400 missing_version` ("Notion-Version header
should be defined") — see [[project_survivorpulse_notion_mcp_create_comment_missing_version]].
The documented fallbacks are the OAuth connector, then driving Notion in Chrome. **There is a
third route that is better than both, and it was missed for months: `NOTION_TOKEN` is already in
the shell environment**, so the REST API can be called directly with the header the MCP server
omits.

```
python - <<'PY'
import json,os,urllib.request
tok=os.environ["NOTION_TOKEN"]
body=json.dumps({"parent":{"page_id":"<page-id>"},
                 "rich_text":[{"type":"text","text":{"content":"<text>"}}]}).encode()
req=urllib.request.Request("https://api.notion.com/v1/comments",data=body,method="POST",
  headers={"Authorization":f"Bearer {tok}","Notion-Version":"2022-06-28",
           "Content-Type":"application/json"})
print(json.load(urllib.request.urlopen(req)).get("id"))
PY
```

**Why:** the browser fallback is the expensive and dangerous one. It carries the stale-coordinate
resync trap and, worse, the blank-line-submits-the-comment trap that silently fragments one
comment into several partial ones with dropped leading characters
([[project_survivorpulse_notion_comments_via_chrome_composer]]). The REST route has neither
problem, posts multi-paragraph text intact in one call, and works in a non-interactive session
where OAuth cannot be run at all. It is also what lets a dispatched persona subagent post its own
sign-off comment, since the env var is inherited.

**How to apply:** on a `missing_version` failure, check `env | grep -i notion` FIRST. Only if
there is no token do you escalate to OAuth, then to Chrome. Same shape as
[[feedback_search_memory_before_accepting_a_tool_failure_as_fatal]] — the fix existed the whole
time. Note the same 2000-char-per-rich_text-element limit applies as on page properties: split
long text into multiple `rich_text` entries in one payload rather than truncating
([[project_survivorpulse_notion_page_read_truncates_rich_text]]). Never write the token into a
file — read it from the env at call time.
