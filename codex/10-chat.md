# [10] Chat / Messaging

> Conversation list · Real-time messaging · Order-linked chats · Image upload · Notifications

## What Must Work

- Chat page at `/chat` with conversation list
- Individual conversation at `/chat/[conversationId]`
- Real-time message delivery via Supabase Realtime
- Auto-create conversation when order is placed (buyer ↔ seller)
- Image upload in chat
- Report conversation
- Unread message count in header/nav
- Message notifications

## Files to Audit

```
app/[locale]/(chat)/                    → All pages + _actions/ + _components/

components/providers/message-context.tsx
components/providers/messages/
components/mobile/drawers/messages-drawer.tsx
components/dropdowns/messages-dropdown.tsx

app/api/upload-chat-image/

lib/supabase/messages.ts
lib/types/messages.ts
lib/order-conversations.ts

hooks/use-notification-count.ts
```

## Instructions

1. Read every file listed above
2. Audit for: over-split message context, drawer/dropdown duplication, dead code
3. Refactor — same features, less code
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** Supabase Realtime subscription setup, DB schema, message table structure.
