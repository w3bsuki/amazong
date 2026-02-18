# [2] Onboarding

> Post-signup wizard: account type → profile → interests → business profile → complete

## What Must Work

- Redirect incomplete users to `/onboarding` (via OnboardingProvider)
- Step 1: Choose personal or business account
- Step 2: Basic profile setup (name, avatar)
- Step 3: Select interests/categories
- Step 4: Business profile (if business account)
- Step 5: Complete → redirect to home or dashboard
- `profiles.onboarding_completed` flag drives the gating
- Specific bypass routes skip onboarding redirect

## Files to Audit

```
app/[locale]/(onboarding)/              → All pages + _components/
app/[locale]/(main)/_providers/onboarding-provider.tsx
app/actions/onboarding.ts
app/[locale]/api/onboarding/complete/
```

## Instructions

1. Read every file listed above
2. Audit for: dead code, duplication, over-engineering, files that should merge
3. Refactor — same features, less code
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** DB schema, `profiles` table structure.
