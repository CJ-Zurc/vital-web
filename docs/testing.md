# Testing

VITAL_WEB is currently a scaffold; no test suite is checked in yet.

When tests are added, prefer:

- `vitest` + `@testing-library/react` for unit / component tests
- Playwright for end-to-end browser tests against the running root compose stack
- Hit a real Gateway in E2E tests, not a mock — the trust contract is what matters

## Smoke check (until a suite exists)

From `D:\repos\Capstone_BGH`:

```powershell
docker compose --env-file .env.compose up -d --build vital-web
curl http://localhost:3001
```

Open `http://localhost:3001` and confirm the Next.js page renders.
