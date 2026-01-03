# 🔥 AUTH FORMS BRUTAL AUDIT V2 - ULTRATHINK MODE

> **Date:** January 3, 2026  
> **Auditor:** Frontend UI Agent - Gordon Ramsay Mode  
> **Verification:** Playwright MCP browser automation @ localhost:3001  
> **Verdict:** The auth forms are a DISASTER. A culinary catastrophe of inconsistency.

---

## 🚨 P0 CRITICAL: SIGN-UP PAGE IS COMPLETELY BROKEN

**During live browser testing at `http://localhost:3001/bg/auth/sign-up`, the page CRASHES:**

```
TypeError: Failed to construct 'Image': Please use the 'new' operator, 
this DOM object constructor cannot be called as a function.
```

**Users see an error boundary with "Something went wrong" instead of the registration form.**

This is **PRODUCTION-BLOCKING**. Users literally cannot sign up!

**Root Cause:** Likely an `Image` import conflict or bundler issue in sign-up-form.tsx

---

## 📋 EXECUTIVE SUMMARY

| Metric | Score | Notes |
|--------|-------|-------|
| **Overall Rating** | **2/10** | Downgraded due to runtime crash |
| Design System Usage | 0% | None of the auth forms use shadcn components |
| iOS Zoom Prevention | ❌ | `text-sm` triggers zoom on mobile |
| Accessibility | ⚠️ | Labels present but not using shadcn Label |
| Validation Consistency | ❌ | 6 vs 8 character mismatch |
| Dark Mode Support | ❌ | Missing in all auth forms |

---

## 🖼️ LIVE BROWSER AUDIT (Playwright MCP)

### ✅ Login Page (`/bg/auth/login`) - RENDERS

**DOM Structure Captured:**
```yaml
- heading "Влез" [level=1]
- paragraph: "Въведи данните си за достъп до акаунта"
- textbox "Имейл или мобилен телефон" [placeholder="you@example.com"]
- textbox "Парола" [placeholder="Въведи паролата си"]
- button "Покажи парола" [password toggle]
- checkbox "Запомни ме" [unchecked] ← RAW HTML, not shadcn!
- button "Влез" [DISABLED]
- link "Забравена парола?"
- link "Създай Treido акаунт"
```

**Visual Issues Found:**
1. Card uses `rounded-md` but footer uses `rounded-b-xl` (inconsistent!)
2. Footer links have 32px height but 12px font (tiny tap targets)
3. Checkbox is raw HTML `<input type="checkbox">`, not shadcn
4. Copyright says "© 1996-2026" - Treido didn't exist in 1996!

### ❌ Sign-Up Page (`/bg/auth/sign-up`) - CRASHES

**What Users See:**
```yaml
- heading "Something went wrong" [level=1]
- paragraph: "We encountered an unexpected error..."
- button "Try again"
- link "Go to homepage"
```

**Console Error:**
```
TypeError: Failed to construct 'Image': Please use the 'new' operator,
this DOM object constructor cannot be called as a function.
```

---

## 🔍 CODE ANALYSIS

### Files Audited

| File | Status | Issues |
|------|--------|--------|
| `login-form.tsx` | ❌ Bad | Raw inputs, raw buttons, no shadcn |
| `sign-up-form.tsx` | 💀 Broken | Crashes at runtime, raw inputs |
| `forgot-password-form.tsx` | ❌ Bad | No card wrapper, hardcoded i18n |
| `reset-password-client.tsx` | ⚠️ Partial | Uses Form but raw inputs inside |

---

## 🚨 CRITICAL ISSUES

### Issue #1: SIGN-UP PAGE RUNTIME ERROR (P0)

**File:** `app/[locale]/(auth)/_components/sign-up-form.tsx`

The page crashes when loading. Console shows `Image` constructor error. Need to investigate the `next/image` import and usage.

---

### Issue #2: RAW HTML INPUTS (Not Using Design System)

**What you have:**
```tsx
// login-form.tsx line ~112
<input
  className={`w-full h-10 px-3 text-sm text-foreground placeholder:text-muted-foreground 
    bg-background border rounded-lg focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background 
    transition-colors ${error ? "border-destructive" : "border-input"}`}
/>
```

