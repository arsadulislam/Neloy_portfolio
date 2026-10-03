"use client"

import { useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ScrollProgress } from "./scroll-progress"
import { ModeProvider } from "@/hooks/use-mode"

export function ClientShell({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <ScrollProgress containerRef={containerRef} />
      <ModeProvider>
        <ScrollArea ref={containerRef} className="h-screen w-full relative z-10">
          {children}
        </ScrollArea>
      </ModeProvider>
    </>
  )
}
