# Refactor Audit — Track C (Infra/Tooling/Tests) — 2026-01-18

## Scope
- config/, scripts/, docs/

## Findings

1) [Low] Duplicate subcategory image URLs (config duplication)
- Evidence:
  - [config/subcategory-images.ts](config/subcategory-images.ts#L6-L16)
  - [config/subcategory-images.ts](config/subcategory-images.ts#L56-L57)
- Fix direction: extract shared constants or alias duplicate keys to a single source of truth.

2) [Low] Fixed scan directories and baseline path in ts-safety gate
- Evidence: [scripts/ts-safety-gate.mjs](scripts/ts-safety-gate.mjs#L6-L10)
- Fix direction: allow overrides via CLI flags or a config file to reduce coupling to repo layout.

3) [Low] Hardcoded report output path in palette scan script
- Evidence: [scripts/scan-tailwind-palette.mjs](scripts/scan-tailwind-palette.mjs#L215)
- Fix direction: accept `--out` or env var for report location (default to cleanup/ when unspecified).

4) [Low] Hardcoded localhost example in testing docs
- Evidence: [docs/guides/testing.md](docs/guides/testing.md#L130)
- Fix direction: document `BASE_URL` without a concrete host, or specify that localhost is only the default.
