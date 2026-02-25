import { useActionState, useEffect, useMemo, useRef } from "react"

export type AuthActionState = {
  error?: string
  fieldErrors?: Record<string, string>
  success?: boolean
}

export type BoundAuthAction = (
  prevState: AuthActionState,
  formData: FormData
) => Promise<AuthActionState>

export function useAuthActionState(
  action: BoundAuthAction,
  onSuccess?: () => void
) {
  const handledSuccess = useRef(false)
  const initialState = useMemo<AuthActionState>(() => ({ fieldErrors: {}, success: false }), [])
  const [state, formAction] = useActionState(action, initialState)

  useEffect(() => {
    if (state?.success && !handledSuccess.current) {
      handledSuccess.current = true
      onSuccess?.()
    }
    if (!state?.success) {
      handledSuccess.current = false
    }
  }, [state?.success, onSuccess])

  return { state, formAction }
}
