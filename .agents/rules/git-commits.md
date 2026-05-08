---
trigger: always_on
description: Required commit format and structure for VITAL_WEB. Mirrors the workspace-wide BGH commit convention.
---

# Git Commit Rules

## 1. Commit Structure

```
<type>(<scope>): <concise description in past-tense> [<TICKET_ID>]

- <Detailed bullet point>
- <Another bullet point>
```

### Components

1. **Type**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`, `revert`
2. **Scope**: module/feature name (e.g., `web`, `session`, `appointment`, `telemedicine`, `gateway`)
3. **Summary**: past-tense
4. **Project Tag**: `[VITAL-M0-F0]`
5. **Body**: hyphenated list, relative file paths only

## Examples

```
feat(session): wired GET /auth/session bootstrap on app load [VITAL-M0-F0]

- Added app/(auth)/restore.ts handler
- Updated docs/integration_guide.md with the new flow
- Documented VITAL_AUTH_CLIENT_* env keys in docs/configuration.md
```

## 2. Don'ts

- Do not skip the type or scope.
- Do not amend pushed commits unless explicitly requested.
- Do not bypass hooks (`--no-verify`) unless explicitly requested.
- Do not put secrets in commit messages.
