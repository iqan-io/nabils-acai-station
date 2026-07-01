<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes; APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Client Site Agent Notes

This is the deployable website repo for Nabil's Acai Station. It should use the central IQAN agency harness, not a copied local harness.

## Harness

- If this repo is inside `web-clients/`, read `../../../AGENTS.md` first, then `../../../agency-workflows/AGENTS.md`.
- Start client work from the relevant workflow in `../../../agency-workflows/workflows/`.
- Use deterministic tools from `../../../agency-workflows/tools/` before improvising manual steps.
- Do not recreate `workflows/`, `tools/`, `skills/`, `HARNESS.md`, or `CONSTRAINTS.md` inside this site repo unless the user explicitly asks.

## Client State

- Read `../notes.md` and `../design/brief.md` before implementation.
- Use `../PROGRESS.md`, `../DECISIONS.md`, a feature list, or a run summary when work needs durable state.
- Record external links, verification results, open blockers, and next actions in client state files.

## Guardrails

- Do not invent business facts such as hours, phone numbers, menu items, prices, locations, legal claims, certifications, reviews, or availability.
- Do not commit secrets, `.env` files, OAuth tokens, raw client source media, or generated temporary output.
- Verify changes with the site's local checks and any workflow-specific feedback before declaring work complete.
