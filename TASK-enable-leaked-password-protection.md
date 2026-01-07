# TASK: enable-leaked-password-protection

Created: 2026-01-07
Lane: Supabase
Phase: 2
Status: BLOCKED (HUMAN)

## Objective
Enable leaked password protection in Supabase Auth settings (dashboard-only change).

## Tasks
- [ ] In Supabase Dashboard -> Auth -> Settings -> Passwords, enable leaked password protection.
- [ ] Confirm the setting persists after refresh (record timestamp + setting name).
- [ ] If MCP access is available, run `mcp_supabase_get_advisors({ type: "security" })` after the change.

## Files to touch
- Supabase Dashboard (Auth -> Settings -> Passwords)

## Gates
- [ ] N/A (dashboard-only change)

## Review checklist (Codex)
- [ ] Security: leaked password protection enabled
- [ ] No secrets logged

## Handoff (Opus)
Files changed:
How to verify:
Gates output:
Questions:
