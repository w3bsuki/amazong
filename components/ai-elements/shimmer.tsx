"use client";

import { cn } from "@/lib/utils";
import { type JSX, memo } from "react";

export type TextShimmerProps = {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  duration?: number;
  spread?: number;
};

const ShimmerComponent = ({
  children,
  as: Component = "p",
  className,
}: TextShimmerProps) => {
  return (
    <Component className={cn(className)}>
      {children}
    </Component>
  );
};

export const Shimmer = memo(ShimmerComponent);
