# Chat & Messaging

## Goal

Provide real-time buyer-seller messaging linked to products and orders. Users can start conversations from any product page or order, exchange text and image messages, see unread indicators, and report or block abusive participants.

## Current Status

- Requirements: 7/7 complete (R10) — see REQUIREMENTS.md §R10
- Production: ✅ Ready

## Requirements Mapping

| Req ID | Description | Status |
|--------|-------------|--------|
| R10.1 | Start conversation (from PDP or order) | ✅ |
| R10.2 | Chat list (inbox with conversations) | ✅ |
| R10.3 | Chat thread (real-time via Supabase Realtime) | ✅ |
| R10.4 | Unread indicators (badge count) | ✅ |
| R10.5 | Image attachments | ✅ |
| R10.6 | Report conversation | ✅ |
| R10.7 | Block user | ✅ |

## Implementation Notes

### Routes

| Path | Group | Auth | Purpose |
|------|-------|------|---------|
| `/chat` | (chat) | auth | Messages inbox |
| `/chat/:conversationId` | (chat) | auth | Chat thread |

Layout: Full-height, split-view (list + thread on desktop; stack on mobile).

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/upload-chat-image` | POST | Upload image attachment |

### Server Actions

- Chat logic is handled inline within the route components (no dedicated action file in `app/actions/`)
- `blocked-users.ts` — User blocking (shared with trust-safety)

### DB Tables

| Table | Purpose |
|-------|---------|
| `conversations` | Buyer-seller threads, linked to `product_id` and optionally `order_id` |
| `messages` | Individual messages with types: `text`, `image`, `system` |

### Real-time

- Powered by **Supabase Realtime** subscriptions on the `messages` table
- New messages appear instantly without polling
- Unread count derived from messages where `read_at IS NULL` for the recipient

### Key Behaviors

- **Conversation initiation**: "Message Seller" button on PDP creates or reuses an existing conversation for that buyer-seller-product combination
- **System messages**: Generated automatically for order status changes (e.g., "Order shipped", "Order delivered")
- **Blocking**: Blocked users cannot send new messages; existing conversations are hidden from the blocker's inbox
- **Reporting**: Conversations can be reported, creating a moderation queue entry for admin review

## Known Gaps & V1.1+ Items

| Item | Status | Notes |
|------|--------|-------|
| B2B networking chat | ⬜ Deferred | Separate module for verified business accounts — private, rate-limited 1:1 messaging. Explicitly deferred until after V1 stability and trust systems are proven. See `../../context/business/specs/prd-b2b-networking-chat.mdx` |
| Read receipts | ⬜ Deferred | `read_at` column exists but UI indicator not implemented |
| Typing indicators | ⬜ Deferred | Not in V1 scope |
| Message search | ⬜ Deferred | No full-text search on messages |

## Cross-References

- [DATABASE.md](../DATABASE.md) — Conversations and messages tables
- [ROUTES.md](../ROUTES.md) — (chat) route group
- [trust-safety.md](./trust-safety.md) — Reporting and blocking flows
- [AUTH.md](../AUTH.md) — Auth-gated chat access

---

*Last updated: 2026-02-08*
