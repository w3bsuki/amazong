# Blocked Specs

> Specs waiting on external dependencies (human decision, API access, etc.)

---

## Currently Blocked

_(None)_

---

## When to Move Here

Move a spec to `blocked/` when:
- Waiting on human decision
- Waiting on external API access
- Waiting on another team
- Waiting on infrastructure

Always document the blocker in `context.md`:
```markdown
## Blocked

**Reason**: Waiting on Stripe Connect production credentials
**Since**: 2026-01-23
**Unblock action**: Human needs to provide credentials
```
