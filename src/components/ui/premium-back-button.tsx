"use client"

import { motion } from "framer-motion"
import { ChevronLeft, Terminal } from "lucide-react"
import Link from "next/link"

interface PremiumBackButtonProps {
  href: string
  text: string
  className?: string
  autoHover?: boolean
  threshold?: number
  isVisible?: boolean
}

export function PremiumBackButton({ 
  href, 
  text, 
  className = "", 
  autoHover = false, 
  threshold = 50,
  isVisible = true
}: PremiumBackButtonProps) {
  return (
    <Link href={href}>
      <motion.div
        initial="closed"
        animate={isVisible ? (autoHover ? "hover" : "opened") : "closed"}
        exit="closed"
        whileHover="hover"
        variants={{
          closed: { 
            opacity: 0, 
            x: -40,
            scale: 0.95,
            filter: "blur(4px)",
            transition: { 
              duration: 0.4,
              ease: [0.32, 0, 0.67, 0] // easeInExpo
            }
          },
          opened: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: { 
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1], // easeOutQuint
              staggerChildren: 0.1,
              delayChildren: 0.1
            }
          },
          hover: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: { staggerChildren: 0.05 }
          }
        }}
        className={`group relative flex items-center gap-4 font-mono ${className}`}
      >
        {/* Terminal HUD Block */}
        <div className="relative flex items-center">
          {/* Constant Pulse Glow */}
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-1 rounded-sm bg-primary/20 blur-md group-hover:bg-primary/40"
          />

          <motion.div
            variants={{
              closed: { scale: 0.8, opacity: 0 },
              opened: { scale: 1, opacity: 1, backgroundColor: "hsla(var(--secondary) / 0.3)" },
              hover: { scale: 1.05, opacity: 1, backgroundColor: "hsl(var(--primary))" }
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative flex h-8 items-center justify-center rounded-sm border border-primary/30 px-3 transition-colors duration-300 group-hover:border-primary"
          >
            <span className="flex items-center gap-2 text-[10px] font-bold tracking-tighter transition-colors group-hover:text-primary-foreground">
              <motion.span
                variants={{
                  closed: { width: 0, opacity: 0, x: -5 },
                  opened: { width: 0, opacity: 0, x: -5 },
                  hover: { width: "auto", opacity: 0.6, x: 0 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="overflow-hidden whitespace-nowrap text-[8px]"
              >
                [[
              </motion.span>

              <span>ESC</span>

              <motion.span
                variants={{
                  closed: { width: 0, opacity: 0, x: 5 },
                  opened: { width: 0, opacity: 0, x: 5 },
                  hover: { width: "auto", opacity: 0.6, x: 0 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="overflow-hidden whitespace-nowrap text-[8px]"
              >
                ]]
              </motion.span>
              <ChevronLeft className="h-3 w-3" strokeWidth={3} />
            </span>
          </motion.div>
        </div>

        {/* Command Info with masked reveal */}
        <div className="flex flex-col gap-0.5 relative overflow-hidden">
          <motion.div 
            variants={{
              closed: { opacity: 0, x: 40 },
              opened: { opacity: 1, x: 0 },
              hover: { opacity: 1, x: 0 }
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <Terminal className="h-2.5 w-2.5 text-primary/40 group-hover:text-primary/60" />
            <span className="text-[8px] tracking-[0.2em] text-muted-foreground/50 uppercase group-hover:text-primary/30">
              CMD: BACK_TO_ROOT
            </span>
          </motion.div>

          {/* Masked text reveal */}
          <div className="relative overflow-hidden">
            <motion.span
              variants={{
                closed: { x: -10, opacity: 0 },
                opened: { x: 0, opacity: 0.8 },
                hover: { x: 4, opacity: 1 }
              }}
              transition={{ duration: 0.4 }}
              className="block text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase transition-colors group-hover:text-foreground"
            >
              {text}
            </motion.span>

            {/* Scanning line for entrance */}
            <motion.div
              variants={{
                closed: { left: "-100%" },
                opened: { left: ["-100%", "100%"] }
              }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent skew-x-12 z-10 hidden group-data-[state=loading]:block"
            />
          </div>
        </div>

        {/* HUD Scan Line animation on hover */}
        <motion.div
          variants={{
            closed: { scaleX: 0, opacity: 0 },
            opened: { scaleX: 0, opacity: 0 },
            hover: { scaleX: 1, opacity: 1 }
          }}
          transition={{ duration: 0.4 }}
          className="absolute -bottom-2 left-0 h-[1px] w-full origin-left bg-gradient-to-r from-primary to-transparent"
        />

        {/* Digital Reconstruction Flicker overlay */}
        <motion.div
          variants={{
            closed: { opacity: 0 },
            opened: { opacity: [0, 0.4, 0.1, 0.5, 0], scaleY: [1, 1.2, 0.8, 1.1, 1] }
          }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="pointer-events-none absolute inset-0 -z-10 bg-primary/5 blur-sm"
        />
      </motion.div>
    </Link>
  )
}
