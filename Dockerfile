FROM node:22-bookworm-slim AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:22-bookworm-slim

# Install tools the agent needs
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    git \
    curl \
    ripgrep \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install claude-code CLI globally
RUN npm install -g @anthropic-ai/claude-code

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY --from=builder /app/build ./build

# Copy skills from growth-ai-agents (synced at build time)
COPY skills/ /app/skills/

# Generate skill catalog from SKILL.md frontmatter
COPY scripts/generate-skill-catalog.sh /app/scripts/
RUN chmod +x /app/scripts/generate-skill-catalog.sh && \
    /app/scripts/generate-skill-catalog.sh /app/skills /app/skills/catalog.json > /app/skills/catalog.json

# Copy startup scripts
COPY generate-mcp-config.sh entrypoint.sh ./
RUN chmod +x ./generate-mcp-config.sh ./entrypoint.sh

# Create non-root user (required: claude CLI refuses bypass-permissions as root)
RUN useradd -m -s /bin/bash dad && \
    mkdir -p /data/workspace && \
    chown -R dad:dad /data /app

# Start as root so entrypoint can chown /data, then drops to dad user
EXPOSE 8080

CMD ["./entrypoint.sh"]
