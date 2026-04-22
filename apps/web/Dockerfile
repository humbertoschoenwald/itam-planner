# syntax=docker/dockerfile:1
# Derived from ADR-0002, ADR-0005, and ADR-0006.

FROM node:25-bookworm-slim AS builder

ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

ARG NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL=
ENV NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL=${NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL}

RUN npm install --global --no-update-notifier --no-fund pnpm@10.33.0

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY public-data ./public-data
COPY scripts ./scripts

RUN pnpm install --frozen-lockfile

COPY apps/web ./apps/web

RUN pnpm --filter @itam-planner/web build

FROM node:25-bookworm-slim AS runner

ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=builder /workspace/apps/web/.next/standalone ./
COPY --from=builder /workspace/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /workspace/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
