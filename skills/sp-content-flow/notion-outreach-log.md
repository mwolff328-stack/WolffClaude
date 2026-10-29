# Notion Outreach Log (after the founder posts a social reply or DM)

Data source: `collection://498922d6-8e0d-4ec1-8ec0-95808ef761a2`

Fields: Platform, Thread URL, Prospect (relation), Message Sent, Outreach Date, Response Status, Response Received, Response Text, Outcome, Next Step, Last Checked, Last Seen Engagement.

Procedure:
1. Notion tool schemas are deferred. Load with ToolSearch: `notion-fetch`, `notion-create-pages`, `notion-update-page`, `notion-query-data-sources`.
2. `notion-fetch` an existing Outreach Log row first to copy exact property formats. Date properties are split: `date:Field:start` and `date:Field:is_datetime`.
3. `notion-query-data-sources` needs `mode: "sql"` and bracketed table names.
4. Message Sent = what the founder actually posted.
5. Then offer to update the Prospect Tracker record (Status, Framework Used, Date Contacted).

Only write when the founder confirms he posted or explicitly asks.
