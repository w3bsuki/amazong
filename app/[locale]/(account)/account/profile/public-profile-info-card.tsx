import { Dispatch, SetStateAction } from "react"
import { useTranslations } from "next-intl"
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
  const t = useTranslations("Account.profileEditor")
  void locale

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="size-5" />
          {t("publicInfo.title")}
        </CardTitle>
        <CardDescription>{t("publicInfo.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("publicInfo.displayNameLabel")}</Label>
          <Input
            value={profileData.display_name}
            onChange={(event) => setProfileData((prev) => ({ ...prev, display_name: event.target.value }))}
            placeholder={profileUsername || t("publicInfo.displayNamePlaceholder")}
          />
          <p className="text-xs text-muted-foreground">{t("publicInfo.displayNameHelp")}</p>
        </div>

        <div className="space-y-2">
          <Label>{t("publicInfo.bioLabel")}</Label>
          <Textarea
            value={profileData.bio}
            onChange={(event) => setProfileData((prev) => ({ ...prev, bio: event.target.value }))}
            placeholder={t("publicInfo.bioPlaceholder")}
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">{profileData.bio.length}/500</p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {t("publicInfo.locationLabel")}
          </Label>
          <Input
            value={profileData.location}
            onChange={(event) => setProfileData((prev) => ({ ...prev, location: event.target.value }))}
            placeholder={t("publicInfo.locationPlaceholder")}
          />
        </div>

        <Separator />

        {isBusiness && (
          <>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Globe className="size-4" />
                {t("publicInfo.websiteLabel")}
              </Label>
              <Input
                type="url"
                value={profileData.website_url}
                onChange={(event) => setProfileData((prev) => ({ ...prev, website_url: event.target.value }))}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <FacebookLogo className="size-4" />
                  {t("publicInfo.socialFacebook")}
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
                  {t("publicInfo.socialInstagram")}
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
                  {t("publicInfo.socialTwitter")}
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
                  {t("publicInfo.socialTiktok")}
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
          {t("actions.save")}
        </Button>
      </CardContent>
    </Card>
  )
}
