"use client"

import { useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { MenuToggle } from "./menu-toggle"
import { MenuOverlay } from "./menu-overlay"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { SITE_METADATA } from "@/lib/site-metadata"
import { useProjectModal } from "@/hooks/use-project-modal"
import { useNavigationHub } from "@/contexts/navigation-hub-context"

export function Navigation() {
  const { isOpen, setIsOpen, toggleOpen } = useNavigationHub()
  const { selectedProject } = useProjectModal()

  // ... (useScrollLock) ...

  // Double-click/tap handler for the entire window
  useEffect(() => {
    const handleDoubleClick = (e: MouseEvent | TouchEvent) => {
      // Disable for PC/Mouse users (pointer: fine)
      const isPC = window.matchMedia("(pointer: fine)").matches
      if (isPC) return

      // Don't trigger if it's a click on an interactive element or if modal is open
      if (selectedProject) return
      
      const target = e.target as HTMLElement
      const isInteractive = target.closest('button, a, input, [role="button"]')
      
      if (!isInteractive) {
        toggleOpen()
      }
    }

    window.addEventListener("dblclick", handleDoubleClick)
    return () => window.removeEventListener("dblclick", handleDoubleClick)
  }, [toggleOpen, selectedProject])

  // Browser "Back" button support to close menu
  useEffect(() => {
    if (isOpen) {
      // Push a new state to history when menu opens
      window.history.pushState({ menuOpen: true }, "")
    }

    const handlePopState = (e: PopStateEvent) => {
      if (isOpen) {
        e.preventDefault()
        setIsOpen(false)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [isOpen])

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[160] transition-all duration-500 ${
          selectedProject ? "opacity-0 pointer-events-none -translate-y-full" : "opacity-100 pointer-events-auto translate-y-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-8 flex items-center justify-between pointer-events-auto">
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: isOpen ? 0 : 1, 
              x: isOpen ? -20 : 0 
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={isOpen ? "pointer-events-none" : ""}
          >
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-3 rounded-md border border-border bg-card/80 px-3 py-2 md:px-4 md:py-2 backdrop-blur-xl hover:border-primary/50 transition-all"
            >
              <div className="relative h-6 w-6 md:h-7 md:w-7">
                <Image
                  src={SITE_METADATA.logo}
                  alt="Logo"
                  fill
                  className="object-cover invert dark:invert-0 transition-all duration-500 group-hover:scale-110 mix-blend-multiply dark:mix-blend-screen [mask-image:radial-gradient(circle,black_70%,transparent_100%)]"
                />
              </div>
              <span className="hidden font-mono text-xs tracking-tighter text-foreground/80 sm:block">
                arsadul.islam
              </span>
            </Link>
          </motion.div>

          {/* Toggle Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <MenuToggle isOpen={isOpen} toggle={toggleOpen} />
          </motion.div>
        </div>
      </header>

      <MenuOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
