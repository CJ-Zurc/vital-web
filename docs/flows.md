# Flows

## Session bootstrap on app load

```
browser loads app
  │
  ▼
fetch(`${NEXT_PUBLIC_API_GATEWAY_URL}/auth/session`, { credentials: 'include' })
  │
  ▼
BGH_API_GATEWAY validates refresh cookie
  │  may emit X-New-Access-Token (silent refresh)
  ▼
session payload { user, roles, system_context }
  │
  ▼
hydrate in-memory auth store, render guarded routes
```

## Login

```
login form submit
  │
  ▼
POST /api/login (Next.js route handler, server)
  │  uses VITAL_AUTH_CLIENT_ID / VITAL_AUTH_CLIENT_SECRET
  ▼
POST `${GATEWAY}/auth/login`
  │
  ▼
BGH_API_GATEWAY → UHSE_AUTH
  │  sets HttpOnly refresh cookie
  │  returns access token + session payload
  ▼
route handler returns { accessToken, session } to browser
  │
  ▼
in-memory store, redirect to dashboard
```

## VITAL business call

```
component triggers action
  │
  ▼
fetch(`${GATEWAY}/vital/appointments`, {
  headers: { Authorization: `Bearer ${accessToken}` },
  credentials: 'include'
})
  │
  ▼
BGH_API_GATEWAY validates JWT, injects X-Gateway-Secret + X-User-*
  ▼
VITAL_Services /vital/appointments
  │
  ▼
response (with X-Correlation-ID, possibly X-New-Access-Token)
```
