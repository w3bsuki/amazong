import React from "react"
import { cleanup, fireEvent, render } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import { FilterRatingSection } from "@/components/shared/filters/sections/filter-rating-section"

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    if (key === "andUp") return "and up"
    return key
  },
}))

afterEach(() => {
  cleanup()
})

function getRows(): HTMLElement[] {
  return [
    ...document.querySelectorAll<HTMLElement>('[role="checkbox"][tabindex="0"]'),
  ]
}

describe("FilterRatingSection", () => {
  test("applies rating on click and keyboard", () => {
    const onChange = vi.fn()

    render(<FilterRatingSection minRating={null} onChange={onChange} />)

    const rows = getRows()
    expect(rows).toHaveLength(4)
    const [first, second] = rows
    if (!first || !second) {
      throw new Error("Expected at least two rating rows")
    }

    fireEvent.click(first)
    fireEvent.keyDown(second, { key: "Enter" })
    fireEvent.keyDown(second, { key: " " })

    expect(onChange).toHaveBeenNthCalledWith(1, "4")
    expect(onChange).toHaveBeenNthCalledWith(2, "3")
    expect(onChange).toHaveBeenNthCalledWith(3, "3")
  })

  test("clears active rating when selected row is toggled", () => {
    const onChange = vi.fn()

    render(<FilterRatingSection minRating="4" onChange={onChange} />)

    const rows = getRows()
    const [first] = rows
    if (!first) {
      throw new Error("Expected at least one rating row")
    }
    expect(first).toHaveAttribute("aria-checked", "true")

    fireEvent.click(first)
    expect(onChange).toHaveBeenCalledWith(null)
  })

  test("does not expose row buttons in accessibility tree", () => {
    const onChange = vi.fn()

    render(<FilterRatingSection minRating={null} onChange={onChange} />)
    expect(getRows()).toHaveLength(4)
    expect(
      document.querySelectorAll('[role="checkbox"][tabindex="0"] button[tabindex="0"]')
    ).toHaveLength(0)
  })
})
