import React from "react"
import { vi } from "vitest"

type MockNextImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  alt: string
  src: string
  fill?: boolean
  priority?: boolean
  blurDataURL?: string
  placeholder?: "blur" | "empty"
}

type MockNextImageRestProps = Omit<MockNextImageProps, "alt" | "src">

function sanitizeNextImageProps(
  props: MockNextImageRestProps
): React.ImgHTMLAttributes<HTMLImageElement> {
  const imgProps: MockNextImageRestProps = { ...props }
  for (const key of ["fill", "priority", "blurDataURL", "placeholder"] as const) {
    delete imgProps[key]
  }
  return imgProps
}

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: MockNextImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element -- next/image is mocked with <img> in unit tests
    <img alt={alt} src={src} {...sanitizeNextImageProps(props)} />
  ),
}))

