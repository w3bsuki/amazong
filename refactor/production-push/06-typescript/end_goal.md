# 06 — TypeScript: End Goal

---

## Configuration

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitReturns": true,
  "exactOptionalPropertyTypes": true,
  "allowJs": false,  // ← CHANGED from true
  "module": "esnext",
  "moduleResolution": "bundler"
}
```

---

## Unsafe Cast Target: <5

### Strategy: Typed Adapters

Replace `as unknown as X` with typed adapter functions:

```ts
// lib/supabase/adapters/product.ts
import { z } from "zod";

const ProductRowSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  price: z.number(),
  // ...
});

export function parseProductRow(row: unknown): Product {
  return ProductRowSchema.parse(row);
}

// OR: Type-guard approach (zero runtime cost)
export function isProductRow(row: unknown): row is Product {
  return typeof row === "object" && row !== null && "id" in row && "title" in row;
}
```

### Acceptable Remaining Casts (~5 max)
| Location | Justification |
|----------|--------------|
| `lib/stripe.ts` | Stripe SDK type mismatches (upstream) |
| `lib/supabase/middleware.ts` | Cookie handler type bridge |
| Test files | Mocking framework types (not production) |

---

## Unified Action Return Type

### Single Contract: `Envelope<TSuccess, TError>`

```ts
// lib/api/envelope.ts (already exists — DO NOT change this contract)
export type SuccessEnvelope<T extends Record<string, unknown> = Record<string, never>> = { success: true } & T;
export type ErrorEnvelope<T extends Record<string, unknown> = Record<string, never>>   = { success: false } & T;
export type Envelope<TSuccess, TError> = SuccessEnvelope<TSuccess> | ErrorEnvelope<TError>;

export function successEnvelope<T>(payload?: T): SuccessEnvelope<T>;
export function errorEnvelope<T>(payload?: T): ErrorEnvelope<T>;
```

### Migration Plan (29 actions)
Every ad-hoc action migrates to Envelope:
```ts
// BEFORE (ad-hoc shape)
export async function updateProfile(data: FormData) {
  // ...
  return { success: true };
  // OR
  return { success: false, errorCode: "INVALID_INPUT" };
}

// AFTER (Envelope — note: { success: true/false }, NOT { ok: true/false })
export async function updateProfile(
  data: FormData
): Promise<Envelope<Record<string, never>, { message: string }>> {
  // ...
  return successEnvelope();
  // OR
  return errorEnvelope({ message: "Invalid profile data" });
}
```

### UI Consumption
```ts
const result = await updateProfile(formData);
if (result.success) {
  toast.success("Profile updated");
} else {
  toast.error(result.message ?? "Something went wrong");
}
```

---

## Boundary Validation Standard

Every server action follows:
```ts
export async function myAction(input: FormData): Promise<Envelope<T>> {
  // 1. Parse input with Zod
  const parsed = MySchema.safeParse(Object.fromEntries(input));
  if (!parsed.success) return errorEnvelope({ message: parsed.error.message });

  // 2. Auth
  const auth = await requireAuth();
  if (!auth) return errorEnvelope({ message: "Unauthorized" });

  // 3. Domain logic (from lib/)
  const result = await domainFunction(parsed.data, auth.userId);

  // 4. Revalidate
  revalidateTag("my-tag");

  // 5. Return
  return successEnvelope(result);
}
```

---

## Acceptance Criteria

- [ ] `allowJs: false` in tsconfig.json
- [ ] `as unknown as` count: <5 in production code (currently 34)
- [ ] 100% of server actions return `Envelope<T>`
- [ ] All server action inputs validated with Zod at boundary
- [ ] Typed Supabase adapters eliminate query-result casting
- [ ] Window type augmentations documented or replaced with proper typing
- [ ] `pnpm -s typecheck` still green after all changes
