"use client"

import { useRef, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  as?: "div" | "span"
}

export function MagneticButton({ children, className = "", strength = 0.3, as = "div" }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const offsetX = useSpring(0, { damping: 20, stiffness: 300 })
  const offsetY = useSpring(0, { damping: 20, stiffness: 300 })

  // Inner content moves slightly more for a layered feel
  const innerX = useTransform(offsetX, (v) => v * 0.6)
  const innerY = useTransform(offsetY, (v) => v * 0.6)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = (e.clientX - centerX) * strength
    const dy = (e.clientY - centerY) * strength
    offsetX.set(dx)
    offsetY.set(dy)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    offsetX.set(0)
    offsetY.set(0)
  }

  const Component = as === "span" ? motion.span : motion.div

  return (
    <Component
      ref={ref as any}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: offsetX, y: offsetY }}
      className={`inline-block ${className}`}
    >
      <motion.span
        style={{ x: innerX, y: innerY, display: "inline-block" }}
      >
        {children}
      </motion.span>
    </Component>
  )
}
