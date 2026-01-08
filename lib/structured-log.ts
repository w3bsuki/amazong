type JsonPrimitive = string | number | boolean | null

type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

type LogLevel = 'info' | 'warn' | 'error'

type LogMeta = Record<string, unknown>

const SENSITIVE_KEY = /(authorization|cookie|set-cookie|password|secret|token|api[_-]?key|signature|jwt)/i

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  )
}

function toSafeJson(value: unknown, depth = 0): JsonValue {
  if (value == null) return null
  if (typeof value === 'string') {
    return value.length > 500 ? `${value.slice(0, 500)}…` : value
  }
  if (typeof value === 'number' || typeof value === 'boolean') return value

  if (value instanceof Date) return value.toISOString()

  if (Array.isArray(value)) {
    if (depth >= 3) return `[array:${value.length}]`
    return value.slice(0, 50).map((v) => toSafeJson(v, depth + 1))
  }

  if (isPlainObject(value)) {
    if (depth >= 3) return '[object]'

    const entries = Object.entries(value).slice(0, 50)
    const out: Record<string, JsonValue> = {}
    for (const [k, v] of entries) {
      out[k] = SENSITIVE_KEY.test(k) ? '[redacted]' : toSafeJson(v, depth + 1)
    }
    return out
  }

  // Fall back to a short description for unknown types
  return Object.prototype.toString.call(value)
}

function emit(level: LogLevel, payload: Record<string, JsonValue>) {
  const line = JSON.stringify(payload)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

export function logEvent(level: LogLevel, event: string, meta?: LogMeta) {
  emit(level, {
    ts: new Date().toISOString(),
    level,
    event,
    ...(meta ? { meta: toSafeJson(meta) } : {}),
  })
}

export function logError(event: string, err: unknown, meta?: LogMeta) {
  const errorPayload: Record<string, JsonValue> =
    err instanceof Error
      ? { name: err.name, message: err.message }
      : { name: typeof err, message: String(err) }

  emit('error', {
    ts: new Date().toISOString(),
    level: 'error',
    event,
    error: errorPayload,
    ...(meta ? { meta: toSafeJson(meta) } : {}),
  })
}
