# 🔥 SCRIPTS FOLDER AUDIT

## Executive Summary

| Category | Score | Notes |
|----------|-------|-------|
| Documentation | 1/10 | Zero JSDoc, zero README |
| Error Handling | 5/10 | Some scripts have it, others don't |
| Organization | 4/10 | SQL in wrong place, orphaned scripts |
| Cross-Platform | 3/10 | PowerShell scripts break CI |
| `package.json` Integration | 6/10 | Many scripts not exposed |
| Code Quality | 6/10 | Magic numbers, duplication |
| Security | 7/10 | Good secrets handling, but improvable |

**OVERALL: 4.5/10**

---

## 📁 Scripts Inventory

| File | Size | Type | In package.json? |
|------|------|------|------------------|
| `check-fonts.mjs` | ~2KB | Build Utility | ✅ Yes |
| `cleanup-deprecated.ps1` | ~4KB | Cleanup Script | ❌ No |
| `create-e2e-user.mjs` | ~3KB | E2E Setup | ❌ No |
| `migrations.sql` | ~2KB | SQL | ❌ No |
| `mobile-audit.mjs` | ~6KB | Audit Tool | ❌ No |
| `probe-runtime.mjs` | ~1KB | Debug Utility | ❌ No |
| `run-playwright.mjs` | ~1KB | E2E Runner | ❌ No |
| `run-vitest.mjs` | ~600B | Test Wrapper | ✅ Yes |
| `scan-tailwind-palette.mjs` | ~4KB | Code Analysis | ❌ No (task only) |
| `sellers.csv` | ~10KB | Config/Data | N/A |
| `strict-type-audit.mjs` | ~5KB | Type Safety | ✅ Yes |
| `tailwind-scan.mjs` | ~2KB | UX Tool | ✅ Yes |
| `validate-locale-keys.mjs` | ~3KB | Validation | ✅ Yes |
| `verify-e2e-login.mjs` | ~1KB | E2E Utility | ❌ No |

---

## 🚨 CRITICAL ISSUES

### 1. SQL FILE IN WRONG LOCATION

**File:** `scripts/migrations.sql`  
**Severity:** 🔴 CRITICAL

A SQL migrations file has NO BUSINESS being in `scripts/`! You have a `supabase/` folder for a reason!

```
scripts/migrations.sql  ← WRONG LOCATION
supabase/              ← WHERE IT BELONGS
```

**Issue:** This file defines your entire database schema (profiles, products, orders, RLS policies). It's orphaned and will be missed when running Supabase migrations.

**Fix:**
```bash
mv scripts/migrations.sql supabase/migrations/20240101000000_initial_schema.sql
```

---

### 2. DEAD SCRIPTS REFERENCED IN `cleanup-deprecated.ps1`

**Lines:** 99-101

```powershell
# Scripts
"scripts/phase0-maps.mjs"                          # DOESN'T EXIST
"scripts/codemods/relocate-root-components.mjs"   # DOESN'T EXIST
```

**Issue:** Either these were already deleted, or this script is outdated.

**Fix:** Remove non-existent references from the cleanup list.

---

## 🟠 HIGH SEVERITY ISSUES

### 3. NO DOCUMENTATION / JSDoc COMMENTS

**Affected:** ALL .mjs files

Not a SINGLE script has proper documentation headers. What do these do? Who maintains them?

**Worst Offenders:**
- `probe-runtime.mjs` - 37 lines, ZERO comments
- `mobile-audit.mjs` - 170 lines of complex viewport analysis, NO explanation

**Fix:** Add JSDoc headers to every script:
```javascript
/**
 * @file probe-runtime.mjs
 * @description Probes the running dev server to check header/language-switcher sizing
 * @usage node scripts/probe-runtime.mjs [baseUrl]
 */
```

---

### 4. MISSING SHEBANG LINES

**Affected:** ALL .mjs files  
**Line:** Line 1 of every file

None of these scripts have proper shebang lines for Unix compatibility:

```javascript
// MISSING:
#!/usr/bin/env node
```

**Affected Files:**
- `check-fonts.mjs`
- `create-e2e-user.mjs`
- `mobile-audit.mjs`
- `probe-runtime.mjs`
- `run-playwright.mjs`
- `run-vitest.mjs`
- `scan-tailwind-palette.mjs`
- `strict-type-audit.mjs`
- `tailwind-scan.mjs`
- `validate-locale-keys.mjs`

---

### 5. ORPHANED SCRIPTS - NO `package.json` ENTRY

These scripts have NO npm script entry and can only be run manually:

| Script | Purpose | Should Have Entry? |
|--------|---------|-------------------|
| `create-e2e-user.mjs` | Creates E2E test user | ✅ Yes - `"e2e:create-user"` |
| `verify-e2e-login.mjs` | Verifies E2E login works | ✅ Yes - `"e2e:verify-login"` |
| `mobile-audit.mjs` | Mobile UX audit | ✅ Yes - `"audit:mobile"` |
| `probe-runtime.mjs` | Debug utility | ⚠️ Maybe - internal use |
| `cleanup-deprecated.ps1` | Bulk cleanup | ⚠️ Maybe - dangerous |

