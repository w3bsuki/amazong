# 🚀 QUICK REFERENCE CARD

> **Print this page and keep it handy during launch**

---

## ⚡ CRITICAL COMMANDS

```powershell
# DELETE SECURITY RISK (DO FIRST!)
Remove-Item -Recurse -Force "app/api/debug-auth"

# VERIFY BUILD
pnpm build

# START PRODUCTION SERVER LOCALLY
pnpm start

# CHECK TYPESCRIPT
pnpm exec tsc --noEmit

# RUN LINT
pnpm lint
```

---

## 🔴 BLOCKING ISSUES (Must Fix)

| Issue | Command | Priority |
|-------|---------|----------|
| Debug auth endpoint | `Remove-Item -Recurse -Force "app/api/debug-auth"` | 🔴 CRITICAL |
| Demo routes | `Remove-Item -Recurse -Force "app/[locale]/(main)/sell/demo1"` | 🔴 CRITICAL |
| Component audit page | `Remove-Item -Recurse -Force "app/[locale]/(main)/component-audit"` | 🔴 CRITICAL |
| Old schema | `Remove-Item -Force "lib/sell-form-schema-v3.ts"` | 🟡 HIGH |

---

## 📋 ENVIRONMENT VARIABLES

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # SECRET

# Stripe (USE LIVE KEYS!)
STRIPE_SECRET_KEY=                # SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=            # SECRET
STRIPE_SUBSCRIPTION_WEBHOOK_SECRET=  # SECRET

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🧪 STRIPE TEST CARDS

```
Success:     4242 4242 4242 4242
Decline:     4000 0000 0000 0002
3D Secure:   4000 0025 0000 3155
Exp: Any future date
CVC: Any 3 digits
```

---

## 🆘 ROLLBACK COMMANDS

```powershell
# Vercel: Use dashboard to revert to previous deployment

# Git: Revert last commit
git revert HEAD
git push origin main
```

---

## 📞 EMERGENCY CONTACTS

- **Vercel:** support@vercel.com
- **Supabase:** support@supabase.io
- **Stripe:** https://support.stripe.com

---

## ✅ LAUNCH DAY CHECKLIST

### Pre-Launch (T-2 hours)
- [ ] Delete debug endpoints
- [ ] Run final build locally
- [ ] Test checkout with Stripe test mode
- [ ] Verify env vars in Vercel

### Launch (T-0)
- [ ] Push to main branch
- [ ] Watch Vercel build logs
- [ ] Verify site loads

### Post-Launch (T+30 min)
- [ ] Test signup/login
- [ ] Test product browsing
- [ ] Test checkout (live mode)
- [ ] Check Stripe webhook delivery

---

## 📊 HEALTH CHECK URLS

```
Homepage:     https://yourdomain.com
Login:        https://yourdomain.com/login
Product:      https://yourdomain.com/product/[slug]
Checkout:     https://yourdomain.com/checkout
```

---

*Keep this card visible during launch! 🚀*
