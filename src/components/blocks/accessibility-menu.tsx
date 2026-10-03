"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility, Monitor, Contrast, Type } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAccessibility } from "@/contexts/accessibility-context";
import { usePathname } from "next/navigation"; // Not used here directly but good for context if needed

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // We need to know if the main navigation is open. 
  // Since Navigation and AccessibilityMenu are siblings in RootLayout, 
  // we might need a shared state or just check for the presence of the menu overlay class/id.
  // However, simpler is to check if the scroll is locked or if the overlay is in DOM.
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const checkNav = () => {
      const overlay = document.querySelector('[data-nav-overlay]');
      setIsNavOpen(!!overlay);
    };

    const observer = new MutationObserver(checkNav);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  const {
    reducedMotion,
    highContrast,
    largeText,
    toggleReducedMotion,
    toggleHighContrast,
    toggleLargeText,
  } = useAccessibility();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  if (!mounted) return null;

  const settings = [
    {
      id: "reduced-motion",
      icon: Monitor,
      label: "Reduce Motion",
      description: "Disable background animations",
      checked: reducedMotion,
      onToggle: toggleReducedMotion,
    },
    {
      id: "high-contrast",
      icon: Contrast,
      label: "High Contrast",
      description: "Increase text contrast",
      checked: highContrast,
      onToggle: toggleHighContrast,
    },
    {
      id: "large-text",
      icon: Type,
      label: "Large Text",
      description: "Increase base font size",
      checked: largeText,
      onToggle: toggleLargeText,
    },
  ];

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50">
      {/* ─── Popover Menu ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.8 }}
            className="absolute bottom-14 right-0 w-72 origin-bottom-right rounded-md border border-border bg-card/90 backdrop-blur-xl shadow-2xl shadow-black/20"
            role="dialog"
            aria-label="Accessibility settings"
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Accessibility className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                accessibility
              </span>
            </div>

            {/* Settings */}
            <div className="divide-y divide-border">
              {settings.map((setting) => (
                <label
                  key={setting.id}
                  htmlFor={`a11y-${setting.id}`}
                  className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <setting.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground leading-tight">
                        {setting.label}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground leading-tight">
                        {setting.description}
                      </span>
                    </div>
                  </div>
                  <Switch
                    id={`a11y-${setting.id}`}
                    checked={setting.checked}
                    onCheckedChange={setting.onToggle}
                  />
                </label>
              ))}
            </div>

            {/* Footer hint */}
            <div className="border-t border-border px-3 py-1">
              <span className="font-mono text-[8px] text-muted-foreground/50 tracking-wide leading-none">
                Settings saved locally
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Floating Trigger Button ──────────────────────── */}
      <AnimatePresence>
        {!isNavOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen((v) => !v)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur-md shadow-lg shadow-black/10 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Toggle accessibility settings"
            aria-expanded={isOpen}
          >
            <Accessibility className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
