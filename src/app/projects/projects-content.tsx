"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { projects } from "@/lib/project-data"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { cinematicGrid, cardVariantRight, cardVariantLeft } from "@/lib/animations"
import { useProjectModal } from "@/hooks/use-project-modal"
import { ProjectCard } from "@/components/blocks/project-card"
import { ProjectDetailModal } from "@/components/blocks/project-detail-modal"
import { SectionHeader } from "@/components/layout/section-header"
import { PremiumBackButton } from "@/components/ui/premium-back-button"
import { useIsMobile, useAtTopHighlight } from "@/hooks/use-mobile-view-effect"
import { useNavigationHub } from "@/contexts/navigation-hub-context"

export function ProjectsPageContent() {
  const { isOpen: isNavHubOpen } = useNavigationHub()
  const { selectedProject, sourceRect, openProject, closeProject } = useProjectModal()
  const isMobile = useIsMobile()
  const scrollThreshold = 25
  const isAtTop = useAtTopHighlight(isMobile, scrollThreshold)

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 pt-24 pb-16 lg:pt-28">
        {/* HUD Navigation */}
        <div className="mb-12">
          <PremiumBackButton 
            href="/" 
            text="Return to Dashboard" 
            autoHover={isAtTop}
            isVisible={!isNavHubOpen}
          />
        </div>

        {/* Page header */}
        <SectionHeader 
          index={projects.length} 
          title="Archive // All Projects" 
          subtitle="A comprehensive index of technical implementations, research experiments, and engineering solutions."
        />

        {/* Project list (Grid) */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={cinematicGrid}
          className="grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              onClick={openProject}
              variants={index % 2 === 0 ? cardVariantRight : cardVariantLeft}
              limitTags={true}
            />
          ))}
        </motion.div>

      </main>

      <Footer />

      {/* Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal project={selectedProject} onClose={closeProject} sourceRect={sourceRect} />
        )}
      </AnimatePresence>
    </div>
  )
}
