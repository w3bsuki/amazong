import { describe, expect, it } from "vitest"

import { parseWebhookSecrets } from "@/lib/env"

describe("lib/env.parseWebhookSecrets", () => {
  it("returns a single secret as a one-element array", () => {
    expect(parseWebhookSecrets("whsec_1")).toEqual(["whsec_1"])
  })

  it("splits secrets on commas", () => {
    expect(parseWebhookSecrets("whsec_1,whsec_2")).toEqual(["whsec_1", "whsec_2"])
  })

  it("splits secrets on newlines", () => {
    expect(parseWebhookSecrets("whsec_1\nwhsec_2")).toEqual(["whsec_1", "whsec_2"])
  })

  it("trims whitespace and drops empty entries", () => {
    expect(parseWebhookSecrets("  whsec_1  , \n  whsec_2 \n\n ,  ")).toEqual(["whsec_1", "whsec_2"])
  })

  it("returns an empty array for empty input", () => {
    expect(parseWebhookSecrets("")).toEqual([])
  })
})

