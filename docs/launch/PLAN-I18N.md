# i18n Production Plan (next-intl) — AI-Executable

## Goal

Avoid mixed-language UX and comply with the repo rail:
> All user-facing strings via `next-intl` (`messages/en.json` + `messages/bg.json`).

## 0) Define “user-facing” for this plan

Treat these as user-facing:
- UI labels, buttons, headings, toasts
- Form validation + server action errors shown in UI
- In-app notifications and system messages (chat/order updates) if displayed to users

## 1) Audit strategy (time-boxed)

### 1.1 Focus first on critical flows

Audit and fix strings in this priority order:
1) Auth (`/auth/*`)
2) Sell/create listing (`/sell`)
3) Chat (`/chat`)
4) Product page + reviews
5) Cart/checkout/orders (if in-scope)
6) Business dashboard (if in-scope)

### 1.2 Detect violations

Use ripgrep searches to find likely hardcoded strings:
- look for `"` / `'` text inside JSX
- look for custom per-component translation objects (e.g. `const translations = { en: ... }`)
- look for server actions returning English strings (e.g. `return { error: "..." }`)

## 2) Fix patterns (preferred)

### 2.1 UI components

- Use `useTranslations('Namespace')` or `getTranslations({ locale, namespace })`.
- Add keys to **both** `messages/en.json` and `messages/bg.json`.

### 2.2 Server Actions / API errors

Preferred approach for maintainability:
- Return **error codes** (e.g. `error: 'auth.invalid_credentials'`) rather than English sentences.
- Localize in the UI using `t(errorCode)`.

Fallback approach (acceptable short-term):
- Return `{ errorKey: 'Namespace.key' }` and translate in UI.

Avoid:
- returning raw English sentences from actions that are shown to users.

### 2.3 DB-written content (notifications/system messages)

If DB triggers currently write English title/body:
- Consider storing only `type` + structured `data` in the DB.
- Render localized text in UI using `next-intl` based on `type` + `data`.

This change is invasive; if launch is imminent, defer to post-launch unless it affects core UX.

## 3) Verification

- Run: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- Run: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` (localized pages load)
- Manually confirm `/en` and `/bg` critical surfaces are not mixing languages.

