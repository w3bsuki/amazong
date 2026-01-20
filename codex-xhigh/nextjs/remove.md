# Next.js — Remove / Avoid

- Page-level headers/footers (should be layout-owned).
- Route-based “skipMobile” flags and DOM hacks to hide parent layout UI.
- Duplicated demo routes (unless explicitly required for production).
- Shared components importing app-layer actions directly.

