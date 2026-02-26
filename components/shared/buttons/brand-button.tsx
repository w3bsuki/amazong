import { Button, type ButtonProps } from "@/components/ui/button"

export type BrandButtonProps = Omit<ButtonProps, "variant">

export function BrandButton(props: BrandButtonProps) {
  return (
    <Button
      {...props}
      variant="cta"
    />
  )
}
