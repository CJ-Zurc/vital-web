---
trigger: always_on
description: Local Docker rebuild and run conventions for VITAL_WEB.
---

# Docker Rebuild Rules

VITAL_WEB runs through the **root** compose at `D:\repos\Capstone_BGH\compose.yaml`.

## Targeted rebuild

From `D:\repos\Capstone_BGH`:

```powershell
docker compose --env-file .env.compose up -d --build --force-recreate vital-web
docker compose --env-file .env.compose logs -f vital-web
```

## After modifying

- `package.json` / `package-lock.json` → rebuild with `--build`.
- `app/**`, `components/**`, `lib/**` → rebuild with `--build` (production image bakes the build).
- `next.config.ts`, `tsconfig.json` → rebuild with `--build`.
- `prisma/schema.prisma` → rebuild with `--build` (Prisma generates inside the image).
- `.env.vital_web` (root) → restart only; runtime env vars are read at boot.
- `NEXT_PUBLIC_*` build args (compose `args:` block) → must `--build` because they are baked into the client bundle.

## Notes

- The root compose passes `NEXT_PUBLIC_API_GATEWAY_URL` and `NEXT_PUBLIC_APP_URL` as build args. Changing these in `.env.vital_web` alone is not enough — the image must be rebuilt.
- Do not invent a per-repo `compose.yaml` here; root compose owns the wiring.
