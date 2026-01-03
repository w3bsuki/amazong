# 🔥 AUTH FORMS BRUTAL AUDIT - ULTRATHINK MODE V2

> **Date:** January 3, 2026  
> **Auditor:** Frontend UI Agent - Gordon Ramsay Mode  
> **Verification:** Playwright MCP browser automation @ localhost:3001  
> **Verdict:** The auth forms are a DISASTER. A culinary catastrophe of inconsistency.

---

## 🚨 CRITICAL RUNTIME ERROR DISCOVERED

**SIGN-UP PAGE IS COMPLETELY BROKEN!**

During live browser testing at `http://localhost:3001/bg/auth/sign-up`, the page crashes with:

```
TypeError: Failed to construct 'Image': Please use the 'new' operator, 
this DOM object constructor cannot be called as a function.
```

The user sees an error boundary with "Something went wrong" instead of the form. **This is PRODUCTION-BLOCKING.**

**Root Cause:** Likely an `Image` import conflict or incorrect usage pattern in the sign-up form.

---

## 📋 EXECUTIVE SUMMARY

**Rating: 2/10 - BLOODY RAW (downgraded due to runtime crash)**

Your auth forms are like a chef who knows how to cook but insists on serving food on paper plates in a Michelin restaurant. You have:

- ✅ A beautiful `Input` component in shadcn with iOS zoom prevention
- ✅ A perfect `Button` component with 7 variants + size options
- ✅ A proper `Form` component with react-hook-form integration
- ✅ A complete `Label` component
- ✅ Tailwind CSS v4 with a gorgeous design system

**BUT YOU'RE NOT USING ANY OF IT IN YOUR AUTH FORMS!**

The forms are hand-rolled amateur hour with raw HTML inputs and inconsistent styling.

---

## 🎯 FORMS AUDITED

| Form | File | Status |
|------|------|--------|
| Sign Up | `app/[locale]/(auth)/_components/sign-up-form.tsx` | ❌ NOT USING SHADCN |
| Login | `app/[locale]/(auth)/_components/login-form.tsx` | ❌ NOT USING SHADCN |
| Forgot Password | `app/[locale]/(auth)/_components/forgot-password-form.tsx` | ❌ NOT USING SHADCN |
| Reset Password | `app/[locale]/(auth)/auth/reset-password/reset-password-client.tsx` | ⚠️ PARTIAL (uses Form) |

---

## 🚨 CRITICAL ISSUES

### Issue #1: RAW HTML INPUTS EVERYWHERE

**What you have:**
```tsx
// sign-up-form.tsx - LINE BY LINE HORROR
<input
  id="email"
  name="email"
  type="email"
  autoComplete="email"
  required
  placeholder={t("emailPlaceholder")}
  onChange={(e) => setEmail(e.target.value)}
  className={`w-full h-10 px-3 text-sm text-foreground placeholder:text-muted-foreground bg-background border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors ${state?.fieldErrors?.email ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
  aria-invalid={!!state?.fieldErrors?.email}
/>
```

**What you SHOULD have:**
```tsx
// Using your own Input component
import { Input } from "@/components/ui/input"

<Input
  id="email"
  name="email"
  type="email"
  autoComplete="email"
  required
  placeholder={t("emailPlaceholder")}
  onChange={(e) => setEmail(e.target.value)}
  aria-invalid={!!state?.fieldErrors?.email}
/>
```

**Problem:** You're duplicating the EXACT SAME styles that `Input` already provides, but:
- Input has `h-10 md:h-9` (responsive), your forms have just `h-10`
- Input has iOS zoom prevention via `text-base md:text-sm`, your forms have just `text-sm`
- Input has proper aria-invalid styling, your forms manually concatenate classes

---

### Issue #2: VALIDATION SCHEMA MISMATCH - THE CARDINAL SIN

**Your validation file says:**
```typescript
// lib/validations/auth.ts
passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters" }) // 8 CHARACTERS!
```

**Your signup form says:**
```tsx
// sign-up-form.tsx
{ label: t("reqMinChars"), met: password.length >= 6 } // 6 CHARACTERS!
```

**And the signUpSchema says:**
```typescript
password: z.string()
  .min(6, { message: "Password must be at least 6 characters" }) // ALSO 6!
```

**THE PASSWORDS DON'T EVEN AGREE ON LENGTH:**
- `passwordSchema` export = 8 characters
- `signUpSchema` password field = 6 characters  
- Frontend UI requirements = 6 characters

This is CHAOS. A user thinks they need 6 chars, but one schema requires 8. Which is it?!

---

### Issue #3: BUTTON COMPONENT IGNORED

**What you have (sign-up-form.tsx):**
```tsx
function SubmitButton({ label, pendingLabel, disabled }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      {/* ... */}
    </button>
  )
}
```

**What you HAVE in components/ui/button.tsx:**
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-normal disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  // ... WITH SIZE VARIANTS: xs, sm, default, lg, icon, icon-sm, icon-lg
)
```

