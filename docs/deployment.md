# Deployment

VITAL_WEB is wired into the BGH workspace via the **root** compose at `D:\repos\Capstone_BGH\compose.yaml`.

## Image build

The Dockerfile is a multi-stage Node 20-alpine build:

1. `builder` — installs full deps, accepts `NEXT_PUBLIC_*` build args, runs `prisma generate`, then `next build`.
2. `runner` — production image with `node_modules` + built `.next` + `public` + `next.config.ts` + `prisma`. Runs `next start -p 3001`.

## Root compose entry

```yaml
vital-web:
  env_file: ./.env.vital_web
  build:
    context: ./VITAL_WEB
    args:
      NEXT_PUBLIC_API_GATEWAY_URL: ${NEXT_PUBLIC_API_GATEWAY_URL:-http://localhost:8080}
      NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL_VITAL:-http://localhost:3001}
      NEXT_PUBLIC_SYSTEM_SLUG: vital
  ports: "${VITAL_WEB_PORT:-3001}:3001"
  depends_on:
    bgh-gateway: service_started
```

## Running

From `D:\repos\Capstone_BGH`:

```powershell
docker compose --env-file .env.compose up -d --build --force-recreate vital-web
docker compose --env-file .env.compose logs -f vital-web
```

Or via the phased starter (VITAL_WEB starts in the `Frontends` phase):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-bgh-ecosystem.ps1
```

## Smoke test

```powershell
curl http://localhost:3001
# expected: HTML response from Next.js
```

Open `http://localhost:3001` in a browser and verify:

1. The page loads without console errors.
2. Network tab shows fetches to `http://localhost:8080`, never to `:8009` directly.
