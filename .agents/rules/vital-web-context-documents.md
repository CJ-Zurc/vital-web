---
trigger: always_on
description: Structural and documentation rules for the VITAL_WEB Next.js frontend. Lists doc organization and code-to-doc parity expectations.
---

# VITAL_WEB: Context Documents

`VITAL_WEB` is the VITAL browser UI for the BGH Unified Health Service Ecosystem. It is built with Next.js 16 + React 19 + Prisma and replaces whatever VITAL UI existed on the old NestJS-era stack.

## Required reading before edits

1. `README.md`
2. `AGENTS.md` (Next.js 16 has breaking changes from common training data — heed it)
3. `docs/README.md`
4. `docs/integration_guide.md` — Gateway / session / RBAC contract
5. `.agents/rules/*` (all)

For cross-service work also consult:

- `../.agents/rules/root-workspace-context.md`
- `../.agents/rules/root-repo-routing.md`
- `../Documents/VITAL_Integration_Guide_v1.md`
- `../Documents/Auth_Frontend_Integration_Guide_v4.md`

## Code-to-doc parity

| Code area | Doc that must stay in sync |
|---|---|
| `app/**` route handlers and pages | `docs/architecture.md`, `docs/flows.md` |
| Gateway client / fetch wrapper | `docs/integration_guide.md`, `docs/security.md` |
| Session bootstrap (`/auth/session`) | `docs/integration_guide.md` |
| `prisma/schema.prisma` | `docs/architecture.md` |
| `Dockerfile`, root compose entry | `docs/deployment.md` |
| Env keys (`.env.example`) | `docs/configuration.md` |

## Boundaries

- VITAL_WEB calls the **Gateway only**. It must not call `vital-services-api`, `auth-api`, or any other backend directly from the browser.
- Server-only secrets (`VITAL_AUTH_CLIENT_SECRET`) are never exposed to the browser. Use them only in server actions, route handlers, or middleware.
- `NEXT_PUBLIC_*` variables are baked into the client bundle at build time and are public — do not put secrets there.
