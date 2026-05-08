# VITAL_WEB Documentation

VITAL_WEB is the VITAL browser UI for the BGH Unified Health Service Ecosystem. It is a Next.js 16 / React 19 / Prisma application that calls the BGH API Gateway exclusively.

## Contents

- [architecture.md](./architecture.md) — app layout, routing, data layer
- [integration_guide.md](./integration_guide.md) — Gateway / session contract (start here)
- [security.md](./security.md) — token handling, server-only secrets
- [configuration.md](./configuration.md) — env keys
- [deployment.md](./deployment.md) — Docker build and root compose wiring
- [flows.md](./flows.md) — session bootstrap, login, refresh
- [testing.md](./testing.md) — testing conventions

## Quick facts

- **Stack:** Next.js 16, React 19, TypeScript, Prisma 7, Tailwind 4
- **Port:** `3001`
- **System slug:** `vital`
- **Gateway target:** `NEXT_PUBLIC_API_GATEWAY_URL` (default `http://localhost:8080`)
- **Backend pair:** `VITAL_Services` on port `8009`
