import { Dispatch, SetStateAction } from "react"
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Storefront className="size-5" />
          {locale === "bg" ? "Тип акаунт" : "Account Type"}
        </CardTitle>
        <CardDescription>
          {isBusiness
            ? locale === "bg"
              ? "Бизнес акаунт с разширени функции"
              : "Business account with extended features"
            : locale === "bg"
              ? "Личен акаунт"
              : "Personal account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={isBusiness ? "default" : "secondary"} className="gap-1">
              {isBusiness ? <Storefront className="size-3" /> : <User className="size-3" />}
              {isBusiness
                ? locale === "bg"
                  ? "Бизнес"
                  : "Business"
                : locale === "bg"
                  ? "Личен"
                  : "Personal"}
            </Badge>
            {isBusiness && profile.verified_business && (
              <Badge variant="outline" className="gap-1 text-info border-info/30 bg-info/10">
                <CheckCircle className="size-3" />
                {locale === "bg" ? "Верифициран" : "Verified"}
              </Badge>
            )}
          </div>

          {isBusiness ? (
            <Button variant="outline" size="sm" onClick={onDowngrade} disabled={isPending}>
              {locale === "bg" ? "Върни към личен" : "Switch to Personal"}
            </Button>
          ) : (
            <Dialog open={businessDialogOpen} onOpenChange={setBusinessDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Storefront className="size-4" />
                  {locale === "bg" ? "Надгради до бизнес" : "Upgrade to Business"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {locale === "bg"
                      ? "Надгради до бизнес акаунт"
                      : "Upgrade to Business Account"}
                  </DialogTitle>
                  <DialogDescription>
                    {locale === "bg"
                      ? "Бизнес акаунтите имат допълнителни функции"
                      : "Business accounts have additional features"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{locale === "bg" ? "Име на бизнеса *" : "Business Name *"}</Label>
                    <Input
                      value={businessData.business_name}
                      onChange={(event) =>
                        setBusinessData((prev) => ({ ...prev, business_name: event.target.value }))
                      }
                      placeholder={locale === "bg" ? "Вашият бизнес" : "Your Business"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      {locale === "bg" ? "ДДС номер (по желание)" : "VAT Number (optional)"}
                    </Label>
                    <Input
                      value={businessData.vat_number}
                      onChange={(event) =>
                        setBusinessData((prev) => ({ ...prev, vat_number: event.target.value }))
                      }
                      placeholder="BG123456789"
                    />
                  </div>

                  <Alert>
                    <Info className="size-4" />
                    <AlertDescription className="text-xs">
                      {locale === "bg"
                        ? "Бизнес акаунтите показват допълнителна информация на профила - социални мрежи, уебсайт и др."
                        : "Business accounts display additional profile info - social links, website, etc."}
                    </AlertDescription>
                  </Alert>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setBusinessDialogOpen(false)}>
                    {locale === "bg" ? "Отказ" : "Cancel"}
                  </Button>
                  <Button onClick={onUpgrade} disabled={isPending || !businessData.business_name}>
                    {isPending && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                    {locale === "bg" ? "Надгради" : "Upgrade"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isBusiness && profile.business_name && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {locale === "bg" ? "Име на бизнеса" : "Business Name"}
            </p>
            <p className="font-medium">{profile.business_name}</p>
            {profile.vat_number && (
              <>
                <p className="text-sm text-muted-foreground mt-2">
                  {locale === "bg" ? "ДДС номер" : "VAT Number"}
                </p>
                <p className="font-medium">{profile.vat_number}</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
