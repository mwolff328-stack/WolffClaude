# Session History Tools Not Available in Cowork Weekly Brief

Extracted: 2026-10-30

Context: The Weekly Key Learning Brief scheduled task (and any other scheduled task) that wants to pull "key learnings from past chat sessions" assumes `mcp__session_info__list_sessions` and `mcp__session_info__read_transcript` tools exist in the run environment.

## Problem

In this week's Cowork cloud session, no session_info MCP server or tool was present. ToolSearch turned up nothing under "session_info," "list sessions," or "read transcript" — the tools simply aren't wired into this environment. The "From my conversations" section of the brief had to run empty, with no way to recover mid-run short of guessing.

## Solution

Treat past-chat-session review the same as any other connector preflight (see scheduled-task-connector-preflight.md): check tool availability early via ToolSearch, and if session_info tools are absent, say so plainly in that section rather than fabricating "learnings" or retrying the same search repeatedly. Do not let the missing source block the rest of the brief. If this keeps recurring across weekly runs, the fix belongs in environment/connector setup (confirm whether the account actually has a session-history connector that should be enabled), not in the prompt text.

## When to Use

Activate when building or running any scheduled task that claims to read past Claude chat sessions or transcripts, before assuming `mcp__session_info__*` (or an equivalent) tool exists in that environment.
