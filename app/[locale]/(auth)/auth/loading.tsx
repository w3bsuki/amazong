import { Skeleton } from "@/components/ui/skeleton"

export default function AuthLoading() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-md border border-border p-4 sm:p-4 shadow-sm">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <Skeleton className="h-7 w-36 mx-auto mb-2" />
            <Skeleton className="h-4 w-56 mx-auto" />
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-px flex-1" />
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Submit Button */}
          <Skeleton className="h-11 w-full rounded-lg mb-4" />

          {/* Switch Link */}
          <div className="text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
