# syntax=docker/dockerfile:1
# Derived from ADR-0002, ADR-0005, and ADR-0006.

FROM ghcr.io/astral-sh/uv:python3.14-bookworm-slim AS builder

ENV PYTHONUNBUFFERED=1
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

WORKDIR /workspace

COPY apps/api ./apps/api
COPY public-data ./public-data

RUN uv sync --project apps/api --locked --no-dev

FROM ghcr.io/astral-sh/uv:python3.14-bookworm-slim AS runner

ENV ITAM_PLANNER_PUBLIC_DATA_ROOT=/workspace/public-data
ENV PYTHONUNBUFFERED=1
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

WORKDIR /workspace

COPY --from=builder /workspace /workspace

EXPOSE 8000

CMD ["uv", "run", "--project", "apps/api", "--no-sync", "python", "-m", "itam_planner_api.cli", "serve", "--host", "0.0.0.0", "--port", "8000"]
