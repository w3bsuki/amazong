# Phase 9: Chat & Messaging

> **Audit type:** Mobile Playwright · Production · Phase 9 of 18
> **Created:** 2026-02-09

---

## Metadata

| Field | Value |
|-------|-------|
| **Scope** | Full-screen chat inbox, conversation threads, real-time messaging, image sending, report/block, messages drawer |
| **Routes** | `/chat`, `/chat/:conversationId` |
| **Priority** | P1 |
| **Dependencies** | Phase 1 (Shell), Phase 3 (Auth — chat requires authentication) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | Yes — both routes auth-gated |
| **Status** | ✅ Complete (code audit 2026-02-11) |

---

## Source Files

| File | Purpose |
|------|---------|
| `app/[locale]/(chat)/layout.tsx` | Minimal fixed full-screen chat layout |
| `app/[locale]/(chat)/chat/page.tsx` | `/chat` route entry |
| `app/[locale]/(chat)/chat/loading.tsx` | Chat loading skeleton |
| `app/[locale]/(chat)/chat/[conversationId]/page.tsx` | `/chat/:conversationId` route entry |
| `app/[locale]/(chat)/chat/[conversationId]/loading.tsx` | Conversation loading skeleton |
| `app/[locale]/(chat)/_components/messages-page-client.tsx` | Main messages page client — conversation list + chat pane + ChatBottomTabs |
| `app/[locale]/(chat)/_components/chat-interface.tsx` | Core messaging UI — header, messages, input |
| `app/[locale]/(chat)/_components/conversation-list.tsx` | Filterable sidebar conversation list |
| `app/[locale]/(chat)/_components/conversation-page-client.tsx` | Direct conversation route client |
| `app/[locale]/(chat)/_components/chat-skeleton.tsx` | Chat loading skeleton component |
| `app/[locale]/(chat)/_actions/report-conversation.ts` | Report/block server action |
| `components/mobile/drawers/messages-drawer.tsx` | Quick-access messages drawer from global header |

---

## Layout Hierarchy

```
(chat)/layout.tsx
  └── <CommerceProviders>
       └── div.fixed.inset-0.flex.w-full.bg-background.overflow-hidden
            └── MessagesPageClient
                 └── <MessageProvider>
                      └── MessagesContent
                           ├── ConversationList (left panel)
                           ├── ChatBottomTabs (mobile filter bar)
                           └── ChatInterface (right panel / separate on mobile)
```

---

## Prerequisites

1. **Authenticated session** — chat routes are auth-gated; test user must be logged in.
2. **Test conversations** — at least 3 conversations seeded in DB:
   - One with unread messages (for unread indicator / filter).
   - One as a buyer conversation, one as a seller conversation (for Buying/Selling filters).
   - At least one conversation with 5+ messages for scroll testing.
3. **Second test user** — a counterpart to have sent messages to the primary test user.
4. **Phase 1 (Shell)** passing — global layout renders correctly.
5. **Phase 3 (Auth)** passing — user can authenticate and maintain session.

---

## Routes Under Test

| Route | Auth | Description |
|-------|------|-------------|
| `/chat` | Required | Chat inbox — conversation list with filters |
| `/chat/:conversationId` | Required | Individual conversation thread |

---

## Scenarios

### S9.1 — Chat Layout: Full-Viewport Takeover

**Goal:** Chat layout occupies entire viewport with no scroll bleed, no global header/footer/tab bar.

**Steps:**

1. Navigate to `/chat`.
2. Wait for the chat container to render: `div.fixed.inset-0`.
3. Measure the chat root bounding box.

**Selectors:**

- Chat root: `div.fixed.inset-0.flex` (within `(chat)/layout.tsx`)

**Expected:**

- Chat root `position: fixed`, `inset: 0`.
- Bounding box matches full viewport: `x=0, y=0, width=393, height=851` (Pixel 5).
- `overflow: hidden` on the chat root — no scroll outside chat.
- No global header (`header`), no bottom tab bar, no footer visible.
- `bg-background` applied — no white flash / transparent gaps.

**Screenshot checkpoint:** `s9-1-chat-full-viewport.png`

---

### S9.2 — Inbox: Conversation List Rendering

