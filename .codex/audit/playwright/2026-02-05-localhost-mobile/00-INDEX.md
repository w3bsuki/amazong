# Playwright Mobile Audit — localhost (Blocked)

- **DATE**: 2026-02-05
- **Base URL**: http://127.0.0.1:3000
- **Primary locale**: `/bg` (BG-first)
- **Spot-check locale**: `/en` (as coverage allows)
- **Viewport**: Mobile 390×844
- **Git SHA**: `c5e9685c`
- **Working tree dirty**: Yes (`61` files reported by `git status --porcelain | Measure-Object`)
- **Auth creds present**: No (`TEST_USER_EMAIL` / `TEST_USER_PASSWORD` missing or empty)

## Preflight (must pass)

### Server reachability (do not start server in this terminal)
- Command: `curl --max-time 5 --connect-timeout 2 -s -o NUL -w "%{http_code}\n" http://127.0.0.1:3000/bg`
- Result: **`000` (not reachable)** → **Audit blocked**

**What to run (in a separate terminal)**
1) From repo root `j:\amazong`: `pnpm -s dev`
2) Wait for Next dev server to report it’s listening (default: `http://localhost:3000`).
3) Re-run preflight: `curl -s -o NUL -w "%{http_code}\n" http://127.0.0.1:3000/bg`

If your app uses a different port, update Base URL for the next run.

## Coverage (golden routes)

| Route | Status | Notes |
|---|---|---|
| `/bg` | Blocked | Server unreachable |
| `/bg/search?q=iphone` | Blocked | Server unreachable |
| `/bg/categories` | Blocked | Server unreachable |
| `/bg/categories/<slug>` | Blocked | Server unreachable |
| `/bg/<pdp>` | Blocked | Server unreachable |
| `/bg/cart` | Blocked | Server unreachable |
| `/bg/checkout` | Blocked | Server unreachable |
| `/bg/auth/login` | Blocked | Server unreachable |
| `/bg/auth/sign-up` | Blocked | Server unreachable |
| `/bg/auth/forgot-password` | Blocked | Server unreachable |
| `/bg/sell` | Blocked | Server unreachable |
| `/bg/chat` | Blocked | Server unreachable |
| `/bg/terms` | Blocked | Server unreachable |
| `/bg/privacy` | Blocked | Server unreachable |
| `/bg/customer-service` | Blocked | Server unreachable |
| `/en` (spot-check) | Blocked | Server unreachable |

## Issue summary

| Severity | Count |
|---|---:|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |

## Top ship blockers / conversion killers (pending)

Blocked before UI could be exercised. Re-run after the server is reachable; this section will be filled with prioritized issues (IDs in `issues-frontend.md` / `issues-backend.md`).

## What to fix first (next run will propose 3 batches)

Blocked before discovery. Next run will propose 3 small fix batches after real mobile route coverage.

