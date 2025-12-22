import { Skeleton } from "@/components/ui/skeleton"

export function SignInCtaSkeleton() {
  return (
    <div className="bg-primary/50 rounded-lg p-4 sm:p-6">
      <Skeleton className="h-6 w-64 bg-primary-foreground/20 mb-2" />
      <Skeleton className="h-4 w-48 bg-primary-foreground/20" />
    </div>
  )
}
