import { ChatInterfaceSkeleton } from "../../_components/chat-skeleton"

/**
 * Loading state for conversation page
 * Shows while server component fetches auth/conversation data
 */
export default function ConversationLoading() {
  return <ChatInterfaceSkeleton />
}