**Goal:** Conversation list displays each conversation with avatar, name, last message preview, and timestamp.

**Steps:**

1. Navigate to `/chat`.
2. Wait for conversation list to load (skeleton → content).
3. Locate the conversation list container.
4. For each conversation item, assert structural elements.

**Selectors:**

- Conversation list wrapper: `div.w-full.flex.flex-col` (the `lg:w-80 xl:w-96` panel)
- Conversation items: children within the scrollable area
- Avatar: `img` or avatar fallback within each item
- Name: text content (user display name)
- Last message: truncated preview text
- Timestamp: relative time element

**Expected:**

- At least 3 conversations rendered (per prerequisites).
- Each conversation item contains: avatar (rendered or fallback initials), display name, last message preview (single-line truncated), timestamp.
- Conversation list takes full width on mobile (`w-full`), scrollable vertically.
- Header area has `pt-safe-max-sm` for safe area padding.
- No horizontal overflow.

**Screenshot checkpoint:** `s9-2-conversation-list.png`

---

### S9.3 — Inbox: Unread Indicators

**Goal:** Conversations with unread messages show a visual unread indicator.

**Steps:**

1. Navigate to `/chat` (with at least one conversation having unread messages).
2. Locate the unread conversation item.
3. Assert unread indicator is visible.

**Selectors:**

- Unread indicator: badge / dot element on the conversation item (look for a colored dot or badge count)
- Conversation with unread: the item whose last message was not read by the current user

**Expected:**

- Unread conversation shows a visible indicator (dot, badge, or bold text styling).
- Read conversations do NOT show the unread indicator.
- Unread indicator has sufficient contrast against the conversation item background.
- Indicator does not clip or overflow the conversation item bounds.

**Screenshot checkpoint:** `s9-3-unread-indicators.png`

---

### S9.4 — Inbox: ChatBottomTabs Filter Bar

**Goal:** Mobile bottom filter tabs (All / Unread / Buying / Selling) render correctly with safe area padding and filter conversations.

**Steps:**

1. Navigate to `/chat`.
2. Locate the ChatBottomTabs component.
3. Assert all four tab labels are visible.
4. Tap "Unread" tab.
5. Assert conversation list is filtered.
6. Tap "Buying" tab.
7. Assert conversation list shows only buyer conversations.
8. Tap "Selling" tab.
9. Assert conversation list shows only seller conversations.
10. Tap "All" tab.
11. Assert full conversation list is restored.

**Selectors:**

- Bottom tabs container: element with `pb-safe lg:hidden` classes
- Tab items: interactive elements (buttons) within the tabs container
- Tab labels: text content — "All", "Unread", "Buying", "Selling"

**Expected:**

- Tabs container is visible on mobile (`lg:hidden` means visible below 1024px).
- `pb-safe` class applied for bottom safe area.
- All four tabs rendered with labels.
- Active tab has distinct visual state (selected / highlighted).
- "Unread" filter: only conversations with unread messages shown.
- "Buying" filter: only conversations where user is the buyer shown.
- "Selling" filter: only conversations where user is the seller shown.
- "All" filter: all conversations shown.
- Tab bar does not overlap conversation list content.

**Screenshot checkpoint:** `s9-4-bottom-tabs-filter.png`

---

### S9.5 — Tap Conversation: Navigate to Thread (Mobile Transition)

**Goal:** Tapping a conversation on mobile hides the list and shows the chat interface.

**Steps:**

1. Navigate to `/chat`.
2. Assert conversation list is visible.
3. Tap the first conversation item.
4. Wait for transition.
5. Assert conversation list is hidden and chat interface is visible.

**Selectors:**

- Conversation list panel: element with `w-full flex flex-col lg:w-80` — when chat is active on mobile: `hidden lg:flex`
- Chat interface panel: element with `flex-1 flex flex-col overflow-hidden` — default mobile: `hidden lg:flex`, active mobile: visible

**Expected:**

- Before tap: conversation list visible, chat interface hidden on mobile.
- After tap: conversation list hidden (`hidden lg:flex`), chat interface visible (`flex-1 flex flex-col`).
- URL updates to `/chat/:conversationId`.
- Transition is immediate (no layout shift artifact).
- Chat interface fills full width on mobile.

