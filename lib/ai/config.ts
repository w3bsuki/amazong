export const AI_CONFIG = {
  chat: {
    // Keep output capped to reduce token burn and rate-limit pressure.
    maxOutputTokens: 640,
    temperature: 0.3,
    maxRetries: 0,
    maxMessages: 10,
  },
  search: {
    maxOutputTokens: 512,
    temperature: 0.2,
    maxRetries: 0,
    maxMessages: 6,
  },
  vision: {
    maxRetries: 0,
  },
} as const