**Why reinvent the wheel?** Your Button component has:
- Proper focus-visible ring handling
- Size variants (`size="lg"` = 36px perfect for forms)
- Aria-invalid support
- Dark mode compatibility

Your handrolled button has:
- `rounded-lg` instead of `rounded-md` (INCONSISTENT!)
- `font-medium` instead of `font-normal` (INCONSISTENT!)
- Missing `focus-visible:ring-offset-1`

---

### Issue #4: FORM COMPONENT EXISTS BUT ONLY USED IN RESET PASSWORD

**reset-password-client.tsx (THE GOOD ONE):**
```tsx
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const form = useForm<ResetPasswordFormData>({
  resolver: zodResolver(resetPasswordSchema),
  defaultValues: { password: "", confirmPassword: "" },
  mode: "onChange",
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <input {...field} />  // Still raw input, but at least using Form!
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

**sign-up-form.tsx / login-form.tsx (THE BAD ONES):**
```tsx
const [state, formAction] = useActionState(signUp.bind(null, locale), initialState)

<form action={formAction}>
  <input ... />
  {state?.fieldErrors?.email && <p className="text-xs text-destructive mt-1">{state.fieldErrors.email}</p>}
</form>
```

The sign-up/login forms use Server Actions with `useActionState`, which is fine, but they:
- Don't use react-hook-form
- Don't use shadcn Form components
- Manually handle error display
- Have duplicate validation between client (`canSubmit`) and server (Zod schemas)

---

### Issue #5: LABEL COMPONENT IGNORED

**Your Label component:**
```tsx
// components/ui/label.tsx
<LabelPrimitive.Root
  className="flex items-center gap-2 text-sm leading-none font-medium select-none ..."
/>
```

**Your auth forms:**
```tsx
<label className="block text-sm font-medium text-foreground mb-1">
  {t("email")}
</label>
```

Same problem. You have a Label, you're not using it.

---

### Issue #6: INCONSISTENT CONTAINER/CARD STYLING

**sign-up-form.tsx:**
```tsx
<div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
  <div className="w-full max-w-sm bg-card rounded-md border border-border relative">
```

**login-form.tsx:**
```tsx
<div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
  <div className="w-full max-w-sm bg-card rounded-md border border-border relative">
```

**forgot-password-form.tsx:**
```tsx
<div className="w-full max-w-sm mx-auto">  // NO CARD WRAPPER AT ALL!
```

**reset-password-client.tsx:**
```tsx
<div className="w-full max-w-sm mx-auto">  // ALSO NO CARD!
```

**sign-up-success-client.tsx:**
```tsx
<div className="min-h-svh flex items-center justify-center bg-muted p-4">  // bg-muted not bg-muted/30!
  <div className="w-full max-w-sm bg-card rounded-md border border-border relative">
```

FIVE forms, THREE different container patterns. This is amateur hour.

---

### Issue #7: NO CARD COMPONENT USAGE

You have a perfectly good `Card` component in `components/ui/card.tsx`:

```tsx
// What you SHOULD use:
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Sign In</CardTitle>
    <CardDescription>Enter your credentials</CardDescription>
  </CardHeader>
  <CardContent>
    {/* form */}
  </CardContent>
  <CardFooter>
    {/* footer links */}
  </CardFooter>
</Card>
```

---

### Issue #8: MOBILE RESPONSIVENESS ISSUES

**Your Input component has iOS zoom prevention:**
```tsx
// components/ui/input.tsx
className="... text-base md:text-sm ..."  // 16px on mobile prevents zoom!
```

**Your auth form inputs:**
```tsx
className="... text-sm ..."  // 14px on mobile TRIGGERS iOS ZOOM on focus!
```

This is why forms feel "broken" on mobile - every time you tap an input, iOS zooms in because font-size < 16px.

---

### Issue #9: PHOSPHOR ICONS VS LUCIDE INCONSISTENCY

**Your components.json says:**
```json
"iconLibrary": "lucide"
```

**Your auth forms use:**
```tsx
import { Eye, EyeSlash, SpinnerGap, Check, X } from "@phosphor-icons/react"
```

Either commit to Phosphor or Lucide. This isn't a food truck serving both tacos and sushi.

---

### Issue #10: HARDCODED LOCALIZATION IN SOME FORMS

**forgot-password-form.tsx:**
```tsx
<label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
  {locale === "bg" ? "Имейл адрес" : "Email address"}
