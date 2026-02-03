# Folder: `hooks/`

Status: Not audited

## Why this folder exists (expected)

Shared hooks. Keep this folder small; many hooks belong route-private or inside components.

## Audit checklist

- [ ] Inventory hooks and classify: truly shared vs route-private.
- [ ] Delete unused hooks and duplicated “utility hooks”.
- [ ] Ensure hooks don’t force `"use client"` at too-broad boundaries.

