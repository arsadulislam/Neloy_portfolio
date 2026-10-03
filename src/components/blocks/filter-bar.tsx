"use client"

import { motion, AnimatePresence } from "framer-motion"

interface FilterItem {
  id: string
  label: string
  count?: number
}

interface FilterBarProps {
  items: FilterItem[]
  activeId: string
  onChange: (id: string) => void
  layoutId?: string
  className?: string
}

export function FilterBar({ items, activeId, onChange, layoutId = "filter-pill", className = "" }: FilterBarProps) {
  return (
    <div className={`relative flex items-center gap-1 overflow-x-auto no-scrollbar rounded-full border border-border/40 bg-background/20 p-1 backdrop-blur-md ${className}`}>
      {/* Edge Mask for scrollable content */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/20 to-transparent z-20 md:hidden" />
      
      {items.map((item) => {
        const isActive = activeId === item.id
        
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`group relative flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 transition-colors duration-300 ${
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {/* Sliding Backdrop - Strict Linear Transition */}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 z-0 rounded-full bg-primary"
                transition={{
                  type: "tween",
                  ease: [0.22, 1, 0.36, 1], // Cubic bezier for silky smooth linear feel
                  duration: 0.4
                }}
              />
            )}

            <span className="relative z-10 font-mono text-[10px] tracking-wider uppercase font-medium">
              {item.label}
            </span>

            {/* Item Count Badge */}
            <AnimatePresence mode="wait">
              {typeof item.count === "number" && (
                <motion.span 
                  key={item.count}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative z-10 font-mono text-[9px] px-1.5 py-0.5 rounded-full border transition-colors duration-300 ${
                    isActive 
                      ? "border-white/20 bg-white/10 text-white" 
                      : "border-border/50 bg-secondary/50 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary"
                  }`}
                >
                  {item.count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )
      })}
    </div>
  )
}
