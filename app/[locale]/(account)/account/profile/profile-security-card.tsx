import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Key, Mail as Envelope } from "lucide-react"

interface ProfileSecurityCardProps {
  locale: string
  email: string | null
  onOpenEmail: () => void
  onOpenPassword: () => void
}

export function ProfileSecurityCard({ locale, email, onOpenEmail, onOpenPassword }: ProfileSecurityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{locale === "bg" ? "Сигурност" : "Security"}</CardTitle>
        <CardDescription>
          {locale === "bg" ? "Управлявайте имейла и паролата на акаунта" : "Manage your account email and password"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <button
          type="button"
          onClick={onOpenEmail}
          className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-hover active:bg-active text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Envelope className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{locale === "bg" ? "Имейл" : "Email"}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-success">
            <CheckCircle className="size-3.5" />
            <span className="hidden sm:inline">{locale === "bg" ? "Потвърден" : "Verified"}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenPassword}
          className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-hover active:bg-active text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Key className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{locale === "bg" ? "Парола" : "Password"}</p>
            <p className="text-xs text-muted-foreground">••••••••</p>
          </div>
          <span className="text-xs text-muted-foreground">{locale === "bg" ? "Промени" : "Change"}</span>
        </button>
      </CardContent>
    </Card>
  )
}
