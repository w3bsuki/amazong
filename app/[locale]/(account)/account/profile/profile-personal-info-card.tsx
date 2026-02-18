import { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/shared/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, LoaderCircle as SpinnerGap, MapPin, Phone, User } from "lucide-react"
import type { ProfileDataState, ShippingRegionOption } from "./profile-account.types"

interface ProfilePersonalInfoCardProps {
  locale: string
  profileData: ProfileDataState
  setProfileData: Dispatch<SetStateAction<ProfileDataState>>
  shippingRegions: ShippingRegionOption[]
  isPending: boolean
  onSubmit: (event: React.FormEvent) => void
}

export function ProfilePersonalInfoCard({
  locale,
  profileData,
  setProfileData,
  shippingRegions,
  isPending,
  onSubmit,
}: ProfilePersonalInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{locale === "bg" ? "Лична информация" : "Personal Information"}</CardTitle>
        <CardDescription>
          {locale === "bg" ? "Актуализирайте информацията за вашия профил" : "Update your profile information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldContent>
                <FieldLabel htmlFor="full_name">
                  <User className="size-4 inline mr-1.5" />
                  {locale === "bg" ? "Име" : "Full Name"}
                </FieldLabel>
                <Input
                  id="full_name"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={(event) =>
                    setProfileData((prev) => ({
                      ...prev,
                      full_name: event.target.value,
                    }))
                  }
                  placeholder={locale === "bg" ? "Вашето име" : "Your name"}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldContent>
                <FieldLabel htmlFor="phone">
                  <Phone className="size-4 inline mr-1.5" />
                  {locale === "bg" ? "Телефон" : "Phone"}
                </FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(event) =>
                    setProfileData((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  placeholder="+359 888 123 456"
                />
              </FieldContent>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldContent>
                <FieldLabel htmlFor="shipping_region">
                  <MapPin className="size-4 inline mr-1.5" />
                  {locale === "bg" ? "Регион за доставка" : "Shipping Region"}
                </FieldLabel>
                <Select
                  value={profileData.shipping_region}
                  onValueChange={(value) =>
                    setProfileData((prev) => ({ ...prev, shipping_region: value }))
                  }
                >
                  <SelectTrigger id="shipping_region">
                    <SelectValue
                      placeholder={locale === "bg" ? "Изберете регион" : "Select region"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingRegions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {locale === "bg" ? region.labelBg : region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
            <Field>
              <FieldContent>
                <FieldLabel htmlFor="country_code">
                  <Globe className="size-4 inline mr-1.5" />
                  {locale === "bg" ? "Държава" : "Country Code"}
                </FieldLabel>
                <Input
                  id="country_code"
                  name="country_code"
                  value={profileData.country_code}
                  onChange={(event) =>
                    setProfileData((prev) => ({
                      ...prev,
                      country_code: event.target.value.toUpperCase().slice(0, 2),
                    }))
                  }
                  placeholder="BG"
                  maxLength={2}
                />
              </FieldContent>
            </Field>
          </div>

          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? (
              <>
                <SpinnerGap className="size-4 mr-2 animate-spin" />
                {locale === "bg" ? "Запазване..." : "Saving..."}
              </>
            ) : (
              locale === "bg" ? "Запази промените" : "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
