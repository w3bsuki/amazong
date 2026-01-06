# 💬 Chat & Messaging

> **Status**: 🟡 85% Complete
> **Priority**: P1

---

## ✅ Working Features

- [x] Real-time messaging via Supabase Realtime
- [x] Conversation list with recent messages
- [x] Typing indicators
- [x] Image attachments
- [x] Read receipts
- [x] Block user functionality
- [x] Report conversation functionality
- [x] Unread message count
- [x] Message timestamps

---

## 🔴 Issues to Fix

### P0 - Launch Blockers
_None - chat works for MVP_

### P1 - High Priority
- [ ] **Chat access control** - Option to limit chat to after purchase only
- [ ] **Notification for new messages** - No in-app or email notification
- [ ] **Chat from product page** - "Message seller" button behavior
- [ ] **Offline message handling** - Queue messages when offline

### P2 - Nice to Have
- [ ] Push notifications for new messages
- [ ] Email notifications for unread messages
- [ ] Message search
- [ ] Voice messages
- [ ] File attachments (PDF, etc.)

---

## 🧪 Test Cases

### Manual QA
| # | Scenario | Expected | Status |
|---|----------|----------|--------|
| 1 | Start conversation with seller | New chat created, can send message | ⬜ |
| 2 | Send text message | Message delivered, shows in chat | ⬜ |
| 3 | Send image | Image uploaded, displayed in chat | ⬜ |
| 4 | Receive message (realtime) | Message appears without refresh | ⬜ |
| 5 | Typing indicator | Shows when other user typing | ⬜ |
| 6 | Mark as read | Read receipts update | ⬜ |
| 7 | Block user | Cannot receive messages from blocked | ⬜ |
| 8 | Report conversation | Report submitted | ⬜ |
| 9 | Chat on mobile | Full functionality, good UX | ⬜ |

---

## 📁 Key Files

```
components/providers/
└── messaging-provider.tsx         # Real-time context (707 lines)

app/[locale]/(chat)/
├── _components/
│   └── chat-interface.tsx         # Chat UI (850 lines)
├── _actions/
│   └── report-conversation.ts     # Report functionality
├── messages/page.tsx              # Conversation list
└── messages/[id]/page.tsx         # Chat view
```

---

## 📝 Real-time Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Supabase Realtime                   │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              MessagingProvider (Context)             │
│  - Subscribes to conversations                       │
│  - Handles incoming messages                         │
│  - Manages typing indicators                         │
│  - Updates unread counts                            │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                  ChatInterface                       │
│  - Renders messages                                  │
│  - Handles send/receive                              │
│  - Image upload                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Chat Access Control Options

Consider implementing setting for sellers:

| Option | Description |
|--------|-------------|
| `open` | Anyone can message |
| `purchase_only` | Only buyers who purchased can message |
| `followers_only` | Only followers can message |
| `disabled` | No messages accepted |

Could be stored in `profiles.chat_settings` JSON field.

---

## 🎯 Acceptance Criteria for Launch

- [ ] Can start conversation from product/seller page
- [ ] Messages send and receive in real-time
- [ ] Images can be attached
- [ ] Typing indicators work
- [ ] Block/report functionality works
- [ ] Unread count accurate
- [ ] Mobile chat experience is good
- [ ] No console errors during chat
