import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProfileLoading() {
  return (
    <div className="p-4 lg:p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>

        {/* Profile Banner & Avatar Card */}
        <Card>
          <CardContent className="p-0 overflow-hidden">
            {/* Banner */}
            <Skeleton className="w-full h-32 sm:h-40 rounded-none" />
            
            {/* Avatar & Basic Info */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 -mt-10 sm:-mt-12">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <Skeleton className="size-20 sm:size-24 rounded-full border-4 border-card" />
                <div className="flex-1 space-y-2 pt-2 sm:pt-0 sm:pb-2">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-9 w-28 self-start sm:self-end" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Email */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Phone */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Username */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            {/* Bio */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-20 w-full" />
            </div>

            {/* Location */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
