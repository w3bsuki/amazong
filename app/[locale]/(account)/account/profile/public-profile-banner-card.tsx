import { useTranslations } from "next-intl"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Image as ImageIcon, LoaderCircle as SpinnerGap } from "lucide-react"

interface PublicProfileBannerCardProps {
  locale: string
  bannerPreview: string | null
  isUploadingBanner: boolean
  bannerInputRef: React.RefObject<HTMLInputElement | null>
  onBannerChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function PublicProfileBannerCard({
  locale,
  bannerPreview,
  isUploadingBanner,
  bannerInputRef,
  onBannerChange,
}: PublicProfileBannerCardProps) {
  const t = useTranslations("Account.profileEditor")
  void locale

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ImageIcon className="size-5" />
          {t("banner.title")}
        </CardTitle>
        <CardDescription>{t("banner.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="relative h-32 rounded-lg bg-muted overflow-hidden cursor-pointer group"
          onClick={() => bannerInputRef.current?.click()}
        >
          {bannerPreview ? (
            <Image src={bannerPreview} alt={t("banner.alt")} fill sizes="100vw" className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="size-8 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-surface-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isUploadingBanner ? (
              <SpinnerGap className="size-6 text-overlay-text animate-spin" />
            ) : (
              <Camera className="size-6 text-overlay-text" />
            )}
          </div>
        </div>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onBannerChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
