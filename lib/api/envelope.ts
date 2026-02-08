type EnvelopePayload = Record<string, unknown>

type EmptyPayload = Record<string, never>

export type SuccessEnvelope<T extends EnvelopePayload = EmptyPayload> = { success: true } & T
export type ErrorEnvelope<T extends EnvelopePayload = EmptyPayload> = { success: false } & T
export type Envelope<TSuccess extends EnvelopePayload = EmptyPayload, TError extends EnvelopePayload = EmptyPayload> =
  | SuccessEnvelope<TSuccess>
  | ErrorEnvelope<TError>

export function successEnvelope<T extends EnvelopePayload = EmptyPayload>(payload?: T): SuccessEnvelope<T> {
  if (!payload) {
    return { success: true } as SuccessEnvelope<T>
  }

  return { success: true, ...payload }
}

export function errorEnvelope<T extends EnvelopePayload = EmptyPayload>(payload?: T): ErrorEnvelope<T> {
  if (!payload) {
    return { success: false } as ErrorEnvelope<T>
  }

  return { success: false, ...payload }
}