**What your Input component provides:**
```tsx
// components/ui/input.tsx - BEAUTIFUL, ACCESSIBLE, TESTED
className={cn(
  "h-10 md:h-9 w-full rounded-md border bg-transparent px-3 py-1",
  "text-base md:text-sm",  // iOS zoom prevention!
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  "dark:bg-input/30",  // Dark mode support!
)}
```

**Problems:**
- Auth forms use `text-sm` (14px) → iOS Safari zooms on focus
- Auth forms use `rounded-lg` → Design system uses `rounded-md`
- Auth forms missing `dark:bg-input/30` → No dark mode
- Auth forms manually concatenate classes → Duplicate logic

---

### Issue #3: PASSWORD VALIDATION MISMATCH

**Schema in `lib/validations/auth.ts`:**
```typescript
export const passwordSchema = z.string().min(8, ...)  // 8 CHARACTERS
```

**Schema in `signUpSchema`:**
```typescript
password: z.string().min(8, ...)  // 8 CHARACTERS ✅
```

**BUT the UI requirements in `sign-up-form.tsx`:**
```tsx
{ label: t("reqMinChars"), met: password.length >= 6 }  // 6 CHARACTERS! ❌
```

**User Impact:** Form shows green checkmark at 6 characters but validation fails at submit because schema requires 8.

---

### Issue #4: RAW HTML BUTTONS

**What you have:**
```tsx
<button
  className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 
    disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium rounded-lg"
>
```

**What your Button component provides:**
```tsx
// Size "lg" = 36px (h-9), perfect for forms
// Includes: focus-visible rings, aria-invalid support, dark mode
<Button size="lg" className="w-full">Submit</Button>
```

**Problems:**
- Auth buttons use `h-10` (40px) → No such size in Button component
- Auth buttons use `rounded-lg` → Button uses `rounded-md`
- Auth buttons use `font-medium` → Button uses `font-normal`
- Missing focus-visible ring handling

---

### Issue #5: RAW HTML CHECKBOX

**What you have:**
```tsx
<input
  type="checkbox"
  className="size-5 rounded border-input accent-primary cursor-pointer"
/>
```

**What you SHOULD use:**
```tsx
import { Checkbox } from "@/components/ui/checkbox"

<Checkbox id="remember-me" />
```

---

### Issue #6: INCONSISTENT CONTAINER PATTERNS

| Form | Wrapper | Background | Card |
|------|---------|------------|------|
| Login | `min-h-svh flex items-center justify-center` | `bg-muted/30` | ✅ Has card |
| Sign-Up | `min-h-svh flex items-center justify-center` | `bg-muted/30` | ✅ Has card |
| Forgot Password | `w-full max-w-sm mx-auto` | None | ❌ No card! |
| Reset Password | `w-full max-w-sm mx-auto` | None | ❌ No card! |

**You already have `components/auth/auth-card.tsx`!** Why isn't it being used?

---

### Issue #7: HARDCODED i18n

**forgot-password-form.tsx:**
```tsx
{locale === "bg" ? "Имейл адрес" : "Email address"}
```

**login-form.tsx (correct):**
```tsx
const t = useTranslations("Auth")
{t("emailOrPhone")}
```

Pick ONE approach. Use `useTranslations` everywhere.

---

## 🎨 VISUAL DESIGN ROAST

### Border Radius Chaos
- `rounded-lg` in auth forms (8px)
- `rounded-md` in shadcn components (6px)
- `rounded-b-xl` in footer (12px)

**Pick ONE and stick with it!**

### Button Height Chaos
- Auth forms: `h-10` (40px)
- Button component: `xs`=24px, `sm`=28px, `default`=32px, `lg`=36px

**40px doesn't exist in your design system!**

### Input Height Inconsistency
- shadcn Input: `h-10 md:h-9` (responsive)
- Auth inputs: `h-10` (fixed)

---

## ✅ YOUR EXISTING COMPONENTS (USE THEM!)

### components/ui/input.tsx
```tsx
// iOS zoom prevention with text-base md:text-sm
// Dark mode with dark:bg-input/30
// aria-invalid styling built-in
```

