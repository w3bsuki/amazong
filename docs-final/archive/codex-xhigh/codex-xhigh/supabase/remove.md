# Supabase — Remove / Avoid

- Function drift (multiple definitions across migrations for the same function).
- Duplicate triggers that affect the same write path (stock decrement, notifications).
- Broad public read policies unless explicitly intended.
- Per-page “cleanup RPCs” that write on every page load (move to cron or user action).

