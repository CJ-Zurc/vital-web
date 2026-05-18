# VITAL_WEB Docs

VITAL_WEB is the browser UI and BFF layer for VITAL. Browser code calls local `/api/*` routes. Those route handlers call the BGH API Gateway; they do not call Auth, EHR, or VITAL backends directly.

## Current Source Of Truth

- [architecture.md](architecture.md): application boundaries, BFF shape, and local data ownership.
- [integration_guide.md](integration_guide.md): Gateway, session, auth, and EHR integration rules.
- [flows.md](flows.md): login, session bootstrap, and patient onboarding sequences.
- [configuration.md](configuration.md): environment variables and Docker runtime configuration.

## Core Rules

- Client-visible variables use `NEXT_PUBLIC_*` only.
- Server route handlers use server-only env values and call the Gateway.
- Access tokens are held in memory after login or session bootstrap.
- The refresh token remains an httpOnly cookie managed by Auth/Gateway.
- Patient EHR flows use patient-safe routes only: `GET /ehr/patients/me`, `POST /ehr/patients/me`, and claim routes.
