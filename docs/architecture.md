# Architecture

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma 7 (PostgreSQL client; talks to the same DB as `VITAL_Services`)
- Tailwind 4 + PostCSS
- ESLint + Next ESLint config

## Layout

```
app/                    Next.js App Router pages, layouts, route handlers
prisma/
  schema.prisma         Shared schema with VITAL_Services
public/                 Static assets
prisma.config.ts        Prisma config
next.config.ts          Next.js config
```

## Data layer

VITAL_WEB shares the `vital_services_db` Postgres database with `VITAL_Services`. Prisma is used for read paths in server components / route handlers when SSR needs joined data quickly.

**Writes always flow through the Gateway → VITAL_Services HTTP API**, not through Prisma directly. This keeps a single source of business rules and audit publishing.

## Outbound calls

| From | To | Protocol |
|---|---|---|
| Browser | `BGH_API_GATEWAY` (`NEXT_PUBLIC_API_GATEWAY_URL`) | HTTPS (or HTTP locally) |
| Server route handlers | `BGH_API_GATEWAY` | HTTP, propagates correlation ID |
| Server route handlers (login proxy) | Gateway login endpoints | HTTP with server-only client credentials |
| Server (SSR reads) | `vital-services-db` via Prisma | TCP |

VITAL_WEB **never** calls `vital-services-api`, `auth-api`, or any other backend service host directly.
