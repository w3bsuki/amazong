---
name: perf-audit
description: Performance audit for this repo (Lighthouse, build/SSG cost, bundle hygiene, image/layout shift). Triggers on "PERF:" prefix and performance optimization work.
---

# Performance Audit (Perf + Cost)

Use this skill when you’re worried about speed, Core Web Vitals, or build/SSG cost spikes.

## Entry Criteria (ask if missing)

- Target route(s) and device focus (mobile/desktop)
- Problem signal (slow TTI, CLS, build timeout, heavy SSG, etc.)

## On Any "PERF:" Prompt

1. Load canonical rules:
   - `docs/ENGINEERING.md` (caching + cost drivers)
   - `docs/FRONTEND.md` + `docs/DESIGN.md` (images/layout)
2. Check common perf footguns:
   - Too much client JS (`\"use client\"` where not needed).
   - Layout shift (missing stable sizes, image aspect ratios).
   - Over-fetching on list pages (`select('*')`, wide joins, no pagination).
   - Caching misuse (user-specific reads cached, missing invalidation).
3. Run Lighthouse when meaningful:
   - `pnpm test:lighthouse`
4. Output findings with routes/files and propose fixes with best ROI first.

## Output Format

```markdown
## Perf Audit — {date}

### Critical (must fix)
- [ ] Issue → Route/File → Fix

### High
- [ ] Issue → Route/File → Fix
```
