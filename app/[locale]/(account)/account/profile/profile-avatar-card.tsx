import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Camera, CircleX as XCircle, LoaderCircle as SpinnerGap, Trash } from "lucide-react"

interface ProfileAvatarCardProps {
  locale: string
  displayName: string
  role: string | null
  avatarPreview: string | null
  isUploadingAvatar: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDeleteAvatar: () => void
  onChoosePresetAvatar: (url: string) => void
  presetAvatars: readonly string[]
}

function AvatarImg({ src, alt, size, className }: { src: string; alt: string; size: number; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={className}
    />
  )
}

export function ProfileAvatarCard({
  locale,
  displayName,
  role,
  avatarPreview,
  isUploadingAvatar,
  fileInputRef,
  onAvatarChange,
  onDeleteAvatar,
  onChoosePresetAvatar,
  presetAvatars,
}: ProfileAvatarCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{locale === "bg" ? "Профилна снимка" : "Profile Picture"}</CardTitle>
        <CardDescription>
          {locale === "bg"
            ? "Качете снимка за вашия профил. Максимален размер: 5MB"
            : "Upload a picture for your profile. Max size: 5MB"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="size-24 rounded-full overflow-hidden border-2 border-muted">
              <UserAvatar
                name={displayName}
                avatarUrl={avatarPreview}
                className="size-24 bg-muted"
                fallbackClassName="bg-muted text-muted-foreground text-2xl font-bold"
              />
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-overlay-light flex items-center justify-center rounded-full">
                  <SpinnerGap className="size-6 animate-spin" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-1 -right-1 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-interactive-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={locale === "bg" ? "Качи нова профилна снимка" : "Upload new profile picture"}
            >
              <Camera className="size-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onAvatarChange}
              className="hidden"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
            {avatarPreview && (
              <Button variant="outline" size="sm" onClick={onDeleteAvatar} disabled={isUploadingAvatar}>
                <Trash className="size-4 mr-1.5" />
                {locale === "bg" ? "Нулирай" : "Reset"}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium">{locale === "bg" ? "Избери аватар" : "Choose an avatar"}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {locale === "bg" ? "Бърз избор без качване" : "Quick pick without uploading"}
          </p>

          <div className="mt-3 grid grid-cols-4 sm:grid-cols-8 gap-2">
            {presetAvatars.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => onChoosePresetAvatar(url)}
                disabled={isUploadingAvatar}
                className="size-10 rounded-full overflow-hidden border bg-muted hover:bg-hover active:bg-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                aria-label={locale === "bg" ? "Избери този аватар" : "Choose this avatar"}
              >
                {url.startsWith("boring-avatar:") ? (
                  <UserAvatar
                    name={displayName}
                    avatarUrl={url}
                    size="sm"
                    className="size-full"
                    fallbackClassName="bg-muted text-muted-foreground text-xs font-bold"
                  />
                ) : (
                  <AvatarImg src={url} alt="" size={40} className="size-full object-cover" />
                )}
              </button>
            ))}
          </div>
        </div>

        {avatarPreview && !avatarPreview.startsWith("boring-avatar:") && (
          <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
            <XCircle className="size-3.5" />
            <span>{locale === "bg" ? "Можеш да избереш и генериран аватар" : "You can switch to a generated avatar anytime"}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
