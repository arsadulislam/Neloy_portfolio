"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  GraduationCap,
  MapPin,
  Calendar,
} from "lucide-react"
import { education } from "@/lib/bio-data"
import { fadeUpVariant, sectionVariants, cardVariantRight, cinematicReveal, staggerContainer, headerReveal } from "@/lib/animations"
import { useIsMobile, useAutoHighlight, useAtTopHighlight } from "@/hooks/use-mobile-view-effect"
import { Footer } from "@/components/layout/footer"
import { SectionHeader } from "@/components/layout/section-header"
import { GlowCard } from "@/components/blocks/glow-card"
import { PremiumBackButton } from "@/components/ui/premium-back-button"
import { useNavigationHub } from "@/contexts/navigation-hub-context"

const intro = {
  title: "I'm Neloy, an IT Support and Network Engineer who believes reliable systems begin with disciplined learning.",
  paragraphs: [
    "My journey is rooted in practical IT operations: supporting users, troubleshooting systems, maintaining networks, and learning how infrastructure behaves under real-world pressure. Over more than three years, I have worked across IT support, networking, infrastructure management, and system administration.",
    "I work with MikroTik Routers, Active Directory, Windows Server, Linux Systems, DNS, DHCP, monitoring, and security operations. I value clear diagnostics, careful documentation, and solutions that are stable enough for the people and businesses depending on them.",
    "My next chapter focuses on Cloud Infrastructure, Security Systems, Automation, and Infrastructure Building. Through hands-on projects with Wazuh, Zabbix, GitHub Actions, Linux Systems, Docker, and Python, I am developing secure, automated, and scalable infrastructure solutions while continuously expanding my technical expertise.."
  ]
}

export function AboutContent() {
  const { isOpen: isNavHubOpen } = useNavigationHub()
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [loadingDots, setLoadingDots] = useState("")
  const isMobile = useIsMobile()
  const scrollThreshold = 25
  const isAtTop = useAtTopHighlight(isMobile, scrollThreshold)
  const text = "> initiating background check"
  const [skipAnimation, setSkipAnimation] = useState(false)

  useEffect(() => {
    // Check if user has seen animation before
    const hasSeen = localStorage.getItem("has-seen-about-animation")
    if (hasSeen) {
      setSkipAnimation(true)
      setIsTypingComplete(true)
    } else {
      // Mark as seen for next time
      localStorage.setItem("has-seen-about-animation", "true")
    }
  }, [])

  useEffect(() => {
    if (!isTypingComplete) return;

    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 200) // faster delay

    return () => clearInterval(interval)
  }, [isTypingComplete])

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 lg:pt-28">
        {/* Back link */}
        <div className="mb-12">
          <PremiumBackButton 
            href="/" 
            text="Back to Terminal" 
            autoHover={isAtTop}
            isVisible={!isNavHubOpen}
          />
        </div>

        {/* Page header */}
        <SectionHeader 
          index={1} 
          title="Profile // About Me" 
          subtitle="A deep scan of my technical journey, core philosophy, and the path that led me to AI Engineering."
        />

        {!skipAnimation && (
          <div className="mt-2 mb-8 font-mono text-xs md:text-sm text-muted-foreground min-h-[24px]">
            <span>
              {text.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.03, delay: i * 0.02 }} // faster typing
                  onAnimationComplete={() => {
                    if (i === text.length - 1) setIsTypingComplete(true)
                  }}
                >
                  {char}
                </motion.span>
              ))}
              <span>{loadingDots}</span>
            </span>
          </div>
        )}

        {/* Content */}
        {isTypingComplete && (
          <>
            {/* Intro section */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              className="mb-16 grid gap-4 grid-cols-1 lg:grid-cols-4"
            >
              {/* Left Block: Intro Content */}
              <GlowCard 
                as={motion.div}
                variants={cinematicReveal}
                className="rounded-md border border-border glass-premium-bg lg:col-span-3 p-4 md:p-8 lg:p-10"
              >
                <div className="flex flex-col h-full">
                  <span className="mb-4 inline-block font-mono text-[10px] tracking-widest text-primary uppercase">
                    who I am
                  </span>
                  <h1 className="mb-6 text-balance font-medium leading-tight tracking-tight text-foreground text-md md:text-2xl lg:text-3xl">
                    {intro.title}
                  </h1>
                  <div className="flex max-w-full flex-col gap-4 text-justify">
                    {intro.paragraphs.map((paragraph, index) => (
                      <p key={index} className="text-xs md:text-base leading-relaxed text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </GlowCard>

              {/* Right Block: Status & Location Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:flex lg:flex-col">
                {/* Card 2: Status */}
                <GlowCard 
                  as={motion.div}
                  variants={cinematicReveal}
                  className="flex flex-col justify-center gap-4 rounded-md border border-border glass-premium-bg p-4 md:p-8 lg:p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      Status
                    </span>
                  </div>
                  <p className="text-sm font-medium">Open to IT & Networking Opportunities</p>
                </GlowCard>

                {/* Card 3: Location */}
                <GlowCard 
                  as={motion.div}
                  variants={cinematicReveal}
                  className="flex flex-col justify-center gap-4 rounded-md border border-border glass-premium-bg p-4 md:p-8 lg:p-6"
                >
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Location</span>
                    <p className="text-sm">Bangladesh</p>
                  </div>
                </GlowCard>
              </div>
            </motion.section>

            {/* Education (detailed) */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="mb-16"
            >
              <SectionHeader 
                index={3} 
                title="Academic Foundation" 
                subtitle=""
              />

              <div className="flex flex-col gap-4">
                {education.map((edu) => (
                  <EducationCard key={edu.degree} edu={edu} isMobile={isMobile} />
                ))}
              </div>
            </motion.section>
          </>
        )}
      </div>
      {isTypingComplete && <Footer />}
    </>
  )
}

function EducationCard({ edu, isMobile }: { edu: typeof education[number], isMobile: boolean }) {
  const ref = useRef(null)
  const isAutoActive = useAutoHighlight(ref, isMobile)
  const isActive = isAutoActive

  return (
    <GlowCard
      ref={ref}
      as={motion.div}
      variants={cinematicReveal}
      enableTilt={!isMobile}
      className={`group rounded-md border glass-premium-bg p-4 md:p-8 transition-all duration-300`}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border transition-colors duration-300 lg:group-hover:bg-primary lg:group-hover:text-primary-foreground ${isActive ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-primary border-border"}`}>
            <GraduationCap className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-foreground">
              {edu.degree}
            </h3>
            <span className="font-mono text-xs text-primary">
              {edu.school}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3" strokeWidth={1.5} />
            {edu.location}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" strokeWidth={1.5} />
            {edu.period}
          </span>
        </div>
      </div>

      <p className="mb-4 font-mono text-xs text-primary">
        {edu.focus}
      </p>

      <ul className="flex flex-col gap-2">
        {edu.highlights?.map((h) => (
          <li key={h} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground text-justify">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            {h}
          </li>
        ))}
      </ul>
    </GlowCard>
  )
}