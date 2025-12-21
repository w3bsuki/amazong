import { useContext } from "react";

import {
  LocalAttachmentsContext,
  ProviderAttachmentsContext,
} from "@/components/providers/prompt-input-context";

export function usePromptInputAttachments() {
  // Dual-mode: prefer provider if present, otherwise use local
  const provider = useContext(ProviderAttachmentsContext);
  const local = useContext(LocalAttachmentsContext);
  const context = provider ?? local;

  if (!context) {
    throw new Error(
      "usePromptInputAttachments must be used within a PromptInput or PromptInputProvider"
    );
  }

  return context;
}
