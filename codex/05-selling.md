# [5] Selling / Listing Creation

> Multi-step sell form: category → details → images → pricing → submit

## What Must Work

- Multi-step sell form at `/sell`
- Category tree selection with dynamic attributes
- Image upload with compression
- AI-powered autofill from images/description
- Condition, pricing (fixed / negotiable), shipping options
- Save as draft / publish
- Edit existing listings at `/account/selling/[id]/edit`
- Product CRUD via server actions

## Files to Audit

```
app/[locale]/(sell)/                    → All pages + _actions/ + _components/ + _lib/
app/[locale]/(account)/account/selling/ → Product management + edit page

app/actions/products.ts
app/api/assistant/sell-autofill/
app/api/upload-image/

lib/sell/schema.ts
lib/upload/image-upload.ts
lib/image-compression.ts
lib/ai/schemas/sell-autofill.ts
```

## Instructions

1. Read every file listed above
2. Audit for: over-componentization, barrel indexes, duplication, dead code
3. Refactor — same features, less code, fewer files
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** DB schema, image upload API signatures, AI model config.
