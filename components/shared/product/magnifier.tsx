"use client";

import { useState, MouseEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagnifierProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  magnifierSize?: number;
  zoomLevel?: number;
  className?: string;
}

export function Magnifier({
  src,
  alt,
  width,
  height,
  magnifierSize = 200,
  zoomLevel = 2.5,
  className,
}: MagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

  const handleMouseEnter = (e: MouseEvent) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();

    // Calculate cursor position relative to the image
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;
    setXY([x, y]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      className={cn("relative cursor-zoom-in flex items-center justify-center", className)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Use width/height instead of fill for proper sizing in carousel context */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="max-w-full max-h-full w-auto h-auto object-contain"
        sizes="(max-width: 1024px) 100vw, 600px"
        priority
      />

      <AnimatePresence>
        {showMagnifier && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              pointerEvents: "none",
              height: `${magnifierSize}px`,
              width: `${magnifierSize}px`,
              top: `${y - magnifierSize / 2}px`,
              left: `${x - magnifierSize / 2}px`,
              opacity: "1",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "50%",
              backgroundColor: "white",
              backgroundImage: `url('${src}')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
              backgroundPosition: `${-x * zoomLevel + magnifierSize / 2}px ${
                -y * zoomLevel + magnifierSize / 2
              }px`,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              zIndex: 50,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
