"use client"

import { motion } from "framer-motion"
import { headerReveal, lineReveal, staggerContainer, characterContainer } from "@/lib/animations"

interface SectionHeaderProps {
  index: number
  title: string
  subtitle?: string
}

export function SectionHeader({ index, title, subtitle }: SectionHeaderProps) {
  const characters = title.split("")

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between"
    >
      <div className="flex flex-col gap-4">
        <motion.div variants={headerReveal} className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-widest text-primary font-bold uppercase">
             {String(index).padStart(2, "0")}
          </span>
          <motion.div 
            variants={lineReveal} 
            className="h-[1px] w-8 bg-primary/30 origin-left" 
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase italic">
             Archive_00{index}
          </span>
        </motion.div>
        
        <motion.h2 
          variants={characterContainer}
          className="flex flex-wrap text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          {characters.map((char, i) => (
            <motion.span 
              key={i} 
              variants={headerReveal}
              className={char === " " ? "mr-[0.2em]" : ""}
            >
              {char}
            </motion.span>
          ))}
        </motion.h2>
      </div>
      
      {subtitle && (
        <motion.div variants={headerReveal} className="max-w-md">
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground uppercase tracking-wider text-left md:text-right">
            {subtitle}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
