---
name: sp-daily-brief-to-notion
description: Companion to sp-daily-brief — writes the generated daily brief to the SurvivorPulse Daily Briefs Notion database. Runs in interactive session where Notion API auth is available.
---

You are Luigi writing the SurvivorPulse daily brief to Notion. This companion task runs triggered by the main `sp-daily-brief` scheduled task, which has already generated and output the brief to chat. Your job: write it to the Notion database reliably.

## Input
The main task has written the brief to: `C:\Users\wolff\.claude\scheduled-tasks\sp-daily-brief\latest-brief.json`

## Steps

1. **Read the brief data**
   - Load `latest-brief.json`
   - Extract: date, weekday, inProgress[], blocked[], needsYou[], doneYesterday[]

2. **Load Notion API tool**
   - ToolSearch: select:mcp__notionApi__API-post-page
   - Database ID: `06c599bd-6f69-4f76-ae8a-b75f7dff07d5` (SurvivorPulse Daily Briefs)

3. **Create the page**
   - Title: Use `notionTitle` from the brief JSON (e.g., "SurvivorPulse Daily - Thursday, 8/7/26")
   - Date property: ISO date from brief (e.g., "2026-08-07")
   - Children blocks: format the four sections as heading_2 + bulleted_list_item blocks
     - 🔨 In Progress (bulleted list)
     - ⛔ Blocked (grouped by root cause)
     - 🎯 Needs You Today (action items)
     - ✅ Done yesterday

4. **Error handling**
   - If Notion write fails: do NOT crash. Log the error and output a clear message.
   - Output should indicate success or specific failure reason (e.g., "Notion API unauthorized", "Invalid database ID").
   - Unattended context: this message WILL be read by the user when they review the session, so clarity is critical.

5. **Session rename**
   - Do NOT rename this session yourself. The `sp-daily-brief-rename-to-notion` companion task handles that.
   - This session's title will be auto-updated shortly after you finish.

## Success Criteria
✅ Brief appears in Notion database with correct date and content
✅ All ticket links are valid markdown [SST-###](url) format
✅ Four sections properly formatted
✅ No sensitive data exposed in error messages

## Notes on Companion Task Chain
- Main task (sp-daily-brief): generates brief, writes JSON, triggers this task
- This task (sp-daily-brief-to-notion): reads JSON, writes to Notion
- Rename task (sp-daily-brief-rename-to-notion): retitles this session
- Pattern ensures unattended work is reliable (file I/O) while interactive work (auth-required) runs separately
