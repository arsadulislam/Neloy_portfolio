"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { GraduationCap, MapPin, Calendar } from "lucide-react"
import { aboutContent, education } from "@/lib/bio-data"
import { useMode } from "@/hooks/use-mode"
import { cinematicReveal, staggerContainer, headerReveal } from "@/lib/animations"
import { useIsMobile, useAutoHighlight } from "@/hooks/use-mobile-view-effect"
import { GlowCard } from "../blocks/glow-card"
import { SectionHeader } from "../layout/section-header"

interface AboutSectionProps {
  index: number
}

export function AboutSection({ index }: AboutSectionProps) {
  const { mode } = useMode()
  const activeBio = aboutContent[mode] || aboutContent.generalist
  return (
    <section id="about" className="border-t border-border" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <SectionHeader 
          index={index} 
          title="About"
          subtitle=""
        />

          <h2 id="about-heading" className="sr-only">About</h2>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-8 items-stretch">
          {/* About text */}
          <GlowCard as={motion.div} variants={cinematicReveal} className="flex flex-col gap-6 rounded-md border border-border bg-card/40 backdrop-blur-md p-4 md:p-8 h-full relative overflow-hidden">
            <motion.div variants={headerReveal} className="absolute top-2 right-2 opacity-10">
               <span className="font-mono text-[8px] tracking-widest"></span>
            </motion.div>
            <div className="flex items-start justify-between">
              <motion.span variants={headerReveal} className="font-mono text-[10px] tracking-widest text-primary uppercase">
                {mode === "generalist" ? "about_me" : `about_${mode.replace("-", "_")}`}
              </motion.span>
              <motion.span variants={headerReveal} className="font-mono text-[10px] text-muted-foreground">
                {""}
              </motion.span>
            </div>
            <div className="flex flex-col gap-4">
              {activeBio.map((paragraph, i) => (
                <p 
                  key={i} 
                  className="text-xs md:text-base leading-relaxed text-muted-foreground text-justify"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </GlowCard>

        </motion.div>

        {/* Debugging Overlay: Visualizes the center */}
        {/* {process.env.NODE_ENV === 'development' && isMobile && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="absolute w-full border-t-2 border-dashed border-red-500/50" style={{ top: `${VIEWPORT_MARGIN_PERCENT}%` }}>
              <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-br-md font-mono">START (-{VIEWPORT_MARGIN_PERCENT}%) </span>
            </div>
            <div className="absolute w-full border-t-2 border-dashed border-red-500/50" style={{ top: `${100 - VIEWPORT_MARGIN_PERCENT}%` }}>
              <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-tr-md font-mono"> END (-{VIEWPORT_MARGIN_PERCENT}%) </span>
            </div>
          </div>
        )} */}
      </div>
    </section>
  )
}

export function EducationSection({ index }: AboutSectionProps) {
  const isMobile = useIsMobile()

  return (
    <section id="education" className="border-t border-border" aria-labelledby="education-heading">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <SectionHeader
          index={index}
          title="Education"
          subtitle=""
        />

        <h2 id="education-heading" className="sr-only">Education</h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-4 lg:grid-cols-2"
        >
          {education.map((edu) => (
            <EducationCard key={edu.degree} edu={edu} isMobile={isMobile} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function EducationCard({ edu, isMobile }: { edu: typeof education[number], isMobile: boolean }) {
  const ref = useRef(null)
  const isActive = useAutoHighlight(ref, isMobile)

  return (
    <motion.div
      ref={ref}
      variants={cinematicReveal}
      className={`group flex flex-col gap-4 rounded-md border bg-card/40 backdrop-blur-md px-4 py-6 md:p-8 transition-all duration-500 ease-out lg:hover:border-primary/30 lg:hover:-translate-y-1 lg:hover:shadow-lg lg:hover:shadow-primary/5 ${isActive ? "border-primary/30 -translate-y-1 shadow-lg shadow-primary/5" : "border-border translate-y-0 shadow-none"}`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border transition-colors duration-300 lg:group-hover:bg-primary lg:group-hover:text-primary-foreground ${isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
          <GraduationCap className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium leading-tight text-foreground">
            {edu.degree}
          </h3>
          <span className="font-mono text-xs text-primary">
            {edu.school}
          </span>
        </div>
      </div>

      <p className="font-mono text-[11px] text-foreground">
        {edu.focus}
      </p>

      <p className="text-xs md:text-sm leading-relaxed text-muted-foreground italic border-l-2 border-primary/20 pl-4">
        {edu.description}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <MapPin className="h-3 w-3" strokeWidth={1.5} />
          {edu.location}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <Calendar className="h-3 w-3" strokeWidth={1.5} />
          {edu.period}
        </div>
      </div>
    </motion.div>
  )
}