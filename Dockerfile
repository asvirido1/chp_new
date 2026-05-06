FROM node:22-bookworm-slim AS builder

RUN corepack enable

WORKDIR /app

# Copy workspace manifests first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY artifacts/api-server/package.json artifacts/api-server/
COPY artifacts/api-server/tsconfig.json artifacts/api-server/
COPY artifacts/api-server/build.mjs artifacts/api-server/
COPY lib ./lib

# Install dependencies for the api-server workspace and its transitive deps
RUN pnpm install --frozen-lockfile --filter @workspace/api-server...

# Copy api-server sources and build
COPY artifacts/api-server/src ./artifacts/api-server/src
RUN pnpm --filter @workspace/api-server run build

# Runtime image
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts and node_modules from builder
COPY --from=builder /app /app

WORKDIR /app/artifacts/api-server

EXPOSE 8080

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
