import { GoogleOAuthButton } from "@/components/auth/google-oauth-button"

interface AuthOAuthSectionProps {
  nextPath: string
  orLabel: string
  onError: (message: string) => void
  onNavigateAway?: (() => void) | undefined
  testId: string
}

export function AuthOAuthSection({
  nextPath,
  orLabel,
  onError,
  onNavigateAway,
  testId,
}: AuthOAuthSectionProps) {
  return (
    <div className="space-y-3" data-testid={testId}>
      <GoogleOAuthButton
        nextPath={nextPath}
        onError={onError}
        onNavigateAway={onNavigateAway}
      />
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <p className="text-xs text-muted-foreground">{orLabel}</p>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  )
}
