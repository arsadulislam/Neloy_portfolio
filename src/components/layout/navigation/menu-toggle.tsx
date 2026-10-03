"use client"

import { motion } from "framer-motion"

interface MenuToggleProps {
  toggle: () => void
  isOpen: boolean
}

export const MenuToggle = ({ toggle, isOpen }: MenuToggleProps) => (
  <button
    onClick={toggle}
    className="relative z-[100] flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/80 backdrop-blur-xl hover:bg-secondary/80 transition-colors focus:outline-none"
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <svg width="23" height="18" viewBox="0 0 23 18">
      <motion.path
        fill="transparent"
        strokeWidth="2"
        stroke="currentColor"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          opened: { d: "M 3 16.5 L 17 2.5" },
        }}
        animate={isOpen ? "opened" : "closed"}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        fill="transparent"
        strokeWidth="2"
        stroke="currentColor"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 2 9.423 L 20 9.423", opacity: 1 },
          opened: { d: "M 2 9.423 L 20 9.423", opacity: 0 },
        }}
        animate={isOpen ? "opened" : "closed"}
        transition={{ duration: 0.2 }}
      />
      <motion.path
        fill="transparent"
        strokeWidth="2"
        stroke="currentColor"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          opened: { d: "M 3 2.5 L 17 16.346" },
        }}
        animate={isOpen ? "opened" : "closed"}
        transition={{ duration: 0.3 }}
      />
    </svg>
  </button>
)
