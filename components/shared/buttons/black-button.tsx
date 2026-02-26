import { Button, type ButtonProps } from "@/components/ui/button"

export type BlackButtonProps = Omit<ButtonProps, "variant">

export function BlackButton(props: BlackButtonProps) {
  return (
    <Button
      {...props}
      variant="cta"
    />
  )
}
