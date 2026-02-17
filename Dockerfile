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

# Install claude-code globally (Agent SDK requires the CLI)
RUN npm install -g @anthropic-ai/claude-code

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY --from=builder /app/build ./build

# Create workspace directory
RUN mkdir -p /data/workspace

EXPOSE 8080

CMD ["node", "build/index.js"]
