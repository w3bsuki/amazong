import { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Facebook as FacebookLogo,
  Globe,
  Instagram as InstagramLogo,
  LoaderCircle as SpinnerGap,
  MapPin,
  Music2 as TiktokLogo,
  Bird as TwitterLogo,
  User,
} from "lucide-react"
import type { ProfileDataState } from "./public-profile-editor.types"

interface PublicProfileInfoCardProps {
  locale: string
  profileUsername: string | null
  isBusiness: boolean
  isPending: boolean
  profileData: ProfileDataState
  setProfileData: Dispatch<SetStateAction<ProfileDataState>>
  onSave: () => void
}

export function PublicProfileInfoCard({
  locale,
  profileUsername,
  isBusiness,
  isPending,
  profileData,
  setProfileData,
  onSave,
}: PublicProfileInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="size-5" />
          {locale === "bg" ? "Публична информация" : "Public Information"}
        </CardTitle>
        <CardDescription>
          {locale === "bg"
            ? "Тази информация се показва на публичния ти профил"
            : "This information is visible on your public profile"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{locale === "bg" ? "Показвано име" : "Display Name"}</Label>
          <Input
            value={profileData.display_name}
            onChange={(event) =>
              setProfileData((prev) => ({ ...prev, display_name: event.target.value }))
            }
            placeholder={profileUsername || (locale === "bg" ? "Твоето име" : "Your name")}
          />
          <p className="text-xs text-muted-foreground">
            {locale === "bg" ? "Показва се вместо @username" : "Shown instead of @username"}
          </p>
        </div>

        <div className="space-y-2">
          <Label>{locale === "bg" ? "Биография" : "Bio"}</Label>
          <Textarea
            value={profileData.bio}
            onChange={(event) => setProfileData((prev) => ({ ...prev, bio: event.target.value }))}
            placeholder={locale === "bg" ? "Разкажи нещо за себе си..." : "Tell us about yourself..."}
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">{profileData.bio.length}/500</p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {locale === "bg" ? "Локация" : "Location"}
          </Label>
          <Input
            value={profileData.location}
            onChange={(event) => setProfileData((prev) => ({ ...prev, location: event.target.value }))}
            placeholder={locale === "bg" ? "София, България" : "Sofia, Bulgaria"}
          />
        </div>

        <Separator />

        {isBusiness && (
          <>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Globe className="size-4" />
                {locale === "bg" ? "Уебсайт" : "Website"}
              </Label>
              <Input
                type="url"
                value={profileData.website_url}
                onChange={(event) =>
                  setProfileData((prev) => ({ ...prev, website_url: event.target.value }))
                }
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <FacebookLogo className="size-4" />
                  Facebook
                </Label>
                <Input
                  value={profileData.social_links.facebook}
                  onChange={(event) =>
                    setProfileData((prev) => ({
                      ...prev,
                      social_links: { ...prev.social_links, facebook: event.target.value },
                    }))
                  }
                  placeholder="facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <InstagramLogo className="size-4" />
                  Instagram
                </Label>
                <Input
                  value={profileData.social_links.instagram}
                  onChange={(event) =>
                    setProfileData((prev) => ({
                      ...prev,
                      social_links: { ...prev.social_links, instagram: event.target.value },
                    }))
                  }
                  placeholder="instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <TwitterLogo className="size-4" />
                  Twitter/X
                </Label>
                <Input
                  value={profileData.social_links.twitter}
                  onChange={(event) =>
                    setProfileData((prev) => ({
                      ...prev,
                      social_links: { ...prev.social_links, twitter: event.target.value },
                    }))
                  }
                  placeholder="x.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <TiktokLogo className="size-4" />
                  TikTok
                </Label>
                <Input
                  value={profileData.social_links.tiktok}
                  onChange={(event) =>
                    setProfileData((prev) => ({
                      ...prev,
                      social_links: { ...prev.social_links, tiktok: event.target.value },
                    }))
                  }
                  placeholder="tiktok.com/@..."
                />
              </div>
            </div>
          </>
        )}

        <Button onClick={onSave} disabled={isPending} className="w-full">
          {isPending && <SpinnerGap className="size-4 mr-2 animate-spin" />}
          {locale === "bg" ? "Запази промените" : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  )
}
