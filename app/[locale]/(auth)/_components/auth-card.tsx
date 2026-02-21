import { Link } from "@/i18n/routing"

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  showLogo?: boolean
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  showLogo = true,
}: AuthCardProps) {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-6 pt-safe-max-sm pb-safe-max">
      <div className="w-full max-w-sm space-y-4">
        {showLogo ? (
          <Link
            href="/"
            className="mx-auto inline-flex min-h-11 items-center justify-center text-xl font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
            aria-label="Treido home"
          >
            treido.
          </Link>
        ) : null}

        <Card className="w-full py-0 gap-0 overflow-hidden">
          <CardHeader className="text-center pt-6 pb-4 px-5 gap-3">
            <div className="space-y-1.5">
              <h1 className="text-xl leading-none font-semibold">{title}</h1>
              {description ? (
                <p className="text-center text-muted-foreground text-sm">{description}</p>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">{children}</CardContent>
          {footer ? (
            <CardFooter className="flex-col gap-3 bg-surface-subtle border-t py-3 px-5">
              {footer}
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
