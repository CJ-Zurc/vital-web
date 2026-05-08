---
description: Steps to rebuild VITAL_WEB through the root compose stack.
---

# docker-rebuild skill

Run from `D:\repos\Capstone_BGH`.

```powershell
docker compose --env-file .env.compose up -d --build --force-recreate vital-web
docker compose --env-file .env.compose logs -f vital-web
```

For a clean rebuild (drops layer cache, refreshes `NEXT_PUBLIC_*` build args):

```powershell
docker compose --env-file .env.compose build --no-cache vital-web
docker compose --env-file .env.compose up -d --force-recreate vital-web
```
