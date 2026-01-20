# Logs

Purpose: keep an append-only, low-conflict history so a new chat can resume without context.

## Rules
- No secrets in logs (no env values, no JWTs, no request bodies).
- One log file per agent (or per session) to avoid merge conflicts.

## Suggested naming
- `YYYY-MM-DD-coordinator.md`
- `YYYY-MM-DD-fe.md`
- `YYYY-MM-DD-supabase.md`
- `YYYY-MM-DD-stripe.md`
- `YYYY-MM-DD-ui.md`

