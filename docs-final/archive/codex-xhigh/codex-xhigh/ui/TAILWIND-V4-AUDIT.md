# Tailwind CSS v4 Audit — 2026-01-20

## Evidence

- Scan log: `codex-xhigh/ui/styles-scan-2026-01-20.log`
  - Totals:
    - `palette=244` (9 files)
    - `gradient=0`, `rawGradient=0`
    - `arbitrary=166` (44 files)
    - `hex=37`
  - Top offenders:
    - `app/[locale]/demo/product-mobile2/_components/product-mobile2.tsx` (~60)
    - `app/[locale]/demo/product-adaptive/_components/product-page-mobile.tsx` (~55)
    - `app/[locale]/demo/sell4/page.tsx` (~49)
    - `components/shared/filters/color-swatches.tsx` (~32)
    - `app/[locale]/(sell)/_components/steps/step-details.tsx` (~21)
- Hardcoded color evidence:
  - `codex-xhigh/ui/hardcoded-hex-2026-01-20.txt`
  - `codex-xhigh/ui/hardcoded-color-fns-2026-01-20.txt`

## Findings (prioritized)

### Critical

- [ ] None: gradients are currently at 0 in the scan baseline.

### High

- [ ] Arbitrary Tailwind values (166) remain high; this directly violates repo rails.
  - Recommended approach: delete demo routes first (if out-of-scope), then token-refactor remaining production flows (sell/filters).
- [ ] Hardcoded colors (hex + rgb/hsl) still exist; replace with tokens (CSS variables) or delete surfaces if unused.

### Medium

- [ ] Palette offenders (244) are highly concentrated in demo/product/sell flows. Triage by route importance to avoid “rewrite PRs”.
