# Task: Enable Supabase “Leaked Password Protection”

## What it is

Supabase Auth can block signups/logins using passwords found in known breach corpuses.

## Why it matters

This is a cheap security win for production.

## Steps (dashboard-only)

1) Go to Supabase Dashboard → Authentication → Settings (or Security).
2) Enable “Leaked Password Protection”.
3) Verify signup still works for a normal password and fails for a known weak password (do not log/store the tested password).

## If you cannot enable now

- Document explicit acceptance (why, when you’ll enable) in `supabase_tasks.md`.