**Fix:** Add to package.json:
```json
{
  "e2e:create-user": "node scripts/create-e2e-user.mjs",
  "e2e:verify-login": "node scripts/verify-e2e-login.mjs",
  "audit:mobile": "node scripts/mobile-audit.mjs"
}
```

---

### 6. HARDCODED URLS

**File:** `probe-runtime.mjs` Line 15  
**File:** `mobile-audit.mjs` Line 24

```javascript
// probe-runtime.mjs
await page.goto("http://localhost:3000/bg", { ... });  // Hardcoded!

// mobile-audit.mjs
const baseUrl = process.argv[2] || "http://localhost:3000/bg";  // Hardcoded locale!
```

**Issue:** `/bg` locale is hardcoded. What if someone uses `/en`?

**Fix:** Make locale configurable:
```javascript
const baseUrl = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";
```

---

## 🟡 MEDIUM SEVERITY ISSUES

### 7. MIXED SCRIPTING LANGUAGES

```
✅ .mjs files (10)
❌ .ps1 files (2)  ← Windows-only!
```

**Issue:** PowerShell scripts won't work on Linux/Mac CI environments.

**Fix:** Convert to cross-platform Node.js scripts or add shell script alternatives.

---

### 8. INCONSISTENT ERROR HANDLING

**File:** `run-playwright.mjs`  
**Lines:** 10-18

```javascript
child.on('exit', (code, signal) => {
  if (typeof code === 'number') process.exit(code)
  process.exit(signal ? 1 : 0)
})
// No 'error' event handler!
```

**Issue:** If spawn fails (e.g., `pnpm` not found), the script silently hangs.

**Fix:**
```javascript
child.on('error', (err) => {
  console.error('Failed to start child process:', err.message)
  process.exit(1)
})
```

---

### 9. MAGIC NUMBERS / HARDCODED VALUES

**File:** `probe-runtime.mjs` Lines 19-20

```javascript
const viewport = { width: 390, height: 844 };  // iPhone 14 Pro? Document it!
```

**File:** `mobile-audit.mjs` Line 124
```javascript
for (const f of newFindings.slice(0, 50)) {  // Why 50? Magic number!
```

**Fix:** Extract to named constants:
```javascript
// iPhone 14 Pro viewport dimensions
const IPHONE_14_PRO_VIEWPORT = { width: 390, height: 844 };
const MAX_FINDINGS_TO_DISPLAY = 50;
```

---

### 10. DUPLICATE FUNCTIONALITY

**Files:** `create-e2e-user.mjs` vs `verify-e2e-login.mjs`

Both scripts have duplicate code:
- `loadEnvFiles` - identical function
- `env` / `requireEnv` - identical functions
- Supabase client creation - nearly identical

**Fix:** Extract shared utilities to `scripts/lib/e2e-utils.mjs`:
```javascript
// scripts/lib/e2e-utils.mjs
export { loadEnvFiles, env, requireEnv, createAnonClient }
```

---

### 11. OUTPUT TO UNKNOWN DIRECTORIES

**File:** `mobile-audit.mjs` Line 24  
**File:** `scan-tailwind-palette.mjs` Line 89

```javascript
// mobile-audit.mjs
const outDir = path.join(process.cwd(), "cleanup", `mobile-audit-${nowStamp()}`);

// scan-tailwind-palette.mjs
const reportPath = path.resolve(projectRoot, "cleanup/palette-scan-report.txt");
```

**Issue:** Scripts dump output into a `cleanup/` directory that may not exist and isn't documented.

**Fix:** Use `.gitignore`-tracked output directories:
```javascript
const outDir = path.join(process.cwd(), ".reports", "mobile-audit");
```

---

## 🔵 LOW SEVERITY ISSUES

### 12. CONSOLE.LOG INSTEAD OF STRUCTURED LOGGING

All scripts use `console.log` / `console.error`. For a production project, consider structured logging.

---

### 13. TypeScript BASELINE HAS 134 FINDINGS

**File:** `scripts/strict-type-audit.mjs`

The baseline contains **134 `any`/`as-any`/`non-null` assertions** being grandfathered in.

**Recommendation:** Set a goal to reduce by 10% per sprint.

---

### 14. SENSITIVE DATA HANDLING

**File:** `cleanup-deprecated.ps1` Lines 23-35

Good job using `SecureString` for password handling! But the cleanup could be more robust.

---

## ✅ RECOMMENDED ACTIONS

### Immediate (This Week)
1. **Move `migrations.sql`** to `supabase/migrations/`
2. **Add shebang lines** to all `.mjs` files
3. **Remove dead references** from `cleanup-deprecated.ps1`

### Short Term (This Sprint)
4. **Add `package.json` entries** for orphaned scripts
5. **Create `scripts/README.md`** documenting all scripts
6. **Extract shared E2E utilities** to reduce duplication

### Medium Term (Next Month)
7. **Convert PowerShell scripts** to Node.js for CI compatibility
8. **Add JSDoc headers** to all scripts
9. **Create `scripts/lib/` folder** for shared utilities
10. **Reduce TypeScript baseline** by fixing `any` types
