import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "@/components/shared/page-shell"

export default function ChatLoading() {
  return (
    <PageShell className="flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r bg-card hidden md:flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-3 border-b flex gap-3">
              <Skeleton className="size-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded md:hidden" />
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Received Messages */}
          <div className="flex gap-3 max-w-xl md:max-w-2xl">
            <Skeleton className="size-8 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-20 w-64 rounded-md rounded-tl-none" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Sent Messages */}
          <div className="flex gap-3 max-w-xl md:max-w-2xl ml-auto flex-row-reverse">
            <div className="space-y-2">
              <Skeleton className="h-16 w-56 rounded-md rounded-tr-none" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </div>

          {/* Received Message with Product */}
          <div className="flex gap-3 max-w-xl md:max-w-2xl">
            <Skeleton className="size-8 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-48 rounded-md rounded-tl-none" />
              <Skeleton className="h-24 w-64 rounded-lg" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Sent Message */}
          <div className="flex gap-3 max-w-xl md:max-w-2xl ml-auto flex-row-reverse">
            <div className="space-y-2">
              <Skeleton className="h-10 w-40 rounded-md rounded-tr-none" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </div>

          {/* More received */}
          <div className="flex gap-3 max-w-xl md:max-w-2xl">
            <Skeleton className="size-8 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-14 w-72 rounded-md rounded-tl-none" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </PageShell>
  )
}
