import type { NextRequest } from 'next/server';

import { proxy } from './proxy';
export { config } from './proxy';

// Next.js requires the entrypoint file name `middleware.ts` at the project root.
// Keep the shared implementation in `proxy.ts` so it can be unit-tested/reused.
export async function middleware(request: NextRequest) {
  return proxy(request);
}
