import { useContext } from "react";

import { ProviderAttachmentsContext } from "@/components/providers/prompt-input-context";

export function useProviderAttachments() {
  const ctx = useContext(ProviderAttachmentsContext);
  if (!ctx) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use useProviderAttachments()."
    );
  }
  return ctx;
}
