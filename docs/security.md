# Security

## Token handling

- Access tokens live **in memory only**. Never store them in `localStorage` or `sessionStorage`.
- Refresh tokens are managed by the Gateway via HttpOnly cookies. VITAL_WEB never reads them directly.
- Treat the access token as opaque — do not parse claims client-side. Use the session payload from `/auth/session` for everything UI needs.

## Server-only env keys

These must never appear in client bundles or `NEXT_PUBLIC_*` variables:

- `VITAL_AUTH_CLIENT_ID`
- `VITAL_AUTH_CLIENT_SECRET`
- `DATABASE_URL` (Prisma uses this on the server only)

If you need a value in the browser, expose it via `NEXT_PUBLIC_*` with the understanding that it is public.

## Public env keys

These are baked into the client bundle at build time:

- `NEXT_PUBLIC_API_GATEWAY_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SYSTEM_SLUG`

Changing them requires a rebuild, not just a container restart.

## Logging

- Do not log JWTs, raw `Authorization` headers, or session cookies.
- Do not log full request bodies for VITAL flows (PII / appointment medical context).
- Log correlation IDs, status codes, and route paths.

## CORS

The Gateway enforces CORS for browser origins. `http://localhost:3001` must appear in the Gateway's `CORS_ALLOW_ORIGINS` list — already wired in `.env.bgh_api_gateway.example`.
