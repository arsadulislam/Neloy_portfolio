"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface NavigationHubContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleOpen: () => void
}

const NavigationHubContext = createContext<NavigationHubContextType | undefined>(undefined)

export function NavigationHubProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return (
    <NavigationHubContext.Provider value={{ isOpen, setIsOpen, toggleOpen }}>
      {children}
    </NavigationHubContext.Provider>
  )
}

export function useNavigationHub() {
  const context = useContext(NavigationHubContext)
  if (context === undefined) {
    throw new Error("useNavigationHub must be used within a NavigationHubProvider")
  }
  return context
}
