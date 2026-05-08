<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# VITAL_WEB Service Rules

Before making code changes in this service, you MUST review the local rules and documentation:

1. `.agents/rules/*`
2. `.agents/skills/*` (if applicable)
3. `docs/README.md`
4. `docs/integration_guide.md` (Gateway / session contract)

**Cross-Service Work:** If your task spans multiple services, refer to the root workspace context:

- `../.agents/rules/root-repo-routing.md`
- `../.agents/rules/root-workspace-context.md`
- `../Documents/VITAL_Integration_Guide_v1.md`
- `../Documents/Auth_Frontend_Integration_Guide_v4.md`
