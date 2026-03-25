---
name: appify-x-listening
description: Placeholder skill for future Appify API integration. Will enable real-time social listening on Twitter/X for trendjacking and conversation monitoring. Currently not active — use social-listening skill with WebSearch as an alternative.
---

# Appify X Listening (Placeholder)

## Status: Coming Soon

This skill will integrate with the Appify API to provide real-time social listening on Twitter/X.

## Planned Capabilities

- **Trend monitoring:** Identify trending health topics on X in real-time
- **Trendjacking:** Surface opportunities to quote or react to viral health conversations
- **Conversation tracking:** Monitor mentions of Superpower, competitors, and key health topics
- **Influencer signals:** Track what health authorities are posting and engagement patterns

## Current Alternative

Until the Appify API is connected, use the `social-listening` skill with WebSearch to manually scan X trends. This works for ideation but lacks real-time monitoring.

## Future Integration

When Appify is connected, Tom (Twitter agent) will use this skill to:
1. Identify trendjacking opportunities before ideation
2. Monitor competitor activity on X in real-time
3. Track health discourse for reactive content
4. Surface high-engagement conversations for quoting/replying

## Setup Requirements (TBD)

- Appify API key
- Configuration in plugin.json MCP servers
- Filtering rules for relevant health conversations
- Alert thresholds for trending topics
