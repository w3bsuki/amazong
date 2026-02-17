# Account, Chat, And Admin Audit

## Scope

- `app/[locale]/(account)`
- `app/[locale]/(chat)`
- `app/[locale]/(admin)`
- `components/layout/header/*`
- `components/layout/sidebar/*`
- account/chat/admin-related server actions

## Current State Summary

- Account and chat carry most complexity in large client-heavy files.
- Admin area is smaller but has repeated table/content patterns.

## Findings

## P0

- Account layout has duplicate auth/user fetch behavior:
  - server layout gating + client re-fetch in `app/[locale]/(account)/_components/account-layout-content.tsx` (`81 lines`).
- Oversized account/chat files:
  - `app/[locale]/(account)/account/billing/billing-content.tsx` (`729 lines`)
  - `app/[locale]/(account)/account/addresses/addresses-content.tsx` (`474 lines`)
  - `app/[locale]/(chat)/_components/chat-interface.tsx` (`760 lines`)

## P1

- Account navigation data appears in multiple components:
  - `app/[locale]/(account)/account/_components/account-sidebar.tsx`
  - `app/[locale]/(account)/account/_components/account-tab-bar.tsx`
  - `components/layout/sidebar/sidebar-menu.tsx` (`484 lines`)
- Chat filtering/transformation concerns are spread across page, interface, context/provider modules.

## P2

- Admin pages show repeatable page/table structure that can be template-driven.

## Simplification Targets

1. Keep server authoritative for authenticated user context in account layout.
2. Split large client screens into smaller form/table/hook modules.
3. Define one canonical account navigation config.
4. Shrink chat surface into focused concerns (list, thread, compose, filters).

## Candidate Refactor Moves

- Create shared `account-nav-config` consumed by sidebar/tab/nav components.
- Move account data mutations into tighter action helpers and pass props to presentational clients.
- Segment chat into subcomponents and reusable hooks with clear interfaces.
- Standardize admin list/detail scaffolding to reduce duplicate view wiring.

## High-Risk Pause Areas

- Any account/auth boundary changes.
- Any chat message consistency behavior tied to realtime updates.
- Any admin write paths with elevated permissions.

## Success Criteria

- Reduced large-file count in account/chat.
- No duplicate user-fetch for account layout.
- Shared navigation config adopted across account surfaces.
- Chat behavior parity maintained with lower component complexity.
