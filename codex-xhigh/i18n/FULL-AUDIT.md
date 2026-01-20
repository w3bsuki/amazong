# i18n Full Audit (next-intl) — 2026-01-20

## Evidence

- Parity check: `codex-xhigh/i18n/messages-parity-2026-01-20.log`
  - Missing in `en.json`: 7 keys ✅ FIXED (2026-01-20)
- Inline locale branching / hardcoded strings scan: `codex-xhigh/i18n/inline-locale-checks-2026-01-20.txt`
- Cyrillic-in-code scan (non-JSON): `codex-xhigh/i18n/cyrillic-files-2026-01-20.txt`

## Findings (prioritized)

### Critical

- [x] `messages/en.json` / `messages/bg.json` parity mismatch (7 missing keys in `en.json`)
  - Missing keys (from `messages-parity-2026-01-20.log`):
    - `ProductForm.b2b.moqShort` ✅
    - `ProductForm.b2b.samples` ✅
    - `ProductForm.b2b.verifiedShort` ✅
    - `ProductForm.condition.likeNew` ✅
    - `ProductForm.condition.new` ✅
    - `ProductForm.condition.refurbShort` ✅
    - `ProductForm.condition.usedShort` ✅
  - Fix: ✅ Added English strings for these keys to `messages/en.json`

### High

- [~] Inline locale branching exists in many places (metadata + UI strings)
  - Evidence: `codex-xhigh/i18n/inline-locale-checks-2026-01-20.txt` (1300+ occurrences)
  - Status: Documented but deferred — scope too large for single phase
  - Fix: migrate to `next-intl` patterns per `docs/FRONTEND.md` (render-time localization; avoid inline dictionaries/`locale ===` checks).

### Medium

- [ ] Large Cyrillic footprint in code needs manual triage:
  - Some will be legitimate domain constants; others should move into message files.
