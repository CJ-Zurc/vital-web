---
description: Scaffolds a BGH-style commit message for VITAL_WEB changes.
---

# git-commits skill

Produces a commit message that matches `.agents/rules/git-commits.md`.

## Required inputs

- **type**: feat | fix | chore | docs | refactor | test | style | perf | ci | revert
- **scope**: short slug (e.g. `web`, `session`, `appointment`, `telemedicine`, `gateway`)
- **summary**: past-tense, < 70 chars
- **ticket**: VITAL-M{n}-F{n}
- **changed paths**: repo-relative

## Output template

```
<type>(<scope>): <summary> [<ticket>]

- <bullet 1, references repo-relative path>
- <bullet 2>
```
