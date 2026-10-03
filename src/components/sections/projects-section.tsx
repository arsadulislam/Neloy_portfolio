"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { projects } from "@/lib/project-data"
import Link from "next/link"
import { cinematicReveal, staggerContainer } from "@/lib/animations"
import { useProjectModal } from "@/hooks/use-project-modal"
import { ProjectCard } from "@/components/blocks/project-card"
import { ProjectDetailModal } from "@/components/blocks/project-detail-modal"
import { useAutoHighlight, useIsMobile } from "@/hooks/use-mobile-view-effect"
import { useRef } from "react"
import { SectionHeader } from "../layout/section-header"

interface ProjectsSectionProps {
  index: number
}

export function ProjectsSection({ index }: ProjectsSectionProps) {
  const { selectedProject, sourceRect, openProject, closeProject } = useProjectModal()
  const isMobile = useIsMobile()
  const viewAllRef = useRef<HTMLDivElement | null>(null)
  const isViewAllActive = useAutoHighlight(viewAllRef, isMobile)

  return (
    <section id="projects" className="border-t border-border" aria-labelledby="projects-heading">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <SectionHeader 
          index={index} 
          title="Featured Projects" 
          subtitle=""
        />

        <h2 id="projects-heading" className="sr-only">Projects</h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-4 md:grid-cols-2">
          {projects.slice(0, 4).map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              onClick={openProject}
              variants={cinematicReveal}
            />
          ))}
        </motion.div>

        {projects.length > 4 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cinematicReveal}
            className="mt-8 flex justify-center"
            ref={viewAllRef}>
            <Link
              href="/projects"
              className={`group inline-flex items-center gap-3 rounded-sm border border-border bg-card/40 backdrop-blur-md px-6 py-3 font-mono text-sm text-muted-foreground transition-all hover:border-primary hover:text-foreground hover:gap-4 ${isViewAllActive ? "border-primary text-foreground gap-4" : ""}`}
            >
              View All Projects
              <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${isViewAllActive ? "translate-x-0.5" : ""}`} aria-hidden="true" />
            </Link>
          </motion.div>
        )}

        {/* Project Detail Overlay */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectDetailModal project={selectedProject} onClose={closeProject} sourceRect={sourceRect} />
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
