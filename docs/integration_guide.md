# Integration Guide

This is the priority cross-service doc for VITAL_WEB. Read it before any change that touches network calls, session, login, refresh, or RBAC.

## 1. Gateway-only fetches

```
browser
  │
  │  fetch(`${NEXT_PUBLIC_API_GATEWAY_URL}/...`)
  ▼
BGH_API_GATEWAY :8080
  ▼
target service (UHSE_AUTH | VITAL_Services | UHSE_Backend | BGH_AUDIT_LOGS)
```

- Browser fetches must go to `NEXT_PUBLIC_API_GATEWAY_URL` only.
- Server-side fetches (route handlers, server actions) also go through the Gateway.
- VITAL paths the Gateway forwards to VITAL_Services: `/vital/*`.

## 2. Session bootstrap

On app load, restore session by calling Gateway `GET /auth/session`:

- The Gateway validates the refresh cookie.
- On success, the response body carries the session payload (user id, email, system context, roles).
- The Gateway may also return `X-New-Access-Token` if it performed a silent refresh.
- Store the access token **in memory only**. Do not write it to localStorage.

## 3. Silent refresh handling

Every Gateway response can carry `X-New-Access-Token`. Inspect every response:

```
if (response.headers.has('X-New-Access-Token')) {
  setAccessToken(response.headers.get('X-New-Access-Token'));
}
```

A `401` from the Gateway means the refresh chain failed — clear in-memory state and redirect to login.

## 4. Login

Login does **not** call Auth directly from the browser:

```
form submit
  │
  ▼
Next.js route handler (server)
  │  reads VITAL_AUTH_CLIENT_ID / VITAL_AUTH_CLIENT_SECRET (server-only env)
  │  POSTs to Gateway login endpoint
  ▼
BGH_API_GATEWAY → UHSE_AUTH
  │  sets refresh cookie, returns access token
  ▼
route handler returns the access token to the browser (in-memory store)
```

`VITAL_AUTH_CLIENT_ID` / `VITAL_AUTH_CLIENT_SECRET` must never appear in client bundles. They live in `.env.vital_web` and are read only inside `app/api/**` or server actions.

## 5. RBAC

Role gating reads from the session payload (`/auth/session`). Expected `vital` system roles:

- `vital.admin`
- `vital.staff`
- `vital.public`

Subject to evolution by `UHSE_AUTH`. Do not hard-code role lists in components — derive from session state.

## 6. System context

The Gateway sets `X-System-Context` on the session response. Use it to:

- branch UI between systems if a user has multi-system access
- set the `system` query parameter on outbound calls when needed

## 7. Correlation IDs

Server route handlers should propagate any inbound `X-Correlation-ID` (or generate a UUID) on every Gateway call. The browser doesn't usually need to manage this — the Gateway will generate one.

## 8. What VITAL_WEB does NOT own

- Authentication logic — `UHSE_AUTH`.
- Header injection / silent refresh logic — `BGH_API_GATEWAY`.
- VITAL business logic — `VITAL_Services`.
- Audit storage / retrieval — `BGH_AUDIT_LOGS`.
