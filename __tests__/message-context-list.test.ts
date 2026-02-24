import { describe, expect, it, vi } from "vitest"

import type { Conversation, Message } from "@/lib/types/messages"
import {
  addMessageOptimistic,
  incrementUnreadCount,
  markMessagesAsReadInState,
  resetUnreadCount,
  updateConversationLastMessage,
} from "@/components/providers/message-context-list"

function createConversation(overrides: Partial<Conversation> = {}): Conversation {
  return {
    id: "conv-1",
    buyer_id: "buyer-1",
    seller_id: "seller-1",
    product_id: null,
    order_id: null,
    subject: null,
    status: "open",
    last_message_at: "2026-01-01T00:00:00.000Z",
    buyer_unread_count: 0,
    seller_unread_count: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    buyer_profile: null,
    seller_profile: null,
    product: null,
    ...overrides,
  }
}

function createMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: "msg-1",
    conversation_id: "conv-1",
    sender_id: "seller-1",
    content: "Hello",
    message_type: "text",
    is_read: false,
    read_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
}

describe("message-context-list helpers", () => {
  it("adds a unique optimistic message", () => {
    const next = addMessageOptimistic([createMessage()], createMessage({ id: "msg-2" }))
    expect(next).toHaveLength(2)
    expect(next.map((m) => m.id)).toEqual(["msg-1", "msg-2"])
  })

  it("skips duplicate optimistic message ids", () => {
    const base = [createMessage({ id: "dup-1" })]
    const next = addMessageOptimistic(base, createMessage({ id: "dup-1" }))
    expect(next).toEqual(base)
  })

  it("marks only matching unread messages as read", () => {
    const now = new Date("2026-02-01T00:00:00.000Z")
    vi.useFakeTimers()
    vi.setSystemTime(now)

    const next = markMessagesAsReadInState(
      [
        createMessage({ id: "a", conversation_id: "conv-1", is_read: false }),
        createMessage({ id: "b", conversation_id: "conv-1", is_read: true, read_at: "2026-01-01T00:00:00.000Z" }),
        createMessage({ id: "c", conversation_id: "conv-2", is_read: false }),
      ],
      "conv-1"
    )

    expect(next[0]?.is_read).toBe(true)
    expect(next[0]?.read_at).toBe("2026-02-01T00:00:00.000Z")
    expect(next[1]?.read_at).toBe("2026-01-01T00:00:00.000Z")
    expect(next[2]?.is_read).toBe(false)

    vi.useRealTimers()
  })

  it("resets buyer unread count when current user is buyer", () => {
    const next = resetUnreadCount(
      [createConversation({ id: "conv-1", buyer_unread_count: 4 })],
      "conv-1",
      "buyer-1"
    )
    expect(next[0]?.buyer_unread_count).toBe(0)
  })

  it("resets seller unread count when current user is seller", () => {
    const next = resetUnreadCount(
      [createConversation({ id: "conv-1", seller_unread_count: 3 })],
      "conv-1",
      "seller-1"
    )
    expect(next[0]?.seller_unread_count).toBe(0)
  })

  it("leaves non-target conversations unchanged in unread reset", () => {
    const other = createConversation({ id: "conv-2", buyer_unread_count: 2 })
    const next = resetUnreadCount([createConversation(), other], "conv-1", "buyer-1")
    expect(next[1]).toEqual(other)
  })

  it("updates last message and sorts by freshness", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-02-10T10:00:00.000Z"))

    const next = updateConversationLastMessage(
      [
        createConversation({ id: "old", last_message_at: "2026-02-09T10:00:00.000Z" }),
        createConversation({ id: "target", last_message_at: "2026-02-08T10:00:00.000Z" }),
      ],
      "target",
      "Updated",
      "seller-1"
    )

    expect(next[0]?.id).toBe("target")
    expect(next[0]?.last_message?.content).toBe("Updated")
    expect(next[0]?.last_message?.sender_id).toBe("seller-1")
    vi.useRealTimers()
  })

  it("increments buyer unread count when current user is buyer", () => {
    const next = incrementUnreadCount(
      [createConversation({ id: "conv-1", buyer_unread_count: 1 })],
      "conv-1",
      "buyer-1",
      {
        content: "new",
        sender_id: "seller-1",
        message_type: "text",
        created_at: "2026-02-01T00:00:00.000Z",
      }
    )

    expect(next[0]?.buyer_unread_count).toBe(2)
    expect(next[0]?.seller_unread_count).toBe(0)
  })

  it("increments seller unread count when current user is seller", () => {
    const next = incrementUnreadCount(
      [createConversation({ id: "conv-1", seller_unread_count: 2 })],
      "conv-1",
      "seller-1",
      {
        content: "new",
        sender_id: "buyer-1",
        message_type: "text",
        created_at: "2026-02-01T00:00:00.000Z",
      }
    )

    expect(next[0]?.seller_unread_count).toBe(3)
    expect(next[0]?.buyer_unread_count).toBe(0)
  })

  it("keeps non-target conversations untouched when incrementing unread", () => {
    const untouched = createConversation({ id: "conv-2", seller_unread_count: 5 })
    const next = incrementUnreadCount(
      [createConversation({ id: "conv-1" }), untouched],
      "conv-1",
      "seller-1",
      {
        content: "new",
        sender_id: "buyer-1",
        message_type: "text",
        created_at: "2026-02-01T00:00:00.000Z",
      }
    )

    expect(next.find((c) => c.id === "conv-2")).toEqual(untouched)
  })
})