### components/ui/button.tsx
```tsx
// 7 variants: default, destructive, outline, secondary, ghost, link, cta, deal
// 7 sizes: xs, sm, default, lg, icon, icon-sm, icon-lg
// Focus rings, aria-invalid, dark mode
```

### components/ui/form.tsx
```tsx
// react-hook-form integration
// Zod resolver support
// FormField, FormItem, FormLabel, FormControl, FormMessage
```

### components/auth/auth-card.tsx
```tsx
// Already exists! Uses Card, CardHeader, CardContent, CardFooter
// Centered layout with logo
```

### components/auth/auth-form-field.tsx
```tsx
// Already exists! Combines Label + Input + error display
```

---

## 🔧 FIX PLAN (Priority Order)

### P0: Fix Sign-Up Crash (IMMEDIATE)
1. Check `sign-up-form.tsx` for `Image` import issues
2. Run `grep -r "Image(" app/[locale]/(auth)/` to find conflicts
3. Ensure using `import Image from "next/image"` correctly

### P1: Replace Raw Inputs
```tsx
// Before
<input className="w-full h-10 px-3 text-sm..." />

// After
import { Input } from "@/components/ui/input"
<Input />
```

### P2: Replace Raw Buttons
```tsx
// Before
<button className="w-full h-10 bg-primary..." />

// After
import { Button } from "@/components/ui/button"
<Button size="lg" className="w-full">Submit</Button>
```

### P3: Fix Password Validation
Change `sign-up-form.tsx` line ~86 from `>= 6` to `>= 8`:
```tsx
{ label: t("reqMinChars"), met: password.length >= 8 }
```

### P4: Use AuthCard Wrapper
Wrap all auth forms with `<AuthCard>`:
```tsx
import { AuthCard } from "@/components/auth/auth-card"

export function LoginForm() {
  return (
    <AuthCard title={t("signIn")} description={t("signInDescription")}>
      <form>...</form>
    </AuthCard>
  )
}
```

### P5: Use Checkbox Component
```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

<div className="flex items-center space-x-2">
  <Checkbox id="remember" onCheckedChange={setRememberMe} />
  <Label htmlFor="remember">{t("rememberMe")}</Label>
</div>
```

### P6: Standardize i18n
Replace all `locale === "bg" ? ... : ...` with `useTranslations`.

---

## 🏁 ACCEPTANCE CRITERIA

- [ ] **Sign-up page loads without crashing**
- [ ] All forms use `<Input>` from shadcn
- [ ] All forms use `<Button>` from shadcn
- [ ] All forms use `<Label>` from shadcn
- [ ] All forms use `<Checkbox>` from shadcn
- [ ] All forms wrapped in `<AuthCard>`
- [ ] Password validation consistent (8 chars)
- [ ] iOS zoom prevention working (`text-base md:text-sm`)
- [ ] All i18n uses `useTranslations`
- [ ] Dark mode works on all forms
- [ ] Border radius consistent (`rounded-md`)

---

## 🧪 TESTING

```bash
# After fixes, run:
pnpm test __tests__/validations-auth.test.ts
pnpm exec playwright test e2e/auth.spec.ts

# Manual tests:
# - iOS Safari: tap input, should NOT zoom
# - Dark mode toggle: forms should adapt
# - Screen reader: verify labels announce correctly
```

---

## 📚 REFERENCE FILES

| Component | File |
|-----------|------|
| Input | `components/ui/input.tsx` |
| Button | `components/ui/button.tsx` |
| Form | `components/ui/form.tsx` |
| Label | `components/ui/label.tsx` |
| Checkbox | `components/ui/checkbox.tsx` |
| Card | `components/ui/card.tsx` |
| AuthCard | `components/auth/auth-card.tsx` |
| AuthFormField | `components/auth/auth-form-field.tsx` |
| Validation | `lib/validations/auth.ts` |

---

**The kitchen is a DISASTER. One form doesn't even LOAD. The ones that do have inconsistent styling, ignore your design system, and will zoom on iOS.**

*"This form is RAWWWWW and one of them is LITERALLY BROKEN!" - Gordon Ramsay, definitely*
