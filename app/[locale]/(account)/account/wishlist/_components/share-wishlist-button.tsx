"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { Copy, Link as LinkIcon, SpinnerGap, XCircle } from "@/lib/icons/phosphor"

interface ShareWishlistButtonProps {
  locale: string
  disabled?: boolean
  initialShareToken: string | null
  initialIsPublic: boolean
}

export function ShareWishlistButton({
  locale,
  disabled,
  initialShareToken,
  initialIsPublic,
}: ShareWishlistButtonProps) {
  const t = useTranslations("Wishlist")
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shareToken, setShareToken] = useState<string | null>(initialShareToken)
  const [isPublic, setIsPublic] = useState<boolean>(initialIsPublic)

  const shareUrl = useMemo(() => {
    if (!shareToken) return ""
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    return `${origin}/${locale}/wishlist/${shareToken}`
  }, [locale, shareToken])

  async function enableSharing() {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc("enable_wishlist_sharing")
      if (error || !data || data.length === 0) {
        toast.error(locale === "bg" ? "Неуспешно споделяне" : "Failed to enable sharing")
        return
      }
      const token = data[0]?.share_token as string | undefined
      if (!token) {
        toast.error(locale === "bg" ? "Неуспешно споделяне" : "Failed to enable sharing")
        return
      }
      setShareToken(token)
      setIsPublic(true)
      setOpen(true)
      toast.success(t("sharingEnabled"))
    } catch {
      toast.error(locale === "bg" ? "Възникна грешка" : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  async function disableSharing() {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.rpc("disable_wishlist_sharing")
      if (error) {
        toast.error(locale === "bg" ? "Неуспешно спиране" : "Failed to stop sharing")
        return
      }
      setShareToken(null)
      setIsPublic(false)
      setOpen(false)
      toast.success(t("stopSharing"))
    } catch {
      toast.error(locale === "bg" ? "Възникна грешка" : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  function copyLink() {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    toast.success(t("linkCopied"))
  }

  return (
    <>
      <Button
        variant={isPublic ? "secondary" : "outline"}
        size="sm"
        onClick={() => {
          if (disabled) return
          if (!isPublic) {
            enableSharing()
          } else {
            setOpen(true)
          }
        }}
        disabled={disabled || isLoading}
        className="gap-2"
      >
        {isLoading ? <SpinnerGap className="size-4 animate-spin" /> : <LinkIcon className="size-4" />}
        {t("shareWishlist")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("shareWishlist")}</DialogTitle>
            <DialogDescription>
              {locale === "bg"
                ? "Копирайте линка и го изпратете на приятели."
                : "Copy the link and share it with friends."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="shareLink">{locale === "bg" ? "Линк" : "Link"}</Label>
            <div className="flex gap-2">
              <Input id="shareLink" readOnly value={shareUrl} />
              <Button type="button" variant="outline" onClick={copyLink} disabled={!shareUrl}>
                <Copy className="size-4" />
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {locale === "bg" ? "Затвори" : "Close"}
            </Button>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={disableSharing}
              disabled={isLoading}
            >
              <XCircle className="size-4 mr-2" />
              {t("stopSharing")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