**Screenshot checkpoint:** `s9-5-conversation-to-thread.png`

---

### S9.6 — Thread: Message Bubbles Styling

**Goal:** Own messages and received messages render with correct bubble styling and alignment.

**Steps:**

1. Navigate to `/chat/:conversationId` (a conversation with messages from both users).
2. Locate message bubbles.
3. Inspect own-message bubbles.
4. Inspect received-message bubbles.

**Selectors:**

- Own messages: elements with `bg-primary text-primary-foreground rounded-2xl rounded-br-md`
- Received messages: elements with `bg-muted rounded-2xl rounded-bl-md`
- Message container: parent elements (likely flex with `justify-end` for own, `justify-start` for received)
- Max width: `max-w-(--chat-message-max-w)` CSS variable

**Expected:**

- Own messages: right-aligned, `bg-primary`, `text-primary-foreground`, `rounded-2xl` with `rounded-br-md` (sharp bottom-right corner).
- Received messages: left-aligned, `bg-muted`, `rounded-2xl` with `rounded-bl-md` (sharp bottom-left corner).
- Bubbles respect `max-w-(--chat-message-max-w)` — long messages wrap, do not exceed max width.
- Text inside bubbles is legible with proper padding.
- No bubble overlaps or misalignment.
- Timestamps visible per-message or per-group.

**Screenshot checkpoint:** `s9-6-message-bubbles.png`

---

### S9.7 — Thread: Message Input & Image Attach

**Goal:** Message input field and image attachment button are functional and correctly positioned.

**Steps:**

1. Navigate to `/chat/:conversationId`.
2. Locate the input area at bottom of chat.
3. Assert send button and image attach button are present.
4. Tap the input field — keyboard-equivalent focus.
5. Type a test string.
6. Assert send button becomes active/enabled.

**Selectors:**

- Input area container: element with `pb-safe-max-xs` at bottom of chat interface
- Text input: `input` or `textarea` within chat interface footer
- Send button: button with send icon/label
- Image attach button: button with attachment/image icon

**Expected:**

- Input area fixed at bottom of chat, `pb-safe-max-xs` applied for safe area.
- Text input accepts focus and text entry.
- Send button is disabled/dimmed when input is empty.
- Send button becomes enabled/active when text is entered.
- Image attach button is visible and tappable.
- Input area does not overlap message list.
- No horizontal overflow from input area.

**Screenshot checkpoint:** `s9-7-message-input.png`

---

### S9.8 — Send Message: Appears in Thread

**Goal:** Sending a message appends it to the thread as an own-message bubble.

**Steps:**

1. Navigate to `/chat/:conversationId`.
2. Count existing messages.
3. Type "Test message from audit" into the input.
4. Tap the send button.
5. Wait for the new message to appear.

**Selectors:**

- New message: last element with `bg-primary text-primary-foreground` styling
- Message text content: inner text node matching "Test message from audit"
- Input field: should be cleared after send

**Expected:**

- New message appears at the bottom of the message list.
- Message has own-message styling (`bg-primary`, right-aligned).
- Message text matches what was typed.
- Input field is cleared after send.
- Message list auto-scrolls to the new message.
- No duplicate messages.
- No loading spinner persists indefinitely.

**Screenshot checkpoint:** `s9-8-send-message.png`

---

### S9.9 — Thread: Back Button Returns to Inbox

**Goal:** Mobile back button navigates from thread back to conversation list.

**Steps:**

1. Navigate to `/chat/:conversationId` (or arrive via S9.5).
2. Locate the back button in the chat header.
3. Tap the back button.
4. Wait for transition.

**Selectors:**

- Back button: element with `lg:hidden` inside the chat header (mobile-only back arrow/button)
- Chat header: the top bar of the chat interface with `pt-safe-max-xs bg-background`

**Expected:**

- Back button is visible on mobile (`lg:hidden` — present below 1024px).
- After tap: URL returns to `/chat`.
- Chat interface hides, conversation list shows (reverse of S9.5).
- Conversation list state is preserved (same scroll position, active filter).
- No layout flash during transition.