</label>
```

**vs sign-up-form.tsx:**
```tsx
const t = useTranslations("Auth")
<label>{t("email")}</label>
```

Some forms use `useTranslations`, some use hardcoded locale checks. Pick ONE.

---

## 📊 DETAILED COMPARISON TABLE

| Feature | Input Component | Auth Form Inputs | Issue |
|---------|-----------------|------------------|-------|
| Height | `h-10 md:h-9` | `h-10` | Missing responsive sizing |
| Font size | `text-base md:text-sm` | `text-sm` | iOS zoom bug |
| Border radius | `rounded-md` | `rounded-lg` | Inconsistent |
| Ring offset | `ring-offset-2` | `ring-offset-2` | ✅ Same |
| Aria invalid | Built-in | Manual class concat | Duplicate logic |
| Dark mode | `dark:bg-input/30` | None | Missing dark support |

---

## 🔧 THE FIX PLAN

### Phase 1: Standardize Input Usage (PRIORITY: CRITICAL)

**Files to update:**
- `app/[locale]/(auth)/_components/sign-up-form.tsx`
- `app/[locale]/(auth)/_components/login-form.tsx`  
- `app/[locale]/(auth)/_components/forgot-password-form.tsx`
- `app/[locale]/(auth)/auth/reset-password/reset-password-client.tsx`

**Changes:**
1. Import `Input` from `@/components/ui/input`
2. Replace all raw `<input>` elements with `<Input>`
3. Remove duplicated className strings

---

### Phase 2: Standardize Button Usage (PRIORITY: HIGH)

**Changes:**
1. Import `Button` from `@/components/ui/button`
2. Replace custom `SubmitButton` components with:
```tsx
<Button type="submit" size="lg" className="w-full" disabled={pending || !canSubmit}>
  {pending ? (
    <>
      <Loader2 className="animate-spin" />
      {pendingLabel}
    </>
  ) : (
    label
  )}
</Button>
```

---

### Phase 3: Standardize Label Usage (PRIORITY: MEDIUM)

**Changes:**
1. Import `Label` from `@/components/ui/label`
2. Replace raw `<label>` elements with `<Label>`

---

### Phase 4: Create Reusable Auth Card Component (PRIORITY: HIGH)

**Create:** `components/auth/auth-card.tsx`

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import Image from "next/image"

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  showLogo?: boolean
}

export function AuthCard({ title, description, children, footer, showLogo = true }: AuthCardProps) {
  return (
    <div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          {showLogo && (
            <Link href="/" className="mx-auto mb-2 hover:opacity-80 transition-opacity">
              <Image src="/icon.svg" width={40} height={40} alt="Treido" priority />
            </Link>
          )}
          <CardTitle className="text-xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer && (
          <CardFooter className="flex-col gap-4 bg-muted/30 border-t">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
```

---

### Phase 5: Create Reusable Form Field Component (PRIORITY: MEDIUM)

**Create:** `components/auth/auth-form-field.tsx`

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AuthFormFieldProps {
  id: string
  name: string
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  error?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  children?: React.ReactNode // For password toggle, icons, etc.
}

export function AuthFormField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  required,
  error,
  value,
  onChange,
  children,
}: AuthFormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          className={cn(error && "border-destructive focus-visible:ring-destructive")}
        />
        {children}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
```

---

### Phase 6: Migrate to React Hook Form + Shadcn Form (PRIORITY: CRITICAL)

**Current state:**
- `reset-password-client.tsx` ✅ Uses RHF + Zod + Shadcn Form
- `sign-up-form.tsx` ❌ Uses useActionState + manual validation
- `login-form.tsx` ❌ Uses useActionState + manual validation
- `forgot-password-form.tsx` ❌ Uses useActionState + manual validation

**Migration pattern:**
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signUpSchema } from "@/lib/validations/auth"

type FormData = z.infer<typeof signUpSchema>

function SignUpForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onChange", // Real-time validation
  })

  const onSubmit = async (data: FormData) => {
    const result = await signUp(locale, data)
    if (result.error) {
      form.setError("root", { message: result.error })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!form.formState.isValid}>
          Submit
        </Button>
      </form>
    </Form>
  )
}
```

