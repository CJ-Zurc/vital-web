# Architecture

VITAL_WEB is a Next.js BFF application. The browser talks to VITAL_WEB route handlers under `/api/*`; those handlers talk to the BGH API Gateway. This keeps server-only client credentials and refresh cookies out of browser code while preserving the workspace rule that frontends use the Gateway boundary.

## Boundaries

| Layer | Owns |
|---|---|
| Browser pages/components | UI state, form validation, and calls to local `/api/*` |
| VITAL_WEB route handlers | BFF orchestration, Prisma-backed VITAL UI data, Gateway calls |
| BGH API Gateway | JWT verification, route classification, trusted downstream headers, silent refresh |
| UHSE_AUTH | login, registration, refresh, session tokens, system access, role aggregation |
| UHSE_EHR | patient registry and clinical identity after Gateway trust validation |

## Local Data

The Prisma schema stores VITAL-specific UI data such as `VitalUser`, `VitalPatient`, appointments, consents, schedules, and local health-record metadata. Auth identity stays in UHSE_AUTH, referenced by `authId`. EHR patient identity stays in UHSE_EHR and is accessed through Gateway `/ehr/*` routes.

## Session Model

The browser stores no long-lived readable token. Login and verification responses hydrate an in-memory access token. Full reloads call local `GET /api/auth/session`, which proxies Gateway `GET /auth/session` using the httpOnly refresh cookie and returns a fresh access token for memory.
