# Dead Code Audit

> Audit Date: 2026-02-02 | Auditor: dead-code-auditor | Status: ✅ Complete

---

## Summary

| Category | Count | Action |
|----------|-------|--------|
| **Orphaned Project** | 1 | 🔴 Delete entire folder! |
| Unused Files | 2 | ✅ Safe to delete |
| Unused Exports | 3 | ✅ Safe to remove |
| Temp Files | 1 | ✅ Safe to delete |
| False Positives | 0 | — |

---

## 🔴 CRITICAL: Orphaned Project (Phase 2)

| Path | Issue | Files | Action |
|------|-------|-------|--------|
| `temp-tradesphere-audit/` | **Entire separate project embedded in main repo!** | 26 files, 47 TS errors | **DELETE ENTIRE FOLDER** |

This is a Vite+React project accidentally left in the workspace. It causes:
- 47 TypeScript errors polluting CI
- Unnecessary bloat
- Confusion about project boundaries

```powershell
# Delete orphaned project (PowerShell)
Remove-Item -Recurse -Force temp-tradesphere-audit/
```

---

## Unused Files (Phase 2)

| Path | Lines | Evidence | Action |
|------|-------|----------|--------|
| `app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx` | 700+ | Knip confirmed, no imports | Delete |
| `components/shared/auth/social-input.tsx` | ~50 | Only consumer is above unused modal | Delete |

---

## Unused Exports (Phase 2)

| Path | Export | Evidence | Action |
|------|--------|----------|--------|
| `components/shared/field.tsx` | `FieldLegend` | No imports found | Remove export |
| `components/shared/field.tsx` | `FieldSet` | No imports found | Remove export |
| `components/mobile/category-nav/` | `CategoryMiniBar` | No imports found | Remove or delete file |

---

## Temp Files (Phase 2)

| Path | Content | Action |
|------|---------|--------|
| `tmp-delete-test.txt` | Contains "test" | Delete |

---

## Verified NOT Dead

These were investigated and confirmed as used:

| Item | Status | Notes |
|------|--------|-------|
| npm dependencies | ✅ In use | Capacitor deps intentionally for mobile |
| API routes | ✅ In use | All have consumers |
| Feature flags | ✅ All at 100% | No dead branches |
| `app/legacy-vars.css` | ✅ Active | CSS vars in use |
| `cleanup/` folder | ✅ Keep | Documentation, not code |
| `uirefactor/` folder | ✅ Keep | Planning docs |

---

## Cleanup Commands

```bash
# Delete unused files (Phase 2)
rm app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx
rm components/shared/auth/social-input.tsx
rm tmp-delete-test.txt
```

---

*Generated: 2026-02-02*
