import { Link } from "@/i18n/routing"
import Image from "next/image"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

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
    <div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm py-0 gap-0">
        <CardHeader className="text-center pt-6 pb-4 px-6 gap-3">
          {showLogo && (
            <Link href="/" className="mx-auto hover:opacity-80 transition-opacity">
              <Image src="/icon.svg" width={40} height={40} alt="Treido" priority />
            </Link>
          )}
          <div className="space-y-1.5">
            <CardTitle className="text-xl">{title}</CardTitle>
            {description && (
              <CardDescription className="text-center">{description}</CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-4">{children}</CardContent>
        {footer && (
          <CardFooter className="flex-col gap-4 bg-muted/30 border-t py-4 px-6 rounded-b-md">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
