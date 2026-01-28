import { Link } from "@/i18n/routing"
import Image from "next/image"

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
    <div className="min-h-dvh flex items-center justify-center p-4">
      <Card className="w-full max-w-sm py-0 gap-0">
        <CardHeader className="text-center pt-6 pb-4 px-6 gap-3">
          {showLogo && (
            <Link href="/" className="mx-auto hover:opacity-80 transition-opacity">
              <Image src="/icon.svg" width={40} height={40} alt="Treido" priority />
            </Link>
          )}
          <div className="space-y-1.5">
            <h1 className="text-xl leading-none font-semibold">{title}</h1>
            {description && (
              <p className="text-center text-muted-foreground text-sm">{description}</p>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-4">{children}</CardContent>
        {footer && (
          <CardFooter className="flex-col gap-4 bg-surface-subtle border-t py-4 px-6 rounded-b-md">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
