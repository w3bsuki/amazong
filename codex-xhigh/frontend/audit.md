# Frontend ↔ Backend Alignment Checklist

- [ ] Each feature has a single query module (orders, plans, products, chat, reviews).
- [ ] Shared components don’t import server actions directly.
- [ ] Plan/badge logic is computed in one place and reused everywhere.
- [ ] Frontend renders based on DB state, not inferred UI state (avoid “tab means boosted” hacks).

