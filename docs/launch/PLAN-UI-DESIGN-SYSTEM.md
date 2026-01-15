# UI Design System “Rails” Plan — AI-Executable

## Goal

Be production-ready without redesigns:
- **0 gradients**
- Minimal arbitrary Tailwind values
- Use semantic tokens (`docs/DESIGN.md`)

## Inputs (existing)

- Baselines:
  - `cleanup/palette-scan-report.txt`
  - `cleanup/arbitrary-scan-report.txt`
- Docs:
  - `docs/DESIGN.md`
  - `docs/styling/README.md`

## Strategy

1) Fix **high-traffic surfaces first**:
   - header/navigation
   - search + filters
   - product cards + product page
   - checkout/cart (if in-scope)
2) Touch the smallest possible set of files per batch.
3) After each batch, run:
   - `pnpm -s exec tsc -p tsconfig.json --noEmit`
   - `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Execution steps

### 1) Gradients to 0

- Run: `pnpm -s styles:scan:palette`
- Remove gradient classes and replace with token-based surfaces (`bg-card`, `bg-muted`, etc).

### 2) Arbitrary values down to target

- Run: `pnpm -s styles:scan:arbitrary`
- Replace `h-[...]`, `text-[...]`, `gap-[...]`, etc with tokenized spacing/typography (`docs/DESIGN.md`).

### 3) Optional gate before launch

If you want hard enforcement:
- `pnpm -s styles:gate` (will fail on findings)

## Acceptance

- No gradients remain on user-visible surfaces.
- Arbitrary values reduced to an agreed threshold (ideally < 20).
- No layout regressions on high-traffic surfaces (verified by E2E smoke).

