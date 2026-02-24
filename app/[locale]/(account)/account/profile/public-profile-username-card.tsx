import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowRight,
  AtSign as At,
  CircleCheck as CheckCircle,
  Info,
  Pencil as PencilSimple,
  LoaderCircle as SpinnerGap,
} from "lucide-react"

interface PublicProfileUsernameCardProps {
  locale: string
  username: string | null
  usernameDialogOpen: boolean
  setUsernameDialogOpen: (open: boolean) => void
  newUsername: string
  setNewUsername: (value: string) => void
  usernameAvailable: boolean | null
  usernameStatusMessage?: string | null
  isCheckingUsername: boolean
  canChangeUsername: boolean
  daysUntilChange?: number | undefined
  isPending: boolean
  onCheckUsername: (username: string) => void
  onSubmitUsername: () => void
}

export function PublicProfileUsernameCard({
  locale,
  username,
  usernameDialogOpen,
  setUsernameDialogOpen,
  newUsername,
  setNewUsername,
  usernameAvailable,
  usernameStatusMessage,
  isCheckingUsername,
  canChangeUsername,
  daysUntilChange,
  isPending,
  onCheckUsername,
  onSubmitUsername,
}: PublicProfileUsernameCardProps) {
  const t = useTranslations("Account.profileEditor")
  void locale

  return (
    <>
      {username && (
        <Card className="bg-hover border-selected-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("username.yourPublicProfile")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">treido.eu/{username}</p>
              </div>
              <Link href={`/${username}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  {t("username.viewProfile")}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <At className="size-5" />
            {t("username.title")}
          </CardTitle>
          <CardDescription>{t("username.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-lg font-medium">
                <span className="text-muted-foreground">@</span>
                {username || <span className="text-muted-foreground italic">{t("username.notSet")}</span>}
              </div>
              {username && <p className="text-xs text-muted-foreground mt-1">treido.eu/u/{username}</p>}
            </div>

            <Dialog open={usernameDialogOpen} onOpenChange={setUsernameDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!canChangeUsername && !!username}>
                  <PencilSimple className="size-4 mr-1.5" />
                  {username ? t("actions.change") : t("username.set")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{username ? t("username.changeTitle") : t("username.chooseTitle")}</DialogTitle>
                  <DialogDescription>{t("username.changeRule")}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{t("username.newLabel")}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                      <Input
                        value={newUsername}
                        onChange={(event) => {
                          const value = event.target.value.toLowerCase().replaceAll(/[^a-z0-9_]/g, "")
                          setNewUsername(value)
                          onCheckUsername(value)
                        }}
                        placeholder="your_username"
                        className="pl-7"
                      />
                      {isCheckingUsername && (
                        <SpinnerGap className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin" />
                      )}
                      {!isCheckingUsername && usernameAvailable === true && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-success" />
                      )}
                    </div>
                    {usernameAvailable === false && (
                      <p className="text-xs text-destructive">{usernameStatusMessage || t("username.taken")}</p>
                    )}
                    {newUsername && newUsername.length >= 3 && usernameAvailable === true && (
                      <p className="text-xs text-muted-foreground">treido.eu/u/{newUsername}</p>
                    )}
                  </div>

                  <Alert>
                    <Info className="size-4" />
                    <AlertDescription className="text-xs">{t("username.rules")}</AlertDescription>
                  </Alert>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setUsernameDialogOpen(false)}>
                    {t("actions.cancel")}
                  </Button>
                  <Button
                    onClick={onSubmitUsername}
                    disabled={isPending || !usernameAvailable || !newUsername || newUsername === username}
                  >
                    {isPending && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                    {t("actions.save")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {!canChangeUsername && daysUntilChange && (
            <p className="text-xs text-muted-foreground mt-2">{t("username.changeInDays", { days: daysUntilChange })}</p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
