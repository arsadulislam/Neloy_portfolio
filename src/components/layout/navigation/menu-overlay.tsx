"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"
import { Sun, Moon, FileText, Download, ChevronRight } from "lucide-react"
import { exploreLinks, RESUMES } from "@/config/navigation-data"
import { socialLinks } from "@/components/layout/footer"
import { useIsMobile, useAtBottomHighlight } from "@/hooks/use-mobile-view-effect"
import { cn } from "@/lib/utils"

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  },
  opened: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
}

const itemVariants = {
  closed: { y: 20, opacity: 0 },
  opened: { y: 0, opacity: 1 }
}

function NavStaggerItem({ children, variants, className = "" }: { children: React.ReactNode, variants: any, className?: string }) {
  const [isItemReady, setIsItemReady] = useState(false)
  return (
    <motion.div
      variants={variants}
      onAnimationComplete={(definition) => {
        if (definition === "opened") setIsItemReady(true)
      }}
      className={cn(className, !isItemReady && "pointer-events-none")}
    >
      {children}
    </motion.div>
  )
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const [showResumes, setShowResumes] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const isMobile = useIsMobile()
  const isAtBottom = useAtBottomHighlight(isMobile, 30)

  const toggleTheme = (e: React.MouseEvent) => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"

    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    const x = e.clientX
    const y = e.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme)
      })
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]

      document.documentElement.animate(
        {
          clipPath: clipPath,
          filter: ["blur(20px)", "blur(0px)"],
        },
        {
          duration: 600,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    })
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const isAnchor = href.startsWith("#") || href.startsWith("/#")
    const targetPathname = href.split("#")[0].replace("/", "") || "home"
    const currentPathname = window.location.pathname.replace("/", "") || "home"

    // If it's a section on the same page
    if (isAnchor && (targetPathname === currentPathname || (targetPathname === "home" && currentPathname === ""))) {
      e.preventDefault()
      const targetId = href.includes("#") ? `#${href.split("#")[1]}` : "#home"
      const targetElement = document.querySelector(targetId)
      const viewport = document.querySelector('[data-radix-scroll-area-viewport]')

      onClose()

      // Wait for menu exit animation to complete before scrolling
      setTimeout(() => {
        if (viewport && targetElement) {
          // Manual scroll on the Radix viewport to avoid browser anchor-snap conflicts
          const targetOffset = (targetElement as HTMLElement).offsetTop
          viewport.scrollTo({ top: targetOffset, behavior: "smooth" })
        } else if (viewport && targetId === "#home") {
          viewport.scrollTo({ top: 0, behavior: "smooth" })
        } else if (targetElement) {
          // Fallback if ScrollArea is not used (e.g. on simpler pages)
          targetElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 400)
    } else {
      // Regular page navigation
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="opened"
          exit="closed"
          variants={overlayVariants}
          data-nav-overlay
          className="fixed inset-0 z-[150] flex flex-col bg-background/80 backdrop-blur-[40px] px-6 py-24 md:px-20 md:py-32 overflow-y-auto border-b border-border/50 shadow-2xl"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row gap-12 lg:gap-32">

            {/* Left: Primary Links */}
            <div className="flex-1">
              <motion.span
                variants={itemVariants}
                className="mb-8 block font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
              >
                01. Explore
              </motion.span>
              <nav className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {exploreLinks.map((link, i) => {
                  const isAnchor = link.href.includes("#")
                  const routeLabel = isAnchor 
                    ? `#${link.href.split("#")[1]}` 
                    : link.href.startsWith("/") ? link.href : `/${link.href}`

                  return (
                    <NavStaggerItem key={link.label} variants={itemVariants}>
                      <Link
                        href={link.href}
                        onMouseEnter={() => setHoveredLink(link.label)}
                        onMouseLeave={() => setHoveredLink(null)}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className={`group relative flex items-center justify-between py-2 font-mono text-xl md:text-2xl text-foreground/80 transition-all px-4 rounded-md -ml-4 ${link.color}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {"//"}
                          </span>
                          {link.label}
                        </div>

                        {/* Premium Route Indicator */}
                        <div className="flex items-center gap-4 overflow-hidden">
                          {/* Static version for Mobile/Tab (Subtle/Faint) */}
                          <div className="md:hidden font-mono text-[8px] tracking-[0.1em] opacity-[0.25] dark:opacity-[0.15] uppercase italic pr-2">
                            {routeLabel}
                          </div>

                          {/* Animated version for Desktop */}
                          <div className="hidden md:flex justify-end min-w-[80px]">
                            <AnimatePresence mode="wait">
                              {hoveredLink === link.label && (
                                <motion.span 
                                  key="indicator"
                                  initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
                                  animate={{ y: 0, opacity: 0.6, filter: "blur(0px)" }}
                                  exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  className="block font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase italic"
                                >
                                  {(link.href.startsWith("#") || link.href.startsWith("/#")) ? "Section" : "Page"}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </Link>
                    </NavStaggerItem>
                  )
                })}
              </nav>
            </div>

            {/* Right: Controls & Context */}
            <div className="w-full lg:w-80 flex flex-col gap-12">

              {/* Quick Actions */}
              <NavStaggerItem variants={itemVariants} className="flex flex-col gap-6">
                <div>
                  <span className="mb-4 block font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    02. Actions
                  </span>
                  <div className="relative">
                    <div className="flex flex-row gap-2">
                      <button
                        onClick={toggleTheme}
                        className="flex-1 flex items-center justify-center gap-2 rounded-sm border border-border bg-secondary/40 py-3 font-mono text-xs text-foreground hover:border-primary transition-colors group overflow-hidden"
                      >
                        <div className="relative h-4 w-4">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={resolvedTheme}
                              initial={{ y: 20, opacity: 0, rotate: -45 }}
                              animate={{ y: 0, opacity: 1, rotate: 0 }}
                              exit={{ y: -20, opacity: 0, rotate: 45 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              {resolvedTheme === "dark" ? (
                                <Sun size={14} className="text-amber-500 fill-amber-500/10" />
                              ) : (
                                <Moon size={14} className="text-blue-400 fill-blue-400/10" />
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        Theme
                      </button>

                      <button
                        onClick={() => setShowResumes(!showResumes)}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-sm border border-border py-3 font-mono text-xs transition-all ${showResumes ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/40 text-foreground hover:border-primary"
                          }`}
                      >
                        <FileText size={14} className={showResumes ? "animate-bounce" : ""} />
                        Resume
                        <motion.div
                          animate={{ rotate: showResumes ? 270 : 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                          <ChevronRight size={14} className="mt-0.5" />
                        </motion.div>
                      </button>
                    </div>

                    <AnimatePresence>
                      {showResumes && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9, filter: "blur(10px)" }}
                          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: 10, scale: 0.9, filter: "blur(10px)" }}
                          className="absolute right-0 top-full z-20 mt-3 flex w-full flex-col gap-1 rounded-sm border border-border bg-background/90 p-1 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                        >
                          <div className="px-3 py-2 border-b border-border/50 mb-1 text-right">
                            <span className="font-mono text-[8px] tracking-widest text-muted-foreground uppercase block italic">Download Version</span>
                          </div>
                          {RESUMES.map((resume, idx) => (
                            <motion.a
                              key={resume.id}
                              href={resume.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-center justify-end gap-3 rounded-sm px-3 py-2.5 font-mono text-[10px] hover:bg-primary hover:text-primary-foreground transition-all group text-right"
                            >
                              <ChevronRight size={10} className="-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50 transition-all rotate-180" />
                              <span className="flex items-center gap-2">
                                {resume.label}
                                <Download size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                              </span>
                            </motion.a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Socials */}
                <div>
                  <span className="mb-4 block font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    04. Network
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social, i) => {
                      // Explicit mapping to ensure Tailwind generates these brand classes for auto-hover
                      const brandStyles: Record<string, string> = {
                        GitHub: "text-white bg-[#24292e] border-[#24292e]",
                        LinkedIn: "text-white bg-[#0077b5] border-[#0077b5]",
                        Discord: "text-white bg-[#5865F2] border-[#5865F2]",
                        Email: "text-white bg-[#EA4335] border-[#EA4335]"
                      }

                      return (
                        <NavStaggerItem
                          key={social.label}
                          variants={itemVariants}
                        >
                          <motion.a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            // Mirror the PC whileHover transforms using the mobile auto-hover state
                            animate={{
                              y: isAtBottom ? -4 : 0,
                              // scale: isAtBottom ? 1.1 : 1,
                              opacity: 1
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 25
                            }}
                            className={cn(
                              "group relative flex h-11 w-11 items-center justify-center rounded-sm border border-border bg-secondary/40 text-muted-foreground transition-all duration-300",
                              social.color,
                              isAtBottom && brandStyles[social.label]
                            )}
                            aria-label={social.label}
                          >
                            <div className={cn(
                              "absolute inset-0 rounded-xl bg-primary/0 transition-colors group-hover:bg-primary/5",
                              isAtBottom && "bg-primary/5"
                            )} />
                            <social.icon
                              size={18}
                              className={cn(
                                "relative z-10 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                                isAtBottom && "scale-110"
                              )}
                              strokeWidth={1.5}
                            />
                          </motion.a>
                        </NavStaggerItem>
                      );
                    })}
                  </div>
                </div>
              </NavStaggerItem>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
