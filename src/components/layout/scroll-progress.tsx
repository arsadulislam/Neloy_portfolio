"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress({ containerRef }: { containerRef?: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    container: containerRef
  })
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[1px] bg-primary origin-left"
      style={{ scaleX }}
    />
  )
}
