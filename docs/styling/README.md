# Styling (Docs)

This folder centralizes **all styling documentation** for the repo.

- **Design system (canonical rules):** `docs/DESIGN.md`
- **How to implement those rules:** the files in this folder
- **Old location:** `styling/` (kept only as a pointer)

---

## Files

| File | Purpose |
|------|---------|
| [STYLE_GUIDE.md](./STYLE_GUIDE.md) | Core styling rules (typography, spacing, colors, components) |
| [PATTERNS.md](./PATTERNS.md) | Approved copy‑paste patterns from good components |
| [ANTI_PATTERNS.md](./ANTI_PATTERNS.md) | What **not** to do, with fixes |
| [REFACTOR_PLAN.md](./REFACTOR_PLAN.md) | Small‑batch cleanup plan for styling debt |
| [03-tailwind.md](./03-tailwind.md) | Tailwind v4 best practices / notes |
| [04-shadcn.md](./04-shadcn.md) | shadcn/ui best practices / notes |

---

## Gates

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```
