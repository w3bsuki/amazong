import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

const meta: Meta<typeof Tabs> = {
  title: "Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="details" className="w-full max-w-md">
      <TabsList className="w-full">
        <TabsTrigger value="details" className="flex-1">
          Details
        </TabsTrigger>
        <TabsTrigger value="shipping" className="flex-1">
          Shipping
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <Card>
          <CardHeader>
            <CardTitle>Product details</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            High quality materials and fast delivery.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="shipping">
        <Card>
          <CardHeader>
            <CardTitle>Shipping info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Free shipping available on eligible items.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
}
