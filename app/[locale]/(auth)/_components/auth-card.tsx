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
    <div className="min-h-dvh flex items-start sm:items-center justify-center px-3 py-4 pt-safe-max-sm pb-safe-max sm:px-4">
      <Card className="w-full max-w-sm py-0 gap-0 overflow-hidden">
        <CardHeader className="text-center pt-6 pb-4 px-5 gap-3">
          {showLogo && (
            <Link
              href="/"
              className="mx-auto inline-flex min-h-11 items-center text-lg font-extrabold tracking-tight text-foreground hover:text-primary transition-colors"
              aria-label="Treido home"
            >
              treido.
            </Link>
          )}
          <div className="space-y-1.5">
            <h1 className="text-xl leading-none font-semibold">{title}</h1>
            {description && (
              <p className="text-center text-muted-foreground text-sm">{description}</p>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">{children}</CardContent>
        {footer && (
          <CardFooter className="flex-col gap-3 bg-surface-subtle border-t py-3 px-5">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
