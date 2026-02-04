```skill
---
name: treido-i18n
description: |
  Internationalization expert for Treido marketplace using next-intl 4.x.
  Triggers: i18n, translation, locale, language, next-intl, useTranslations,
  getTranslations, messages, en.json, bg.json, formatMessage, t(), useLocale,
  setRequestLocale, formatDate, formatNumber, useFormatter, currency EUR,
  pluralization, ICU, RTL, localization, locale routing, NEXT_LOCALE cookie.
  NOT for: UI/styling (treido-design), routing/caching (treido-frontend),
  database (treido-backend), currency logic (treido-payments).
---

# treido-i18n

> Lean orchestrator for Treido's next-intl 4.x internationalization.

## Quick Reference

| Setting | Value |
|---------|-------|
| Library | `next-intl` 4.x |
| Locales | `en` (default), `bg` |
| URL Pattern | Always prefixed: `/en/*`, `/bg/*` |
| Currency | EUR (€) |
| Timezone | `Europe/Sofia` |
| Message Files | `messages/en.json`, `messages/bg.json` |
| Nav Import | `@/i18n/routing` |

---

## Rule ID Reference

### CRITICAL Rules

| Rule ID | Summary | Details |
|---------|---------|---------|
| `i18n-no-hardcode` | All user-facing copy via `t()` | [translations.md](references/translations.md) |
| `i18n-parity` | en.json + bg.json must have same keys | [translations.md](references/translations.md) |
| `i18n-set-locale` | Call `setRequestLocale()` before hooks in server pages/layouts | [components.md](references/components.md) |

### HIGH Rules

| Rule ID | Summary | Details |
|---------|---------|---------|
| `i18n-server-gt` | Server Components: `getTranslations()` | [components.md](references/components.md) |
| `i18n-client-ut` | Client Components: `useTranslations()` | [components.md](references/components.md) |
| `i18n-namespace` | Use namespaced messages (97 namespaces exist) | [translations.md](references/translations.md) |
| `locale-link` | Use `Link` from `@/i18n/routing` | [locale-routing.md](references/locale-routing.md) |
| `locale-validate` | Use `hasLocale()` for validation | [locale-routing.md](references/locale-routing.md) |

### MEDIUM Rules

| Rule ID | Summary | Details |
|---------|---------|---------|
| `i18n-formatter` | Use global formats (`short`, `currency`, etc.) | [setup.md](references/setup.md) |
| `i18n-rich` | Use `t.rich()` for JSX interpolation | [translations.md](references/translations.md) |
| `i18n-has` | Use `t.has()` for optional keys | [components.md](references/components.md) |
| `locale-detect` | proxy.ts handles locale detection | [setup.md](references/setup.md) |
| `locale-redirect` | Use `redirect` from `@/i18n/routing` | [locale-routing.md](references/locale-routing.md) |

---

## Forbidden Patterns

| Pattern | Why Forbidden | Correct Approach |
|---------|---------------|------------------|
| Hardcoded user strings | Not translatable | Use `t('key')` |
| `import Link from 'next/link'` | Loses locale | `import { Link } from '@/i18n/routing'` |
| `import { ... } from '@/navigation'` | Deprecated path | Use `@/i18n/routing` |
| Template literals for copy | Not translatable | ICU interpolation `{name}` |
| Missing `setRequestLocale()` | Breaks static rendering | Call before any i18n hooks |
| `useTranslations` in Server Component | Hooks don't work | Use `getTranslations()` |
| `getTranslations` in Client Component | Async doesn't work | Use `useTranslations()` |
| Inline format options | Inconsistent formatting | Use global format names |
| Deleting keys without updating call sites | Runtime errors | Update in same commit |

---

## Pause Conditions

**STOP and request approval before:**

- Creating new namespace (impacts both en.json + bg.json)
- Major message structure reorganization
- Changing locale routing configuration
- Modifying proxy.ts locale detection logic

---

## Review Checklist

- [ ] No hardcoded user-facing strings (all via `t()`)
- [ ] Both en.json and bg.json updated with matching keys
- [ ] Server Components call `setRequestLocale(locale)` before hooks
- [ ] Server Components use `getTranslations()`, not `useTranslations()`
- [ ] Client Components use `useTranslations()`, not `getTranslations()`
- [ ] Links use `Link` from `@/i18n/routing`
- [ ] Formatters use global format names, not inline options
- [ ] Parity test passes: `pnpm test __tests__/i18n-messages-parity.test.ts`

---

## Reference Documents

| Reference | Content |
|-----------|---------|
| [setup.md](references/setup.md) | Config files, formats, TypeScript augmentation |
| [translations.md](references/translations.md) | Message files, namespaces, ICU syntax |
| [components.md](references/components.md) | Server/Client patterns, formatters |
| [locale-routing.md](references/locale-routing.md) | Navigation, language switcher, static rendering |

---

## SSOT Documents

| Topic | Location |
|-------|----------|
| Full i18n spec | `docs/10-I18N.md` |
| Message rules | `messages/AGENTS.md` |
| Config rules | `i18n/AGENTS.md` |

---

## Handoffs

| To Agent | When |
|----------|------|
| **treido-frontend** | Route structure, caching, RSC patterns |
| **treido-payments** | Currency formatting beyond `useFormatter` |
| **treido-design** | UI/styling for language switcher |
| **treido-backend** | Locale-aware data fetching |

---

## Verification Commands

```bash
# Check message parity
pnpm test __tests__/i18n-messages-parity.test.ts

# Type check (catches wrong imports)
pnpm -s typecheck

# Lint (catches hardcoded strings via eslint plugin)
pnpm -s lint
```
```