**Screenshot checkpoint:** `s9-9-back-to-inbox.png`

---

### S9.10 — Messages Drawer: Quick Access from Global Header

**Goal:** Messages drawer opens from the global header and shows recent conversations.

**Steps:**

1. Navigate to any non-chat route (e.g., `/`).
2. Locate the messages icon in the global header.
3. Tap the messages icon.
4. Wait for the messages drawer to open.
5. Assert drawer content.

**Selectors:**

- Messages icon: button/icon in the global header that triggers the drawer
- Messages drawer: `MessagesDrawer` component (`components/mobile/drawers/messages-drawer.tsx`)
- Conversation items inside drawer: list of recent conversations

**Expected:**

- Messages icon/button is visible in the global header.
- Tapping opens the MessagesDrawer with slide-in animation.
- Drawer shows up to 5 most recent conversations.
- Each conversation shows avatar, name, last message preview.
- Unread indicator visible on conversations with unread messages.
- Tapping a conversation in the drawer navigates to `/chat/:conversationId`.
- Drawer can be dismissed (swipe down or tap outside).

**Screenshot checkpoint:** `s9-10-messages-drawer.png`

---

### S9.11 — Report/Block from Conversation

**Goal:** User can access report/block action from within a conversation.

**Steps:**

1. Navigate to `/chat/:conversationId`.
2. Locate the conversation action menu (kebab menu / three dots / header action).
3. Tap to open the menu.
4. Assert "Report" or "Block" option is present.
5. Tap "Report".
6. Assert report flow initiates (confirmation dialog or form).

**Selectors:**

- Action menu trigger: button in the chat header (likely an icon button)
- Menu items: dropdown/popover items
- Report option: menu item with "Report" text
- Confirmation dialog: alert dialog or modal

**Expected:**

- Action menu is accessible from the conversation header.
- Menu contains Report and/or Block options.
- Report action triggers `report-conversation.ts` server action.
- Confirmation step before finalizing (no accidental reports).
- Action menu does not overflow the viewport.
- Menu dismisses on outside tap.

**Screenshot checkpoint:** `s9-11-report-block.png`

---

### S9.12 — Empty Inbox: Onboarding/Empty State

**Goal:** When user has no conversations, an empty state is displayed.

**Steps:**

1. Log in as a user with zero conversations.
2. Navigate to `/chat`.
3. Wait for content to load (skeleton → empty state).

**Selectors:**

- Empty state container: element shown when conversation list is empty
- Illustration/icon: visual empty state indicator
- Message text: e.g., "No messages yet" or equivalent

**Expected:**

- Conversation list area shows an empty state — not a blank screen.
- Empty state includes a visual indicator (icon or illustration).
- Descriptive text explaining no conversations exist.
- Optionally: CTA to start browsing / find products.
- ChatBottomTabs still rendered (or hidden gracefully).
- No broken layout or collapsed container.

**Screenshot checkpoint:** `s9-12-empty-inbox.png`

---

### S9.13 — Safe Area Insets on Chat UI

**Goal:** All safe area insets are correctly applied across chat UI elements.

**Steps:**

1. Navigate to `/chat` on iPhone 12 (390×844).
2. Inspect conversation list header padding.
3. Inspect ChatBottomTabs bottom padding.
4. Tap into a conversation.
5. Inspect chat header top padding.
6. Inspect input area bottom padding.

**Selectors:**

- Conversation list header: element with `pt-safe-max-sm`
- Bottom tabs: element with `pb-safe`
- Chat header: element with `pt-safe-max-xs bg-background`
- Input area: element with `pb-safe-max-xs`

**Expected:**

- Conversation list header: `pt-safe-max-sm` resolved — top padding ≥ device safe area top inset.
- Bottom tabs: `pb-safe` resolved — bottom padding ≥ device safe area bottom inset.
- Chat header: `pt-safe-max-xs` resolved — top padding accounts for safe area on notched devices.
- Input area: `pb-safe-max-xs` resolved — input not occluded by home indicator.
- No content hidden behind notch or rounded corners.
- All safe area values compute to non-zero on notched devices.

**Screenshot checkpoint:** `s9-13-safe-area-insets.png`

---

## Known Bugs

