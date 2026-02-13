# Design Docs Index

> Catalogued design documentation with verification status.
> Modeled after OpenAI's `docs/design-docs/` pattern.

| Last reviewed | 2026-02-12 |
|---------------|------------|

---

## Purpose

Design docs capture the *why* behind architectural and product decisions.
They complement code (which shows *what*) and ARCHITECTURE.md (which shows *how*).

Agents should consult relevant design docs before making changes that touch
the associated domain to ensure alignment with established principles.

---

## Index

| Doc | Domain | Status | Summary |
|-----|--------|--------|---------|
| [core-beliefs.md](core-beliefs.md) | All | Verified | Agent-first operating principles for Treido |
| [marketplace-model.md](marketplace-model.md) | Business | Verified | Why C2C + light B2B, Vinted-style fee model |
| [mobile-first.md](mobile-first.md) | Frontend | Verified | Mobile-first design rationale and breakpoint strategy |

---

## Adding a Design Doc

1. Create `docs/design-docs/{slug}.md`
2. Add an entry to this index
3. Include: Context, Decision, Alternatives Considered, Consequences
4. Set status to `Draft` → `Verified` after review

---

*Last updated: 2026-02-12*
