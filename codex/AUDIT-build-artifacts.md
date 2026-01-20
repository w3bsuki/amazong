# Build Artifacts Audit

Date: 2026-01-19

## Scope
Checked local artifact folders:
- node_modules/
- .next/
- .vercel/
- .playwright-mcp/

## Size Summary
| Path | Size (MB) | Notes |
| --- | --- | --- |
| node_modules/ | 814.82 | Most space in .pnpm (814.68 MB). Typical dependency store. |
| .next/ | 1165.33 | Entirely in dev/ cache. Large Next.js build/dev cache. |
| .vercel/ | 0.04 | Minimal local Vercel metadata and output. |
| .playwright-mcp/ | 4.18 | Screenshots from audits/tests. |

## Largest Subfolders / Files
### node_modules/
Top contributors:
- .pnpm (814.68 MB)
- next (132.76 MB)
- lucide-react (34.45 MB)
- typescript (22.53 MB)
- date-fns (21.55 MB)

### .next/
- dev/ (1165.33 MB)

### .vercel/
- output/ (0.04 MB)
- .env.production.local, project.json, README.txt (negligible)

### .playwright-mcp/
Largest files are PNG screenshots (example sizes 0.7–0.1 MB). These appear to be generated test/audit artifacts.

## Recommendations
### Exclude from VCS (should be gitignored)
- node_modules/
- .next/
- .vercel/
- .playwright-mcp/

### Purge Candidates (safe to delete and regenerate)
- .next/ (Next.js dev/build cache)
- .playwright-mcp/ (Playwright/MCP screenshots)
- .vercel/ (local deployment metadata; regenerate as needed)
- node_modules/ (reinstall via pnpm when needed)

### Large / Duplicate Artifacts
- node_modules/.pnpm is the dominant size driver (814.68 MB). This is expected for pnpm, but can be pruned with pnpm store prune if disk space is tight.
- .next/dev is a large cache (1.16 GB) and can be cleared when not needed.
- .playwright-mcp contains many screenshots with similar names; likely duplicated across audits. Consider periodic cleanup or redirecting to a dedicated artifacts folder outside the repo.

## Action Plan (no code changes)
1. Ensure these folders are in .gitignore (verify, do not modify here).
2. Optional cleanup when disk space is needed:
   - Delete .next/ and .playwright-mcp/.
   - Remove node_modules/ and reinstall with pnpm.
   - Remove .vercel/ if unused locally.