_None identified at time of writing._

---

## Evidence Log (v2)

Fixed columns. Add one row per scenario run (or per sub-scenario if needed).

| Scenario | Method | Artifact | Result | Issue ID | Severity | Owner | Date |
|----------|--------|----------|--------|----------|----------|-------|------|
| S9.1 | code trace | Full-height shell in `chat/layout.tsx` and chat clients | Pass | — | — | Codex | 2026-02-11 |
| S9.2 | code trace | Conversation list rendering logic in `conversation-list.tsx` | Pass | — | — | Codex | 2026-02-11 |
| S9.3 | code trace | Unread indicators in list/drawer | Pass | — | — | Codex | 2026-02-11 |
| S9.4 | code trace | Bottom tabs/filter control in `messages-page-client.tsx` | Pass | — | — | Codex | 2026-02-11 |
| S9.5 | code trace | Thread navigation works, but in-thread seller/product links use non-canonical routes | Partial | CHAT-001 | P1 | Codex | 2026-02-11 |
| S9.6 | code trace | Message bubble styling and thread segmentation in `chat-interface.tsx` | Pass | — | — | Codex | 2026-02-11 |
| S9.7 | code trace | Image upload endpoint is wired, but send path calls `sendMessage(\"\", data.url)` while send hook requires non-empty content | Partial | CHAT-003 | P1 | Codex | 2026-02-11 |
| S9.8 | code trace | Send-message path and optimistic thread update wiring | Pass | — | — | Codex | 2026-02-11 |
| S9.9 | code trace | Back navigation logic in `messages-page-client.tsx` | Pass | — | — | Codex | 2026-02-11 |
| S9.10 | code trace | Header messages drawer integration and conversation links | Pass | — | — | Codex | 2026-02-11 |
| S9.11 | code trace | Report flow inserts notification for reporter (`user_id=userData.user.id`) instead of admin recipient | Fail | CHAT-002 | P1 | Codex | 2026-02-11 |
| S9.12 | code trace | Empty-state flows in drawer and messages list | Pass | — | — | Codex | 2026-02-11 |
| S9.13 | code trace | Safe-area classes and mobile container behavior | Pass | — | — | Codex | 2026-02-11 |

Method suggestions: `runtime` | `code trace` | `manual` (keep it consistent within a phase).


---

## Findings

| ID | Scenario | Severity | Description | Evidence |
|----|----------|----------|-------------|----------|
| CHAT-001 | S9.5 | P1 | In-thread links point to non-canonical paths (`/seller/:id`, `/product/:id`) that diverge from route conventions and can break deep-link expectations. | `app/[locale]/(chat)/_components/chat-interface.tsx:356`, `app/[locale]/(chat)/_components/chat-interface.tsx:372`, `app/[locale]/(chat)/_components/chat-interface.tsx:566` |
| CHAT-002 | S9.11 | P1 | Report conversation action is marked as admin report but currently stores notification for reporter account (`user_id: userData.user.id`) with placeholder comment. | `app/[locale]/(chat)/_actions/report-conversation.ts:59-64` |
| CHAT-003 | S9.7 | P1 | Image-send flow is internally inconsistent: upload handler calls `sendMessage(\"\", imageUrl)` while send action returns early when `content.trim()` is empty, causing silent image-send failure. | `app/[locale]/(chat)/_components/chat-interface.tsx:183`, `components/providers/messages/use-messages-actions.ts:79` |
| CHAT-I18N-003 | Cross-cutting | P2 | Extensive `locale === "bg" ? ... : ...` inline strings in `chat-interface.tsx` bypass `next-intl` keys and increase localization drift risk. | `app/[locale]/(chat)/_components/chat-interface.tsx` (multiple blocks, e.g. 210-260, 319-320, 588-610, 761) |

---

## Summary

| Metric | Value |
|--------|-------|
| Scenarios | 13 |
| Pass | 10 |
| Fail | 1 |
| Partial | 2 |
| Blocked | 0 |
| Not Run | 0 |
| Findings | 4 (P1:3, P2:1) |
| Status | ✅ Complete (code audit) |

---

*Generated for Treido mobile production audit. Phase 9 of 18.*
