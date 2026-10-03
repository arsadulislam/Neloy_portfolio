import { useRef, useState, useCallback, useEffect } from "react"
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion"
import { useAccessibility } from "@/contexts/accessibility-context"

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
  glowRadius?: number
  glowOpacity?: number
  enableTilt?: boolean // Keep for prop compatibility but ignore in logic, or use for subtle scale
  [key: string]: any
}

export function GlowCard({
  children,
  className = "",
  as: Component = "div",
  glowRadius = 350,
  glowOpacity = 0.4,
  enableTilt = false,
  ...rest
}: GlowCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const { reducedMotion } = useAccessibility()

  // Mouse tracking for glowing border
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  const springConfig = { stiffness: 150, damping: 25, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const check = () => {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
      setIsDesktop(mq.matches && window.innerWidth > 768)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  const handleMouseEnter = useCallback(() => setIsHovering(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    mouseX.set(-1000)
    mouseY.set(-1000)
  }, [mouseX, mouseY])

  const showGlow = isDesktop && !reducedMotion
  const borderBackground = useMotionTemplate`radial-gradient(${glowRadius}px circle at ${smoothX}px ${smoothY}px, hsla(var(--primary) / ${glowOpacity}), transparent 80%)`

  return (
    <Component
      ref={containerRef}
      className={`group relative overflow-hidden rounded-md transition-all duration-500 ease-out ${className} ${isHovering ? "border-primary/30 shadow-2xl shadow-primary/5" : "border-border"}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        scale: enableTilt && isHovering && !reducedMotion ? 1.01 : 1,
        ...rest.style
      }}
      {...rest}
    >
      {/* Inner Highlight Ring (Subtle Terminal aesthetic) */}
      <div 
        className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ${isHovering ? "opacity-10" : "opacity-0"}`}
        style={{
          boxShadow: "inset 0 0 40px 0 hsla(var(--primary) / 0.2)"
        }}
      />

      {/* 2. Border Glow Layer */}
      {showGlow && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            border: "1px solid transparent",
            background: borderBackground,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />
      )}

      {children}
    </Component>
  )
}
