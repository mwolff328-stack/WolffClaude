import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const DISCORD_API = "https://discord.com/api/v10";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
if (!BOT_TOKEN) {
    process.stderr.write("ERROR: DISCORD_BOT_TOKEN environment variable is required\n");
    process.exit(1);
}
const headers = {
    Authorization: `Bot ${BOT_TOKEN}`,
    "Content-Type": "application/json",
};
async function discordFetch(path) {
    const res = await fetch(`${DISCORD_API}${path}`, { headers });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Discord API error ${res.status}: ${body}`);
    }
    return res.json();
}
function formatMessage(msg) {
    const author = msg.author.global_name ?? msg.author.username;
    const time = new Date(msg.timestamp).toLocaleString();
    const edited = msg.edited_timestamp ? " (edited)" : "";
    const lines = [`[${time}]${edited} **${author}**: ${msg.content}`];
    if (msg.attachments.length > 0) {
        lines.push(`  Attachments: ${msg.attachments.map((a) => a.filename).join(", ")}`);
    }
    if (msg.embeds.length > 0) {
        for (const e of msg.embeds) {
            if (e.title)
                lines.push(`  Embed: ${e.title}${e.description ? ` — ${e.description}` : ""}`);
        }
    }
    return lines.join("\n");
}
const server = new McpServer({
    name: "discord-reader",
    version: "1.0.0",
});
server.registerTool("get_messages", {
    description: "Fetch recent messages from a Discord channel. Returns messages in reverse-chronological order (newest first). Use channel_id from the Discord URL or get_channel_info.",
    inputSchema: z.object({
        channel_id: z.string().describe("Discord channel ID (numeric snowflake)"),
        limit: z
            .number()
            .int()
            .min(1)
            .max(100)
            .default(50)
            .describe("Number of messages to fetch (1–100, default 50)"),
        before: z
            .string()
            .optional()
            .describe("Fetch messages before this message ID (for pagination)"),
        after: z
            .string()
            .optional()
            .describe("Fetch messages after this message ID"),
    }),
    annotations: { readOnlyHint: true, openWorldHint: true },
}, async ({ channel_id, limit, before, after }) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (before)
        params.set("before", before);
    if (after)
        params.set("after", after);
    const messages = (await discordFetch(`/channels/${channel_id}/messages?${params}`));
    if (messages.length === 0) {
        return { content: [{ type: "text", text: "No messages found." }] };
    }
    const formatted = messages.map(formatMessage).join("\n\n");
    const oldest = messages[messages.length - 1];
    return {
        content: [
            {
                type: "text",
                text: `${messages.length} messages from channel ${channel_id}:\n\n${formatted}\n\n---\nOldest message ID: ${oldest.id} (use as 'before' to paginate further back)`,
            },
        ],
    };
});
server.registerTool("search_messages", {
    description: "Fetch messages from a Discord channel and filter by keyword. Searches through up to 100 recent messages (Discord's REST API doesn't support full-text search for bots). Returns matching messages with context.",
    inputSchema: z.object({
        channel_id: z.string().describe("Discord channel ID"),
        keyword: z.string().describe("Keyword or phrase to search for (case-insensitive)"),
        limit: z
            .number()
            .int()
            .min(1)
            .max(100)
            .default(100)
            .describe("How many recent messages to scan (default 100)"),
        before: z.string().optional().describe("Scan messages before this message ID"),
    }),
    annotations: { readOnlyHint: true, openWorldHint: true },
}, async ({ channel_id, keyword, limit, before }) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (before)
        params.set("before", before);
    const messages = (await discordFetch(`/channels/${channel_id}/messages?${params}`));
    const lower = keyword.toLowerCase();
    const matches = messages.filter((m) => m.content.toLowerCase().includes(lower) ||
        m.embeds.some((e) => e.title?.toLowerCase().includes(lower) ||
            e.description?.toLowerCase().includes(lower)));
    if (matches.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: `No messages containing "${keyword}" found in the last ${messages.length} messages.`,
                },
            ],
        };
    }
    const formatted = matches.map(formatMessage).join("\n\n");
    return {
        content: [
            {
                type: "text",
                text: `Found ${matches.length} message(s) containing "${keyword}" (scanned ${messages.length}):\n\n${formatted}`,
            },
        ],
    };
});
server.registerTool("get_channel_info", {
    description: "Get metadata about a Discord channel: name, topic, type, and server (guild) ID.",
    inputSchema: z.object({
        channel_id: z.string().describe("Discord channel ID"),
    }),
    annotations: { readOnlyHint: true },
}, async ({ channel_id }) => {
    const channel = (await discordFetch(`/channels/${channel_id}`));
    const typeNames = {
        0: "Text",
        2: "Voice",
        4: "Category",
        5: "Announcement",
        11: "Public Thread",
        12: "Private Thread",
        15: "Forum",
    };
    const typeName = typeNames[channel.type] ?? `Type ${channel.type}`;
    return {
        content: [
            {
                type: "text",
                text: [
                    `Channel: #${channel.name ?? channel_id}`,
                    `ID: ${channel.id}`,
                    `Type: ${typeName}`,
                    channel.topic ? `Topic: ${channel.topic}` : null,
                    channel.guild_id ? `Server (guild) ID: ${channel.guild_id}` : null,
                ]
                    .filter(Boolean)
                    .join("\n"),
            },
        ],
    };
});
server.registerTool("list_guild_channels", {
    description: "List all channels in a Discord server (guild). Useful for finding channel IDs by name.",
    inputSchema: z.object({
        guild_id: z.string().describe("Discord server (guild) ID"),
    }),
    annotations: { readOnlyHint: true },
}, async ({ guild_id }) => {
    const channels = (await discordFetch(`/guilds/${guild_id}/channels`));
    const typeNames = {
        0: "text",
        2: "voice",
        4: "category",
        5: "announcement",
        11: "thread",
        15: "forum",
    };
    const sorted = [...channels].sort((a, b) => {
        if (a.type === 4 && b.type !== 4)
            return -1;
        if (a.type !== 4 && b.type === 4)
            return 1;
        return (a.name ?? "").localeCompare(b.name ?? "");
    });
    const lines = sorted.map((c) => `#${c.name ?? c.id} (${typeNames[c.type] ?? c.type}) — ID: ${c.id}`);
    return {
        content: [{ type: "text", text: `Channels in guild ${guild_id}:\n\n${lines.join("\n")}` }],
    };
});
const transport = new StdioServerTransport();
await server.connect(transport);
