#!/bin/sh
# Fix ownership of /data volume (created as root in previous deploys)
chown -R dad:dad /data

# Switch to dad user and run the MCP config generator + app
exec su dad -c "./generate-mcp-config.sh"
