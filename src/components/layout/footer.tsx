"use client"

import { motion } from "framer-motion"
import { steps } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"
import { MagneticButton } from "../blocks/magnetic-button"

export const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/arsadulislam", color: "hover:text-white hover:bg-[#24292e] hover:border-[#24292e]" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/helloiamneloy/", color: "hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5]" },
  { icon: Mail, label: "Email", href: "mailto:arsadulislam.neloy@gmail.com", color: "hover:text-white hover:bg-[#EA4335] hover:border-[#EA4335]" },
]

export function Footer() {
  const text = "Open to collaborations and interesting projects."

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, display: "none" },
    visible: {
      opacity: 1,
      display: "inline",
      transition: { duration: 0 }
    },
  }

  return (
    <footer id="contact" className="border-t border-border" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 pt-[5.5rem] pb-32">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex flex-col gap-2 min-h-[70px]"
          >
            <span className="font-mono text-[10px] tracking-widest text-primary uppercase font-bold">
              {">"} system.connect()
            </span>

            <div className="flex items-center">
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                {text.split("").map((char, i) => (
                  <motion.span key={i} variants={letterVariants}>
                    {char}
                  </motion.span>
                ))}

                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: steps(2)
                  }}
                  className="inline-block w-2 h-4 ml-1 bg-primary align-middle shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                />
              </p>
            </div>
          </motion.div>

          {/* Right Side: High-Interaction Socials */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link, i) => (
              <MagneticButton key={link.label} strength={0.4}>
                <motion.a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }} // trigger when 20% visible
                  transition={{
                    duration: 0.4,
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.1,
                    rotate: i % 2 === 0 ? 5 : -5
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`group relative flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card/50 backdrop-blur-sm text-muted-foreground transition-all duration-300 shadow-sm ${link.color}`}
                >
                  <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/5 group-hover:ring-4 group-hover:ring-primary/10 transition-all duration-500" />

                  <link.icon className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                </motion.a>
              </MagneticButton>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4 border-t border-border pt-6">
          <span className="font-mono text-[10px] text-muted-foreground">
            {`// ${new Date().getFullYear()} Arsadul Islam (Neloy). All rights reserved.`}
          </span>
          <div className="h-px flex-1 bg-border" aria-hidden="true" />
          <span className="font-mono text-[10px] text-muted-foreground">
            Designed & Built with precision
          </span>
        </div>
      </div>
    </footer>
  )
}
