import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-svh w-full">
      <div className="hidden w-72 flex-col border-r bg-sidebar lg:flex">
        <div className="space-y-4 p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex h-12 items-center gap-2 border-b px-4">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-4 w-32" />
        </div>
        <main className="flex-1 p-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>
        </main>
      </div>
    </div>
  )
}

