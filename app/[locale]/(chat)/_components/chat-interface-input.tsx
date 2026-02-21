import { LoaderCircle as CircleNotch, Image as ImageIcon, Send as PaperPlaneTilt } from "lucide-react"
import type { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

type Translator = ReturnType<typeof useTranslations>

export function ChatInterfaceInput({
  t,
  isClosed,
  error,
  inputRef,
  fileInputRef,
  inputValue,
  onInputChange,
  onKeyDown,
  onSend,
  onImageUpload,
  isSending,
  isUploadingImage,
}: {
  t: Translator
  isClosed: boolean
  error: string | null
  inputRef: React.RefObject<HTMLTextAreaElement | null>
  fileInputRef: React.RefObject<HTMLInputElement | null>
  inputValue: string
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (event: React.KeyboardEvent) => void
  onSend: () => void
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  isSending: boolean
  isUploadingImage: boolean
}) {
  return (
    <div className="sticky bottom-0 z-10 shrink-0 border-t border-border-subtle bg-background px-inset py-2 pb-safe-max-xs">
      {isClosed ? (
        <div className="flex items-center justify-center rounded-full bg-muted px-4 py-2">
          <p className="text-sm text-muted-foreground">{t("conversationClosed")}</p>
        </div>
      ) : (
        <div className="flex items-end gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingImage || isSending}
            aria-label={t("attachImage")}
            className="flex size-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-hover active:bg-active disabled:opacity-50"
          >
            {isUploadingImage ? (
              <CircleNotch size={22} className="animate-spin text-primary motion-reduce:animate-none" />
            ) : (
              <ImageIcon size={22} className="text-primary" />
            )}
          </button>

          <div className="flex min-h-11 flex-1 items-end gap-2 rounded-full bg-surface-subtle px-3 py-2 ring-1 ring-border transition-shadow focus-within:ring-2 focus-within:ring-ring">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder={t("typeMessage")}
              disabled={isSending || isUploadingImage}
              rows={1}
              className="no-focus-ring min-h-5 max-h-24 flex-1 resize-none bg-transparent py-0 text-base leading-5 placeholder:text-muted-foreground outline-none"
            />
          </div>

          <button
            type="button"
            onClick={onSend}
            disabled={isSending || isUploadingImage || !inputValue.trim()}
            aria-label={t("send")}
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50",
              inputValue.trim()
                ? "bg-primary text-primary-foreground hover:bg-interactive-hover"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isSending ? (
              <CircleNotch size={18} className="animate-spin motion-reduce:animate-none" />
            ) : (
              <PaperPlaneTilt size={18} />
            )}
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-center text-xs text-destructive">{error}</p>}
    </div>
  )
}

