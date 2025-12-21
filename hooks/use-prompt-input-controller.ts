import { useContext } from "react";

import { PromptInputController } from "@/components/providers/prompt-input-context";

export function usePromptInputController() {
  const ctx = useContext(PromptInputController);
  if (!ctx) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use usePromptInputController()."
    );
  }
  return ctx;
}
