# ⚡ Quick Start: Critical Fixes Before Launch

## ✅ COMPLETED (Automatically Applied)

All database fixes have been applied via Supabase MCP:

1. ✅ Added `tags` column (text[] with GIN index)
2. ✅ Added Bulgarian support columns (`name_bg`, etc.)
3. ✅ Fixed Cyrillic search (changed to 'simple' config)
4. ✅ Created 56 categories (11 main + 45 subcategories)
5. ✅ Added performance indexes
6. ✅ Fixed security: extension schema, function search_path

**Test product inserted:** "Волан за БМВ" - search works! ✅

---

## 🔴 MANUAL ACTIONS REQUIRED (15 minutes)

### 1. Enable Leaked Password Protection (CRITICAL)
**Time:** 2 minutes  
**Priority:** 🔴 HIGH - Security issue

**Steps:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to: **Authentication** → **Settings** → **Password Protection**
4. Enable: **"Prevent sign ups with leaked passwords"**
5. Save

**Why:** Prevents users from using passwords from data breaches (e.g., "password123")

---

### 2. Fix Category Selector UX (HIGH PRIORITY)
**Time:** 2-3 hours  
**Priority:** 🔴 HIGH - UX blocker

**File:** `app/[locale]/sell/page.tsx`

**Current Problem:**
```tsx
// Shows ALL 56 categories in one flat dropdown - overwhelming!
<Select>
  {categories.map((c) => (
    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
  ))}
</Select>
```

**Fix: Add hierarchical selection**

```tsx
"use client"

import { useState, useEffect } from "react"

export default function SellPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [mainCategory, setMainCategory] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  
  // Fetch categories
  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    if (data) setCategories(data)
  }

  // Get main categories (no parent)
  const mainCategories = categories.filter(c => !c.parent_id)
  
  // Get subcategories for selected main category
  const subcategories = categories.filter(c => 
    c.parent_id === mainCategory
  )

  // Use Bulgarian names if locale is 'bg'
  const getCategoryName = (category: any) => {
    return locale === 'bg' ? category.name_bg || category.name : category.name
  }

  return (
    <form onSubmit={handleCreateProduct}>
      {/* Step 1: Select Main Category */}
      <div className="space-y-2">
        <Label htmlFor="mainCategory">Main Category</Label>
        <Select 
          value={mainCategory} 
          onValueChange={(value) => {
            setMainCategory(value)
            setSelectedCategory("") // Reset subcategory
          }}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select main category" />
          </SelectTrigger>
          <SelectContent>
            {mainCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {getCategoryName(c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Step 2: Select Subcategory (if main category selected) */}
      {mainCategory && subcategories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {getCategoryName(c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* If no subcategories, use main category */}
      {mainCategory && subcategories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No subcategories available. Using main category.
        </p>
      )}

      {/* Rest of form... */}
      {/* Tags field, title, description, etc. */}
    </form>
  )
}
```

**Also remove:**
- The freetext "subcategory" field (line ~237)
- Update API call to use `selectedCategory || mainCategory` as `categoryId`

---

### 3. Use Bulgarian Category Names
**Time:** 30 minutes  
**Priority:** 🟡 MEDIUM

**Files to Update:**
- `app/[locale]/sell/page.tsx` (see code above)
- Any component displaying categories

**Pattern:**
```tsx
const displayName = locale === 'bg' 
  ? category.name_bg || category.name 
  : category.name
```

---

### 4. Test End-to-End Flow
**Time:** 1 hour  
**Priority:** 🟡 MEDIUM

**Steps:**
1. Create new user account
2. Create seller profile
3. List product "Волан за БМВ"
   - Main Category: Автомобили (Automotive)
   - Subcategory: Авточасти (Car Parts)
   - Tags: БМВ, волан, кожа
4. Search for "Волан" → verify product appears
5. Search for "БМВ" → verify product appears

---

## 📚 Documentation Created

1. **`AUDIT_SUMMARY.md`** - Executive summary of all findings
2. **`BULGARIA_LAUNCH_PLAN.md`** - Comprehensive 200+ item checklist
3. **`QUICK_START_FIXES.md`** - This file (quick reference)

---

## 🎯 Priority Order

1. **TODAY:** Enable password protection (2 min)
2. **THIS WEEK:** Fix category selector UX (3 hours)
3. **NEXT WEEK:** Complete Pre-Launch Checklist from `BULGARIA_LAUNCH_PLAN.md`

---

## ✅ What's Already Working

- ✅ Database schema production-ready
- ✅ 56 categories with Bulgarian translations
- ✅ Cyrillic search functional (tested!)
- ✅ Tags system working
- ✅ Multi-vendor architecture solid
- ✅ RLS policies secure
- ✅ Performance indexes in place

---

## 🧪 Test Commands

```bash
# Test Bulgarian search (in Supabase SQL Editor)
SELECT id, title, tags 
FROM products 
WHERE search_vector @@ to_tsquery('simple', 'Волан')
ORDER BY ts_rank(search_vector, to_tsquery('simple', 'Волан')) DESC;

# List all categories with hierarchy
SELECT 
  c1.name as main_category,
  c1.name_bg as main_category_bg,
  c2.name as subcategory,
  c2.name_bg as subcategory_bg
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
WHERE c1.parent_id IS NULL
ORDER BY c1.name, c2.name;

# Count categories
SELECT 
  COUNT(*) FILTER (WHERE parent_id IS NULL) as main_categories,
  COUNT(*) FILTER (WHERE parent_id IS NOT NULL) as subcategories,
  COUNT(*) as total
FROM categories;
-- Result: 11 main, 45 sub, 56 total ✅
```

---

## 🆘 If Something Breaks

**Revert migrations:**
```sql
-- Revert tags column (if needed)
ALTER TABLE products DROP COLUMN IF EXISTS tags;

-- Revert categories columns (if needed)
ALTER TABLE categories 
  DROP COLUMN IF EXISTS name_bg,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS description_bg,
  DROP COLUMN IF EXISTS icon;
```

**Check Supabase status:**
- https://status.supabase.com/

**Review advisor warnings:**
```sql
-- In Supabase Dashboard → Database → Database Health
```

---

## 📞 Need Help?

1. Review detailed plan: `BULGARIA_LAUNCH_PLAN.md`
2. Check audit findings: `AUDIT_SUMMARY.md`
3. Review Supabase docs: https://supabase.com/docs

---

**Last Updated:** November 24, 2025  
**Database Status:** ✅ Production Ready (pending manual password protection)  
**Frontend Status:** ⚠️ Needs UX improvements
