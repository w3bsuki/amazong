# Design System

> **The Bazaar Standard** — Temu density + eBay professionalism  
> High-conversion C2C/B2B marketplace. Mobile-first. Flat, fast, dense.

---

## 📖 Source of Truth

| File | Purpose | Status |
|------|---------|--------|
| **[DESIGN.md](./DESIGN.md)** | **Complete consolidated spec** | ✅ Primary |
| [tokens.md](./tokens.md) | CSS token reference | Reference |
| [patterns.md](./patterns.md) | Reusable UI patterns | Reference |
| [recipes.md](./recipes.md) | Screen-level guidance | Reference |
| [AUDIT_TASKS.md](./AUDIT_TASKS.md) | Audit checklist | Active |

### Archive (Reference Only)
| File | Notes |
|------|-------|
| [_MASTER.md](./_MASTER.md) | Original master doc (merged into DESIGN.md) |
| [temu-ux-audit.md](./temu-ux-audit.md) | Temu patterns research |
| [tasks.md](./tasks.md) | Legacy task list |

---

## 🚀 Quick Start

**Read [DESIGN.md](./DESIGN.md)** — it contains everything you need:
- Philosophy & hard rules
- Typography scale
- Spacing system
- Touch targets
- Color tokens
- Component specs

---

## ⚡ Quick Rules

```
✅ DO                              ❌ DON'T
─────────────────────────────────────────────────────────
Flat solid colors                  Gradients, glows
gap-1.5 mobile, gap-3 desktop      Large gaps (gap-4+)
rounded-md max on cards            rounded-lg, rounded-xl
shadow-sm hover, shadow-md modal   shadow-lg, shadow-xl
Price = largest on product cards   Small prices
16px font on mobile inputs         <16px (causes iOS zoom)
```

---

## 🔧 Workflow

1. **Design decision?** → Check [DESIGN.md](./DESIGN.md)
2. **Need exact token value?** → Check [tokens.md](./tokens.md)
3. **Building a pattern?** → Check [patterns.md](./patterns.md)
4. **Building a screen?** → Check [recipes.md](./recipes.md)
5. **Tracking fixes?** → Update [AUDIT_TASKS.md](./AUDIT_TASKS.md)

---

## 📁 Related Files

- `app/globals.css` — All CSS variables & theme tokens
- `components/ui/button.tsx` — Button variants
- `components/shared/product/product-card.tsx` — Product card reference
