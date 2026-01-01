# Audit Prompts

This folder contains structured prompts for auditing different parts of the tech stack.
Copy and paste these prompts into a **new chat** to perform systematic audits.

## Available Prompts

| File | Purpose | When to Use |
|------|---------|-------------|
| [`FULL_STACK_AUDIT.md`](FULL_STACK_AUDIT.md) | Complete codebase audit | Major releases, quarterly reviews |
| [`supabase_audit.md`](supabase_audit.md) | Supabase patterns | Database/API changes |
| [`nextjs_audit.md`](nextjs_audit.md) | Next.js 16 patterns | After Next.js upgrades |
| [`react19_audit.md`](react19_audit.md) | React 19 patterns | After React upgrades |
| [`tailwind_audit.md`](tailwind_audit.md) | Tailwind CSS v4 patterns | Styling refactors |
| [`shadcn_audit.md`](shadcn_audit.md) | shadcn/ui patterns | Component library updates |
| [`typescript_audit.md`](typescript_audit.md) | TypeScript strictness | Type safety reviews |
| [`playwright_audit.md`](playwright_audit.md) | E2E test quality | Test suite maintenance |

## How to Use

1. **Open a new chat** (fresh context is important)
2. **Copy the entire contents** of the relevant prompt
3. **Paste as your first message**
4. The AI will use MCP tools to:
   - Read official documentation
   - Scan your codebase
   - Compare against best practices
   - Provide specific fixes

## Key MCP Tools Used

These prompts leverage Model Context Protocol (MCP) tools:

- **context7**: Fetches up-to-date library documentation
- **supabase**: Queries Supabase docs and executes SQL
- **next-devtools**: Next.js development tools and docs
- **shadcn**: Component registry management
- **playwright**: Browser automation for testing

## Recommended Audit Schedule

| Audit | Frequency | Trigger |
|-------|-----------|---------|
| Full Stack | Quarterly | Major releases |
| Supabase | After schema changes | New tables, RPC functions |
| Next.js | After upgrades | Major/minor version bumps |
| TypeScript | Monthly | Before releases |
| Playwright | Weekly | Before deployments |

## Adding New Prompts

Follow this template:

```markdown
# [TECHNOLOGY] BEST PRACTICES AUDIT

## MANDATORY FIRST STEPS - READ DOCS BEFORE ANYTHING
[MCP tool calls to fetch documentation]

## AUDIT SCOPE
[Categories to check]

## SPECIFIC SEARCHES
[grep_search patterns]

## DELIVERABLES
[Expected output format]
```
