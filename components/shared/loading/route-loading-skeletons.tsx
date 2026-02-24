import { Skeleton } from "@/components/ui/skeleton"

function LoadingFrame({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">{children}</div>
}

export function FormPageLoading() {
  return (
    <LoadingFrame>
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-11 w-40" />
      </div>
    </LoadingFrame>
  )
}

export function ContentPageLoading() {
  return (
    <LoadingFrame>
      <div className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-28 w-full" />
      </div>
    </LoadingFrame>
  )
}

export function ListPageLoading() {
  return (
    <LoadingFrame>
      <div className="space-y-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </LoadingFrame>
  )
}

export function DetailPageLoading() {
  return (
    <LoadingFrame>
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </LoadingFrame>
  )
}

export function GridPageLoading() {
  return (
    <LoadingFrame>
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    </LoadingFrame>
  )
}

export function ChatPageLoading() {
  return (
    <LoadingFrame>
      <div className="mx-auto max-w-3xl space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-20 w-3/4" />
        <Skeleton className="h-20 w-2/3" />
        <Skeleton className="h-20 w-4/5" />
        <Skeleton className="h-12 w-full" />
      </div>
    </LoadingFrame>
  )
}
