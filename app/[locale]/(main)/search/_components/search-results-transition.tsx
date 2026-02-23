import type { ReactNode } from "react"

interface SearchResultsTransitionProps {
  transitionKey: string
  children: ReactNode
}

export function SearchResultsTransition({
  transitionKey,
  children,
}: SearchResultsTransitionProps) {
  return (
    <div key={transitionKey} className="motion-safe:animate-content-fade-in">
      {children}
    </div>
  )
}
