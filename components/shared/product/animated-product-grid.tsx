"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import {
  ProductGrid,
  ProductGridItem,
  ProductGridSkeleton,
  getProductGridItemsClassName,
  type ProductGridProps,
} from "@/components/shared/product/product-grid"

interface AnimatedProductGridProps extends ProductGridProps {
  /**
   * Stable key for each visible batch.
   * Change this when category/query/filter context changes so only new batches stagger in.
   */
  batchKey: string
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
}

export function AnimatedProductGrid({
  products,
  viewMode = "grid",
  density = "normal",
  preset = "desktop",
  className,
  isLoading = false,
  batchKey,
}: AnimatedProductGridProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (isLoading) {
    return <ProductGridSkeleton viewMode={viewMode} density={density} preset={preset} />
  }

  if (products.length === 0) {
    return null
  }

  // Never animate first SSR paint; only animate after hydration/interaction.
  if (!isHydrated) {
    return (
      <ProductGrid
        products={products}
        viewMode={viewMode}
        density={density}
        preset={preset}
        {...(className ? { className } : {})}
      />
    )
  }

  return (
    <div
      id="product-grid"
      data-slot="product-grid"
      className="@container"
      role="list"
      aria-live="polite"
      tabIndex={-1}
    >
      <motion.div
        key={batchKey}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={getProductGridItemsClassName({ viewMode, density, className })}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            role="listitem"
            className="motion-safe:[&_[data-slot=badge]]:animate-badge-pop"
          >
            <ProductGridItem
              product={product}
              index={index}
              viewMode={viewMode}
              preset={preset}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
