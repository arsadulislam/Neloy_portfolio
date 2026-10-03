"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown, X, Terminal, Cpu } from "lucide-react"

interface FilterItem {
  id: string
  label: string
  count?: number
}

interface MobileFilterHubProps {
  items: FilterItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function MobileFilterHub({ items, activeId, onChange, className = "" }: MobileFilterHubProps) {
  const [isOpen, setIsOpen] = useState(false)
  const activeItem = items.find(item => item.id === activeId)

  return (
    <div className={`relative ${className}`}>
      {/* HUD Selector Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-between rounded-sm border border-primary/20 bg-background/40 px-4 py-2.5 font-mono backdrop-blur-md transition-all hover:bg-background/60 hover:border-primary/40"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary/10">
            <Cpu className="h-3 w-3 text-primary" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[8px] leading-tight text-muted-foreground/50 uppercase">
              Current selection
            </span>
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
              {activeItem?.label || "Select Mode"}
            </span>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-primary/40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Cinematic Technical Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl"
            />

            {/* Selector Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="fixed inset-x-4 top-[20%] z-[101] flex flex-col gap-6 rounded-lg border border-primary/20 bg-card/90 p-6 shadow-2xl shadow-primary/10"
            >
              <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
                    Archive // Select Mode
                  </span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 transition-colors hover:bg-primary/10"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="grid gap-2">
                {items.map((item, index) => {
                  const isActive = activeId === item.id
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        onChange(item.id)
                        setIsOpen(false)
                      }}
                      className={`group relative flex items-center justify-between rounded-sm border p-3 font-mono transition-all ${
                        isActive 
                          ? "border-primary bg-primary/10" 
                          : "border-border/40 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span className={`text-[8px] uppercase tracking-tighter ${isActive ? "text-primary/60" : "text-muted-foreground/40"}`}>
                          ID: SYS_ARC_0{index + 1}
                        </span>
                        <span className={`text-[12px] font-bold uppercase ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                          {item.label}
                        </span>
                      </div>
                      
                      {typeof item.count === 'number' && (
                        <div className={`rounded-sm border px-2 py-0.5 text-[9px] ${isActive ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground"}`}>
                           {item.count.toString().padStart(2, '0')}
                        </div>
                      )}

                      {isActive && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 bg-primary"
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>

              <div className="mt-2 flex items-center gap-2 border-t border-primary/10 pt-4 opacity-30">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                <span className="font-mono text-[8px] tracking-[0.3em] uppercase">
                  System state: listening_for_input
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