**Benefits:**
- Single source of truth (Zod schema)
- Type safety with `z.infer<>`
- Real-time validation feedback
- Proper accessibility (aria-invalid, aria-describedby)
- Consistent error display via `<FormMessage />`

---

### Phase 7: Fix Validation Schema Consistency (PRIORITY: CRITICAL)

**Decision needed:** Is password minimum 6 or 8 characters?

**Recommendation:** 8 characters (industry standard)

**Files to update:**
1. `lib/validations/auth.ts` - Ensure all schemas use 8 chars
2. `app/[locale]/(auth)/_components/sign-up-form.tsx` - Update UI requirements
3. Add tests for edge cases

---

### Phase 8: Standardize Icon Library (PRIORITY: LOW)

**Decision:** Keep Phosphor Icons (they're already used extensively)

**Update:** `components.json` to reflect actual usage:
```json
"iconLibrary": "phosphor"
```

Or migrate all auth icons to Lucide for consistency with other shadcn components.

---

### Phase 9: Mobile Optimization Checklist (PRIORITY: HIGH)

- [ ] All inputs use `text-base md:text-sm` for iOS zoom prevention
- [ ] Touch targets are minimum 44x44px
- [ ] Form containers have proper safe area insets
- [ ] Keyboard dismiss behavior works correctly
- [ ] Autofill styling is handled

---

## 🎯 TASK PRIORITY ORDER

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| 1 | Migrate to RHF + Zod + Shadcn Form | High | Critical |
| 2 | Fix validation schema mismatch (6 vs 8 chars) | Low | Critical |
| 3 | Replace raw inputs with `<Input>` | Medium | High |
| 4 | Replace raw buttons with `<Button>` | Low | High |
| 5 | Create `AuthCard` wrapper | Medium | High |
| 6 | Replace raw labels with `<Label>` | Low | Medium |
| 7 | Create `AuthFormField` component | Medium | Medium |
| 8 | Standardize icon library | Low | Low |
| 9 | Mobile optimization pass | Medium | High |

---

## 📝 REFACTORED SIGN-UP FORM (EXAMPLE)

```tsx
"use client"

import { useActionState, useMemo, useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Eye, EyeSlash, SpinnerGap, Check, X, CheckCircle } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthFormField } from "@/components/auth/auth-form-field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link } from "@/i18n/routing"
import { getPasswordStrength } from "@/lib/validations/auth"
import { checkUsernameAvailability, signUp, type AuthActionState } from "../_actions/auth"

function SubmitButton({ label, pendingLabel, disabled }: { label: string; pendingLabel: string; disabled?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending || disabled}>
      {pending ? (
        <>
          <SpinnerGap className="size-5 animate-spin" weight="bold" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  )
}

export function SignUpForm({ locale }: { locale: string }) {
  const t = useTranslations("Auth")
  // ... rest of component using AuthCard, Input, Label, Button
}
```

---

## 🏁 ACCEPTANCE CRITERIA

- [ ] All auth forms use `Input` component from shadcn
- [ ] All auth forms use `Button` component from shadcn
- [ ] All auth forms use `Label` component from shadcn
- [ ] Consistent card wrapper across all auth pages
- [ ] Password validation uses consistent 8-character minimum
- [ ] iOS zoom prevention on all mobile inputs
- [ ] Dark mode works correctly on all forms
- [ ] All forms pass E2E tests
- [ ] Accessibility audit passes (proper labels, aria attributes)

---

## 🧪 TESTING CHECKLIST

After refactoring, run:

```bash
# Unit tests for validation
pnpm test __tests__/validations-auth.test.ts

# E2E tests for auth flows
pnpm test:e2e e2e/auth.spec.ts

# Manual testing
# - Mobile Safari (iOS zoom prevention)
# - Mobile Chrome (touch targets)
# - Dark mode toggle
# - Keyboard navigation
# - Screen reader (VoiceOver/NVDA)
```

---

## 📚 REFERENCE FILES

| Purpose | File |
|---------|------|
| Input Component | `components/ui/input.tsx` |
| Button Component | `components/ui/button.tsx` |
| Form Component | `components/ui/form.tsx` |
| Label Component | `components/ui/label.tsx` |
| Card Component | `components/ui/card.tsx` |
| Auth Validation | `lib/validations/auth.ts` |
| Global CSS | `app/globals.css` |
| Shadcn Config | `components.json` |

---

**The kitchen is a mess. Time to clean it up and serve something worthy of your design system.**

*"This form is RAWWWWW!" - Gordon Ramsay, probably*
