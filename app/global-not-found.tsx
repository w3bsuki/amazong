import Link from "next/link"

/**
 * Global Not Found Page
 * 
 * This page is shown for any unmatched routes across the entire application.
 * It handles 404 errors at the root level.
 * 
 * Note: This is a Server Component so we use basic HTML elements
 * to avoid issues with client-only components (Button uses React Context).
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-950">
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="mx-auto max-w-md text-center">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="relative mx-auto h-40 w-40">
                <div className="flex items-center justify-center h-full">
                  <span className="text-8xl font-bold text-gray-200 dark:text-gray-800">
                    404
                  </span>
                </div>
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Page Not Found
            </h1>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Let&apos;s get you back on track.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Homepage
              </Link>
            </div>

            <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
              If you believe this is an error, please{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
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
