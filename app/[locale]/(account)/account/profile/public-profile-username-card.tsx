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
  isCheckingUsername,
  canChangeUsername,
  daysUntilChange,
  isPending,
  onCheckUsername,
  onSubmitUsername,
}: PublicProfileUsernameCardProps) {
  return (
    <>
      {username && (
        <Card className="bg-hover border-selected-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {locale === "bg" ? "Твоят публичен профил" : "Your Public Profile"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">treido.eu/{username}</p>
              </div>
              <Link href={`/${username}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  {locale === "bg" ? "Виж профила" : "View Profile"}
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
            {locale === "bg" ? "Потребителско име" : "Username"}
          </CardTitle>
          <CardDescription>
            {locale === "bg"
              ? "Уникалният ти идентификатор за URL и споменаване"
              : "Your unique identifier for URLs and mentions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-lg font-medium">
                <span className="text-muted-foreground">@</span>
                {username || (
                  <span className="text-muted-foreground italic">
                    {locale === "bg" ? "Не е зададено" : "Not set"}
                  </span>
                )}
              </div>
              {username && <p className="text-xs text-muted-foreground mt-1">treido.eu/u/{username}</p>}
            </div>

            <Dialog open={usernameDialogOpen} onOpenChange={setUsernameDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!canChangeUsername && !!username}>
                  <PencilSimple className="size-4 mr-1.5" />
                  {username
                    ? locale === "bg"
                      ? "Промени"
                      : "Change"
                    : locale === "bg"
                      ? "Задай"
                      : "Set"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {username
                      ? locale === "bg"
                        ? "Промени потребителско име"
                        : "Change Username"
                      : locale === "bg"
                        ? "Избери потребителско име"
                        : "Choose Username"}
                  </DialogTitle>
                  <DialogDescription>
                    {locale === "bg"
                      ? "Потребителското име може да се променя веднъж на 14 дни"
                      : "Username can be changed once every 14 days"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{locale === "bg" ? "Ново потребителско име" : "New Username"}</Label>
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
                      <p className="text-xs text-destructive">
                        {locale === "bg" ? "Това име е заето" : "This username is taken"}
                      </p>
                    )}
                    {newUsername && newUsername.length >= 3 && usernameAvailable === true && (
                      <p className="text-xs text-muted-foreground">treido.eu/u/{newUsername}</p>
                    )}
                  </div>

                  <Alert>
                    <Info className="size-4" />
                    <AlertDescription className="text-xs">
                      {locale === "bg"
                        ? "Правила: 3-30 символа, само малки букви, цифри и долна черта"
                        : "Rules: 3-30 chars, lowercase letters, numbers, and underscores only"}
                    </AlertDescription>
                  </Alert>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setUsernameDialogOpen(false)}>
                    {locale === "bg" ? "Отказ" : "Cancel"}
                  </Button>
                  <Button
                    onClick={onSubmitUsername}
                    disabled={isPending || !usernameAvailable || !newUsername || newUsername === username}
                  >
                    {isPending && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                    {locale === "bg" ? "Запази" : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {!canChangeUsername && daysUntilChange && (
            <p className="text-xs text-muted-foreground mt-2">
              {locale === "bg"
                ? `Можеш да промениш след ${daysUntilChange} дни`
                : `Can change again in ${daysUntilChange} days`}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
