# Configuration

VITAL_WEB reads its config from environment variables. In the root compose stack the file is `.env.vital_web` (template at `.env.vital_web.example`).

## Runtime

| Key | Notes |
|---|---|
| `PORT` | Defaults to `3001`. |
| `NODE_ENV` | `development` or `production`. |

## Browser-visible (build args)

These must also be set as Docker build args in `compose.yaml` because Next.js bakes them into the client bundle:

| Key | Default | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_GATEWAY_URL` | `http://localhost:8080` | Where every browser fetch goes. |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3001` | Self URL, used by absolute callbacks. |
| `NEXT_PUBLIC_SYSTEM_SLUG` | `vital` | Drives `X-System-Context` defaults and theming. |

Changing any of these requires `docker compose ... up -d --build vital-web` (not just a restart).

## Server-only

| Key | Notes |
|---|---|
| `VITAL_AUTH_CLIENT_ID` | Mirrors `SYSTEM_VITAL_CLIENT_ID` in `.env.uhse_auth`. Used only in server route handlers / actions. |
| `VITAL_AUTH_CLIENT_SECRET` | Mirrors `SYSTEM_VITAL_CLIENT_SECRET` in `.env.uhse_auth`. Server-only. |

## Prisma

| Key | Notes |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:password@vital-services-db:5432/vital_services_db`. Server-only. Used for SSR read paths only. |
