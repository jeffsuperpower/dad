#!/bin/sh
# Generate MCP config with env vars substituted at runtime
cat > /app/mcp-config.json <<MCPEOF
{
  "mcpServers": {
    "webflow": {
      "command": "npx",
      "args": ["-y", "webflow-mcp-server"],
      "env": {
        "WEBFLOW_TOKEN": "${MCP_WEBFLOW_TOKEN}"
      }
    },
    "airtable": {
      "command": "npx",
      "args": ["-y", "airtable-mcp-server"],
      "env": {
        "AIRTABLE_API_KEY": "${MCP_AIRTABLE_API_KEY}"
      }
    },
    "reddit": {
      "command": "npx",
      "args": ["-y", "reddit-mcp"],
      "env": {
        "REDDIT_CLIENT_ID": "${MCP_REDDIT_CLIENT_ID}",
        "REDDIT_CLIENT_SECRET": "${MCP_REDDIT_CLIENT_SECRET}"
      }
    },
    "youtube": {
      "command": "npx",
      "args": ["-y", "@kirbah/mcp-youtube"],
      "env": {
        "YOUTUBE_API_KEY": "${MCP_YOUTUBE_API_KEY}"
      }
    },
    "posthog": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://mcp.posthog.com/mcp", "--header", "Authorization:${MCP_POSTHOG_AUTH_HEADER}"],
      "env": {}
    },
    "ahrefs": {
      "command": "npx",
      "args": ["-y", "@ahrefs/mcp"],
      "env": {
        "API_KEY": "${MCP_AHREFS_API_KEY}"
      }
    },
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "klaviyo-mcp-server@latest"],
      "env": {
        "PRIVATE_API_KEY": "${MCP_KLAVIYO_API_KEY}",
        "READ_ONLY": "true"
      }
    },
    "slack-mcp": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${MCP_SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${MCP_SLACK_TEAM_ID}"
      }
    }
  }
}
MCPEOF

echo "MCP config generated at /app/mcp-config.json"
exec node build/index.js
