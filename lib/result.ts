/**
 * Discriminated union Result types for type-safe error handling.
 * 
 * Use these instead of throwing exceptions for expected error cases.
 * 
 * @example
 * ```ts
 * function fetchUser(id: string): Result<User, 'not_found' | 'unauthorized'> {
 *   if (!session) return { success: false, error: 'unauthorized' }
 *   const user = await db.getUser(id)
 *   if (!user) return { success: false, error: 'not_found' }
 *   return { success: true, data: user }
 * }
 * 
 * const result = await fetchUser('123')
 * if (result.success) {
 *   console.log(result.data.name) // TypeScript knows data exists
 * } else {
 *   console.log(result.error) // TypeScript knows error exists
 * }
 * ```
 */

/**
 * Success result with data
 */
export type Success<T> = {
  readonly success: true
  readonly data: T
}

/**
 * Failure result with typed error
 */
export type Failure<E> = {
  readonly success: false
  readonly error: E
}

/**
 * Discriminated union result type
 */
export type Result<T, E = string> = Success<T> | Failure<E>

/**
 * Result with optional error message for additional context
 */
export type ResultWithMessage<T, E = string> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E; readonly message?: string }

// =============================================================================
// Factory functions
// =============================================================================

/**
 * Create a success result
 */
export function ok<T>(data: T): Success<T> {
  return { success: true, data }
}

/**
 * Create a failure result
 */
export function err<E>(error: E): Failure<E> {
  return { success: false, error }
}

// =============================================================================
// Type guards
// =============================================================================

/**
 * Type guard to check if result is success
 */
export function isOk<T, E>(result: Result<T, E>): result is Success<T> {
  return result.success === true
}

/**
 * Type guard to check if result is failure
 */
export function isErr<T, E>(result: Result<T, E>): result is Failure<E> {
  return result.success === false
}

// =============================================================================
// Utility functions
// =============================================================================

/**
 * Unwrap a result, throwing if it's a failure
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.success) {
    return result.data
  }
  throw new Error(`Unwrap failed: ${String((result as Failure<E>).error)}`)
}

/**
 * Unwrap a result with a default value for failures
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.success ? result.data : defaultValue
}

/**
 * Map over a success value
 */
export function map<T, U, E>(result: Result<T, E>, fn: (data: T) => U): Result<U, E> {
  if (result.success) {
    return ok(fn(result.data))
  }
  return result as Failure<E>
}

/**
 * Chain results (flatMap)
 */
export function andThen<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> {
  if (result.success) {
    return fn(result.data)
  }
  return result as Failure<E>
}

// =============================================================================
// Async utilities
// =============================================================================

/**
 * Wrap a promise that might throw into a Result
 */
export async function tryAsync<T>(
  promise: Promise<T>
): Promise<Result<T, Error>> {
  try {
    const data = await promise
    return ok(data)
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}

/**
 * Wrap a function that might throw into a Result
 */
export function tryCatch<T>(fn: () => T): Result<T, Error> {
  try {
    const data = fn()
    return ok(data)
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}

// =============================================================================
// Action result type for server actions
// =============================================================================

/**
 * Standard action result type for server actions.
 * Use this for consistent return types across all server actions.
 */
export type ActionResult<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

/**
 * Create a successful action result
 */
export function actionOk<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

/**
 * Create a failed action result
 */
export function actionErr(error: string, code?: string): ActionResult<never> {
  return { success: false, error, ...(code && { code }) }
}
