# Refactor Tasks (Folder-by-folder)

Legend:
- `[ ]` not started
- `[x]` completed (audit + decisions + at least one verified change, or explicitly “keep” with evidence)

## Core docs

- [ ] [`STRUCTURE.md`](./STRUCTURE.md)
- [ ] [`ORCHESTRATION.md`](./ORCHESTRATION.md)

## Stack audits

- [ ] [`nextjs.md`](./nextjs.md)
- [ ] [`shadcn.md`](./shadcn.md)
- [ ] [`tailwindcssv4.md`](./tailwindcssv4.md)
- [ ] [`typescript.md`](./typescript.md)
- [ ] [`supabase.md`](./supabase.md)

## Root folders — product code

- [x] [`_app_.md`](./_app_.md) (audited + verified batches shipped)
- [ ] [`_components_.md`](./_components_.md)
- [ ] [`_hooks_.md`](./_hooks_.md)
- [ ] [`_lib_.md`](./_lib_.md)
- [ ] [`_i18n_.md`](./_i18n_.md)
- [ ] [`_messages_.md`](./_messages_.md)
- [ ] [`_public_.md`](./_public_.md)
- [ ] [`_scripts_.md`](./_scripts_.md)
- [ ] [`_supabase_.md`](./_supabase_.md)
- [ ] [`_e2e_.md`](./_e2e_.md)
- [x] [`_tests_.md`](./_tests_.md) (covers `__tests__/`)
- [ ] [`_test_.md`](./_test_.md)
- [ ] [`_docs_.md`](./_docs_.md)
- [ ] [`_docs-site_.md`](./_docs-site_.md)

## Root folders — tool/IDE clutter (likely delete/move)

- [x] [`.agent.md`](./.agent.md)
- [x] [`.agents.md`](./.agents.md)
- [x] [`.claude.md`](./.claude.md)
- [ ] [`.codex.md`](./.codex.md)
- [x] [`.cursor.md`](./.cursor.md)
- [x] [`.gemini.md`](./.gemini.md)
- [x] [`.kiro.md`](./.kiro.md)
- [x] [`.qoder.md`](./.qoder.md)
- [x] [`.qwen.md`](./.qwen.md)
- [x] [`.trae.md`](./.trae.md)
- [ ] [`.vscode.md`](./.vscode.md)
- [x] [`.windsurf.md`](./.windsurf.md)

## Root folders — infra / CI / repo meta (usually keep)

- [ ] [`.github.md`](./.github.md)
- [ ] [`.vercel.md`](./.vercel.md)
- [ ] [`.storybook.md`](./.storybook.md)
- [ ] [`.playwright-mcp.md`](./.playwright-mcp.md)
- [ ] [`.git.md`](./.git.md) (informational only)

## Root folders — generated outputs (must not be committed)

- [ ] [`.next.md`](./.next.md)
- [ ] [`_node_modules_.md`](./_node_modules_.md)
- [ ] [`_playwright-report_.md`](./_playwright-report_.md)
- [ ] [`_storybook-static_.md`](./_storybook-static_.md)
- [ ] [`_test-results_.md`](./_test-results_.md)

## Root folders — suspicious one-offs

- [ ] [`_cleanup_.md`](./_cleanup_.md)
- [ ] [`_temp-tradesphere-audit_.md`](./_temp-tradesphere-audit_.md)
