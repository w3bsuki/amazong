# Audit Report — infra + root

Scope: .github/, .vscode/, .vercel/, .next/, node_modules/, .playwright-mcp/, .cursor/, .claude/, .mcp.json, root configs

## Generated artifacts (safe to delete)
- .next/
- node_modules/
- .playwright-mcp/
- .vercel/ (if using Vercel CLI locally)

## Config/infra (keep unless explicitly decommissioned)
- .github/workflows/**
- .vscode/settings.json, tasks.json, mcp.json
- .claude/** (agent rules and skills)
- .cursor/mcp.json
- Root configs: next.config.ts, eslint.config.mjs, postcss.config.mjs, tsconfig.json, vitest.config.ts, playwright.config.ts, package.json

## Root-level candidates to review
- Duplicate or temporary logs:
  - tsc.err.txt
  - tsc.out.txt
  - temp_log_entry.md
  - temp_search_overlay.txt

## Next steps
1) Delete generated artifacts only after ensuring no dev server is running.
2) Keep infra configs unless toolchain is removed.
3) Remove temp logs if no longer needed.
