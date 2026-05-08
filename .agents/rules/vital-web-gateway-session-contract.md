---
trigger: always_on
description: Required Gateway and session-contract rules for VITAL_WEB. Covers Gateway-only fetches, session restore, silent refresh, and X-System-Context handling.
---

# VITAL_WEB: Gateway and Session Contract Rules

Apply these rules whenever work touches outbound HTTP, session bootstrap, route gating, or anything that reads / persists tokens.

## 1. Gateway is the only outbound target

- All browser fetches go to `NEXT_PUBLIC_API_GATEWAY_URL` (default `http://localhost:8080`).
- Never fetch `http://vital-services-api:8009`, `http://auth-api:8000`, or any backend host directly from client code.
- Server-side route handlers may proxy through the Gateway too; they should not bypass it just because they are server-side.

## 2. Session restore

- On app load, restore in-memory auth state by calling Gateway `GET /auth/session` (cookies are sent automatically).
- The Gateway will validate the refresh cookie and may return:
  - a fresh `X-New-Access-Token` header → store in memory and use for subsequent calls
  - `X-System-Context` → drives client-side RBAC and route gating
- Do not derive session state from local storage or hand-rolled cookie parsing.

## 3. Silent refresh

- Inspect every Gateway response for `X-New-Access-Token`. When present, replace the in-memory token before the next request.
- A 401 from the Gateway means the refresh chain failed; redirect to login rather than retrying with stale state.

## 4. Login proxy (server-only)

- The login form does **not** call Auth directly. It posts to a Next.js route handler, which uses `VITAL_AUTH_CLIENT_ID` + `VITAL_AUTH_CLIENT_SECRET` to call the Gateway login endpoint.
- These two env keys are **server-only**. Never reference them in client components or in `NEXT_PUBLIC_*` variables.

## 5. RBAC

- Role gating reads from the session payload returned by `GET /auth/session`. Do not hard-code role lists.
- For the `vital` system slug, expect roles like `vital.admin`, `vital.staff`, `vital.public` (subject to evolution by `UHSE_AUTH`).

## 6. Correlation IDs

- When making a fetch from a server-side handler, propagate the inbound `X-Correlation-ID` header (or generate a UUID) so VITAL operations stay traceable end-to-end.

## 7. What VITAL_WEB does NOT own

- JWT issuance, refresh rotation, password reset — `UHSE_AUTH`.
- Header injection, route classification, silent-refresh logic — `BGH_API_GATEWAY`.
- Appointment / telemedicine business rules — `VITAL_Services`.
