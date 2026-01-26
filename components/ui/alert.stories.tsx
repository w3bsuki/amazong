import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Alert, AlertDescription, AlertTitle } from "./alert"

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          Prices may change based on availability and demand.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const Destructive: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Alert variant="destructive">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Please check your card details and try again.
        </AlertDescription>
      </Alert>
    </div>
  ),
}
