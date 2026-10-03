"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Award, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { certificates } from "@/lib/bio-data"
import { useMode } from "@/hooks/use-mode"
import { cinematicReveal, staggerContainer, fadeUpVariant } from "@/lib/animations"
import { useIsMobile, useAutoHighlight } from "@/hooks/use-mobile-view-effect"
import { SectionHeader } from "../layout/section-header"

const INITIAL_COUNT = 4

interface CertificatesSectionProps {
  index: number
}

export function CertificatesSection({ index }: CertificatesSectionProps) {
  const isMobile = useIsMobile()
  const { mode } = useMode()
  const [expanded, setExpanded] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isButtonActive = useAutoHighlight(buttonRef, isMobile)

  // Filter logic
  const filteredCertificates = certificates.filter((cert) => 
    mode === "generalist" || cert.modes.includes(mode)
  )

  const visible = expanded ? filteredCertificates : filteredCertificates.slice(0, INITIAL_COUNT)
  const hasMore = filteredCertificates.length > (INITIAL_COUNT-1)

  // Calculate empty slots to fill the grid
  const remainder = visible.length % 3
  const emptySlots = remainder === 0 ? 0 : 3 - remainder

  return (
    <section id="certificates" className="border-t border-border" aria-labelledby="certificates-heading">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <SectionHeader 
          index={index} 
          title="Certifications" 
          subtitle=""
        />

        <h2 id="certificates-heading" className="sr-only">Certificates</h2>

        <motion.div 
          key={expanded ? "expanded" : "collapsed"}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {visible.map((cert, index) => (
            <CertificateCard key={cert.title} cert={cert} index={index} expanded={expanded} isMobile={isMobile} />
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => {
            const showOnMd = visible.length % 2 !== 0 && i === 0
            return (
              <motion.div
                variants={cinematicReveal}
                key={`empty-${i}`}
                className={`hidden bg-background ${showOnMd ? "md:block" : "lg:block"} ${!expanded && visible.length === 4 ? "lg:hidden" : ""}`}
                aria-hidden="true"
              />
            )
          })}
        </motion.div>

        {/* Expand/Collapse button */}
        {hasMore && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className={`mt-6 flex justify-center ${!expanded && filteredCertificates.length === 4 ? "md:hidden lg:flex" : ""}`}>
            <button
              ref={buttonRef}
              onClick={() => setExpanded((prev) => !prev)}
              className={`group inline-flex items-center gap-2 rounded-sm border px-5 py-2.5 font-mono text-xs transition-all duration-300 lg:hover:border-primary lg:hover:text-foreground ${isButtonActive ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}
              aria-expanded={expanded}
              aria-controls="certificates-grid"
            >
              {expanded ? "Show Less" : `Show All (${filteredCertificates.length})`}
              {expanded ? (
                <ChevronUp className={`h-3.5 w-3.5 transition-transform duration-300 lg:group-hover:-translate-y-0.5 ${isButtonActive ? "-translate-y-0.5" : ""}`} />
              ) : (
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 lg:group-hover:translate-y-0.5 ${isButtonActive ? "translate-y-0.5" : ""}`} />
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function CertificateCard({ cert, index, expanded, isMobile }: { cert: typeof certificates[number], index: number, expanded: boolean, isMobile: boolean }) {
  const ref = useRef(null)
  const isActive = useAutoHighlight(ref, isMobile)

  return (
    <motion.div
      ref={ref}
      variants={cinematicReveal}
      className={`relative bg-background lg:hover:z-10 ${!expanded && index === 3 ? "lg:hidden" : ""} ${isActive ? "z-10" : "z-0"}`}
    >
      <div className={`group flex flex-col gap-2 lg:gap-3 h-full p-4 md:p-6 transition-all duration-500 ease-out lg:hover:bg-card lg:hover:-translate-y-1 lg:hover:shadow-lg lg:hover:shadow-primary/5 ${isActive ? "bg-card -translate-y-1 shadow-lg shadow-primary/5" : "bg-background translate-y-0 shadow-none"}`}>
      <div className="flex items-start justify-between">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-sm border transition-colors duration-300 lg:group-hover:bg-primary lg:group-hover:text-primary-foreground ${isActive ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-primary border-border"}`}
        >
          <Award className="h-3.5 w-3.5" strokeWidth={1.5} />
        </div>
        {cert.credentialUrl && (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${cert.title} credential`}
            className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
          </a>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-medium leading-tight text-foreground">
          {cert.title}
        </h3>
        <span className="font-mono text-xs text-primary">
          {cert.issuer}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">
          {cert.date}
        </span>
        <div className="flex gap-1">
          {cert.modes.map((mode) => (
            <span
              key={mode}
              className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground"
            >
              {mode}
            </span>
          ))}
        </div>
      </div>
      </div>
    </motion.div>
  )
}