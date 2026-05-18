# Integration Guide

## Gateway Access

VITAL_WEB route handlers call the BGH API Gateway using the server-side Gateway base URL. Browser components call local VITAL_WEB `/api/*` routes only.

- Browser base URL: `NEXT_PUBLIC_API_GATEWAY_URL` is public and used only when a browser-visible Gateway URL is needed.
- Server base URL: `GATEWAY_URL` is used by route handlers; root compose should set it to `http://bgh-gateway:8080`.
- Route handlers must forward bearer tokens to Gateway when they call protected routes.
- EHR Gateway calls set `X-System-Context: ehr` so Gateway projects EHR roles into downstream `X-User-System-Roles`; VITAL_WEB still does not mint trusted `X-User-*` headers itself.

## Auth And Session

- Login, registration, verification, refresh, logout, and session bootstrap are Auth-owned contracts reached through Gateway.
- VITAL_WEB keeps access tokens in memory and refreshes them by calling local `GET /api/auth/session`.
- The refresh token is an httpOnly cookie set by Auth/Gateway and passed through by VITAL_WEB route handlers.
- Local BFF responses that recover a session include `X-New-Access-Token` so client helpers can replace the in-memory token.

## EHR Patient Flows

Patient-facing VITAL_WEB routes must use patient-safe EHR routes:

| VITAL_WEB need | Gateway route |
|---|---|
| Read caller's linked EHR patient | `GET /ehr/patients/me` |
| Create caller's EHR patient profile | `POST /ehr/patients/me` |
| Claim an existing patient record | `POST /ehr/patients/{patient_id}/claim` |

`GET /ehr/patients/by-auth-id/{auth_id}` is staff-only in EHR and must not be used by VITAL_WEB patient flows.

## Correlation And Trust

Gateway injects `X-Gateway-Secret`, `X-User-*`, sanitized forwarding headers, and `X-Correlation-ID` downstream. VITAL_WEB does not mint trusted downstream headers; it supplies user bearer tokens to Gateway and lets Gateway project the trusted context.
