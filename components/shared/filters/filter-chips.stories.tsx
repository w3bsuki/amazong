/**
 * FilterChips Stories - Active search filters chips
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import * as React from "react"
import { FilterChips } from "./filter-chips"

const meta: Meta<typeof FilterChips> = {
  title: "Search/FilterChips",
  component: FilterChips,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  render: function Render() {
    const params = React.useMemo(() => {
      const p = new URLSearchParams()
      p.set("freeShipping", "true")
      p.set("minRating", "4")
      p.set("minPrice", "10")
      p.set("maxPrice", "100")
      p.set("deals", "true")
      p.set("availability", "instock")
      p.append("attr_color", "Red")
      p.append("attr_color", "Blue")
      return p
    }, [])

    return (
      <div className="w-full max-w-3xl">
        <FilterChips
          currentCategory={{ name: "Electronics", slug: "electronics" }}
          appliedSearchParams={params}
          onRemoveFilter={() => {}}
          onClearAll={() => {}}
        />
      </div>
    )
  },
}
