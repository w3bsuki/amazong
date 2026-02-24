import { Dispatch, SetStateAction } from "react"
import { useTranslations } from "next-intl"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Info, LoaderCircle as SpinnerGap, Store as Storefront, User } from "lucide-react"
import type { BusinessDataState, PublicProfileRecord } from "./public-profile-editor.types"

interface PublicProfileAccountTypeCardProps {
  locale: string
  profile: PublicProfileRecord
  isBusiness: boolean
  isPending: boolean
  businessDialogOpen: boolean
  setBusinessDialogOpen: (open: boolean) => void
  businessData: BusinessDataState
  setBusinessData: Dispatch<SetStateAction<BusinessDataState>>
  onUpgrade: () => void
  onDowngrade: () => void
}

export function PublicProfileAccountTypeCard({
  locale,
  profile,
  isBusiness,
  isPending,
  businessDialogOpen,
  setBusinessDialogOpen,
  businessData,
  setBusinessData,
  onUpgrade,
  onDowngrade,
}: PublicProfileAccountTypeCardProps) {
  const t = useTranslations("Account.profileEditor")
  void locale

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Storefront className="size-5" />
          {t("accountType.title")}
        </CardTitle>
        <CardDescription>
          {isBusiness ? t("accountType.businessDescription") : t("accountType.personalDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={isBusiness ? "default" : "secondary"} className="gap-1">
              {isBusiness ? <Storefront className="size-3" /> : <User className="size-3" />}
              {isBusiness ? t("accountType.businessLabel") : t("accountType.personalLabel")}
            </Badge>
            {isBusiness && profile.verified_business && (
              <Badge variant="outline" className="gap-1 text-info border-info/30 bg-info/10">
                <CheckCircle className="size-3" />
                {t("accountType.verified")}
              </Badge>
            )}
          </div>

          {isBusiness ? (
            <Button variant="outline" size="sm" onClick={onDowngrade} disabled={isPending}>
              {t("accountType.switchToPersonal")}
            </Button>
          ) : (
            <Dialog open={businessDialogOpen} onOpenChange={setBusinessDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Storefront className="size-4" />
                  {t("accountType.upgradeToBusiness")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("accountType.upgradeDialogTitle")}</DialogTitle>
                  <DialogDescription>{t("accountType.upgradeDialogDescription")}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{t("accountType.businessNameLabel")}</Label>
                    <Input
                      value={businessData.business_name}
                      onChange={(event) =>
                        setBusinessData((prev) => ({ ...prev, business_name: event.target.value }))
                      }
                      placeholder={t("accountType.businessNamePlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("accountType.vatNumberLabel")}</Label>
                    <Input
                      value={businessData.vat_number}
                      onChange={(event) => setBusinessData((prev) => ({ ...prev, vat_number: event.target.value }))}
                      placeholder="BG123456789"
                    />
                  </div>

                  <Alert>
                    <Info className="size-4" />
                    <AlertDescription className="text-xs">{t("accountType.profileInfoNotice")}</AlertDescription>
                  </Alert>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setBusinessDialogOpen(false)}>
                    {t("actions.cancel")}
                  </Button>
                  <Button onClick={onUpgrade} disabled={isPending || !businessData.business_name}>
                    {isPending && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                    {t("accountType.upgrade")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isBusiness && profile.business_name && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">{t("accountType.businessNameValueLabel")}</p>
            <p className="font-medium">{profile.business_name}</p>
            {profile.vat_number && (
              <>
                <p className="text-sm text-muted-foreground mt-2">{t("accountType.vatNumberValueLabel")}</p>
                <p className="font-medium">{profile.vat_number}</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
