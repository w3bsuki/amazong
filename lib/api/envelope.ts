type EnvelopePayload = Record<string, unknown>

export type SuccessEnvelope<T extends EnvelopePayload = {}> = { success: true } & T
export type ErrorEnvelope<T extends EnvelopePayload = {}> = { success: false } & T
export type Envelope<TSuccess extends EnvelopePayload = {}, TError extends EnvelopePayload = {}> =
  | SuccessEnvelope<TSuccess>
  | ErrorEnvelope<TError>

export function successEnvelope<T extends EnvelopePayload = {}>(payload?: T): SuccessEnvelope<T> {
  if (!payload) {
    return { success: true } as SuccessEnvelope<T>
  }

  return { success: true, ...payload }
}

export function errorEnvelope<T extends EnvelopePayload = {}>(payload?: T): ErrorEnvelope<T> {
  if (!payload) {
    return { success: false } as ErrorEnvelope<T>
  }

  return { success: false, ...payload }
}
