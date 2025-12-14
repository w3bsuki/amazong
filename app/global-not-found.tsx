import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MagnifyingGlass, House, ArrowLeft } from "@phosphor-icons/react"

/**
 * Global Not Found Page
 * 
 * This page is shown for any unmatched routes across the entire application.
 * It handles 404 errors at the root level.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
          <div className="mx-auto max-w-md text-center">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="relative mx-auto h-40 w-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl font-bold text-muted-foreground/20">
                    404
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MagnifyingGlass className="h-20 w-20 text-primary/60" weight="duotone" />
                </div>
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight">
              Page Not Found
            </h1>
            <p className="mb-6 text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Let&apos;s get you back on track.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="default">
                <Link href="/">
                  <House className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="javascript:history.back()">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Link>
              </Button>
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              If you believe this is an error, please{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact support
              </Link>
              .
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
