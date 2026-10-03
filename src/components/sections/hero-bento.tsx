"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TerminalCard } from "../blocks/terminal-card"
import { TechTicker } from "../blocks/tech-ticker"
import { GlowCard } from "../blocks/glow-card"
import { useMode } from "@/hooks/use-mode"
import { HeroContent } from "@/lib/bio-data"
import { sectionVariants, staggerContainer, cinematicReveal, headerReveal, lineReveal } from "@/lib/animations"
import { TextBlurIn } from "../animations/text/blur-in";
import { MagneticButton } from "../blocks/magnetic-button";

const DecorativeTag = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div variants={staggerContainer} className={`flex items-center gap-2 font-mono text-[8px] tracking-[0.2em] text-muted-foreground/50 uppercase italic ${className}`}>
    <motion.div variants={lineReveal} className="h-[1px] w-4 bg-border/50 origin-left" />
    <motion.span variants={headerReveal}>
      {children}
    </motion.span>
  </motion.div>
)

interface HeroBentoProps {
  index: number
}

export function HeroBento({ index }: HeroBentoProps) {
  const { mode } = useMode()
  const content = HeroContent[mode as keyof typeof HeroContent] || HeroContent.generalist


  return (
    <section id="home" className="mx-auto max-w-7xl px-4 pt-32 pb-16 md:pt-36 lg:pt-40 lg:pb-24" aria-labelledby="hero-heading">
      {/* Section label */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mb-8 flex items-center gap-4"
      >
        <motion.span variants={headerReveal} className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          index
        </motion.span>
        <motion.div variants={lineReveal} className="h-px flex-1 bg-border origin-left" aria-hidden="true" />
        <motion.span variants={headerReveal} className="font-mono text-[10px] tracking-widest text-muted-foreground">
          {String(index).padStart(2, "0")}
        </motion.span>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:grid-rows-[1fr_auto]"
      >
        {/* Card 1 - Intro */}
        <GlowCard as={motion.div} variants={cinematicReveal} className="sm:col-span-2 md:col-span-2 flex flex-col justify-between rounded-md border border-border bg-card/40 backdrop-blur-md p-6 md:p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="font-mono text-[8px] tracking-widest">[ 01, 01 ]</span>
          </div>
          <div>
            <h1
              id="hero-heading"
              className="text-balance text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              <TextBlurIn as={motion.span} className="inline-block">Hello, I am</TextBlurIn>
              <br />
              <span className="text-primary">Arsadul Islam Neloy</span>
            </h1>
            <TextBlurIn className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
              {content.description}
            </TextBlurIn>
          </div>

          <motion.div
            className="mt-8">
            <MagneticButton>
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 rounded-sm bg-primary px-6 py-3 font-mono text-sm font-medium text-primary-foreground transition-all hover:gap-4"
              >
                About Me
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </MagneticButton>
          </motion.div>
        </GlowCard>

        {/* Card 2 - Terminal (Tall, Right, spans 2 rows) */}
        <GlowCard as={motion.div} variants={cinematicReveal} className="hidden md:flex flex-col md:col-span-1 min-h-[425px] md:min-h-[440px] md:row-span-2 relative group rounded-md border border-border bg-card/40 backdrop-blur-md overflow-hidden" >
          <div className="absolute top-3 right-4 z-20 hidden lg:block">
            <DecorativeTag>&gt; Active Shell</DecorativeTag>
          </div>
          <TerminalCard />
        </GlowCard>

        {/* Card 3 - Status (Small, Bottom Left) */}
        <GlowCard as={motion.div} variants={cinematicReveal} className="flex items-center gap-4 rounded-md border border-border bg-card/40 backdrop-blur-md px-6 py-5 relative">
          <div className="absolute top-2 right-2 opacity-20">
            <span className="font-mono text-[8px] tracking-widest">[ 01, 02 ]</span>
          </div>
          <div className="relative flex items-center justify-center">
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-400/40" aria-hidden="true" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              current status
            </span>
            <span className="text-sm font-medium text-foreground">
              Open to IT & Networking Opportunities
            </span>
          </div>
        </GlowCard>

        {/* Card 4 - Tech Stack Ticker (Small, Bottom Center) */}
        <GlowCard as={motion.div} variants={cinematicReveal} className="min-h-[72px] relative group bg-card/40 backdrop-blur-md rounded-md border border-border flex items-center px-4 overflow-hidden">
          <div className="absolute top-2 right-2 opacity-20 z-10">
            <span className="font-mono text-[8px] tracking-widest">[ 02, 01 ]</span>
          </div>
          <TechTicker />
        </GlowCard>
      </motion.div>
    </section>
  )
}