"use client"

import { useRef, memo } from "react"
import { motion, Variants } from "framer-motion"
import { Github, ExternalLink } from "lucide-react"
import { Project } from "@/lib/project-data"
import { useIsMobile, useAutoHighlight } from "@/hooks/use-mobile-view-effect"

interface ProjectCardProps {
  project: Project
  index: number
  onClick: (project: Project, rect?: DOMRect) => void
  variants?: Variants
  limitTags?: boolean
}

export const ProjectCard = memo(function ProjectCard({ project, index, onClick, variants, limitTags = false }: ProjectCardProps) {
  const isMobile = useIsMobile()

  const tagsToShow = limitTags ? project.tags.slice(0, 5) : project.tags
  const remainingTags = limitTags ? project.tags.length - 5 : 0

  const ref = useRef<HTMLDivElement>(null)
  const isActive = useAutoHighlight(ref, isMobile)

  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect()
    onClick(project, rect ?? undefined)
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      onClick={handleClick}
      className={`group relative flex flex-col gap-5 rounded-md border glass-premium-bg px-4 py-6 md:p-4 md:py-6 lg:p-8 cursor-pointer transition-all duration-500 ease-out lg:hover:border-primary/40 lg:hover:shadow-xl lg:hover:shadow-primary/5 lg:hover:-translate-y-1 ${isActive ? "border-primary/40 shadow-xl shadow-primary/5 -translate-y-1" : "border-border shadow-none translate-y-0"}`}
    >
      <div className="absolute top-1 right-2 opacity-5 pointer-events-none transition-opacity group-hover:opacity-20">
        <span className="font-mono text-[8px] tracking-widest">[ PRJ_{String(index + 1).padStart(2, "0")} ]</span>
      </div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            project_{String(index + 1).padStart(2, "0")} / brief description
          </span>
          <h3
            className={`text-md md:text-lg font-medium transition-colors duration-300 lg:group-hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`}
          >
            {project.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {project.github && (
            <div onClick={(e) => e.stopPropagation()}>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} GitHub repository`}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Github className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          )}
          {project.live && (
            <div onClick={(e) => e.stopPropagation()}>
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Brief Description */}
      <p className="text-xs md:text-sm leading-relaxed text-muted-foreground text-justify">
        {project.brief}
      </p>

      {/* Tags */}
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {tagsToShow.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] transition-all duration-500 ease-out lg:group-hover:border-primary/20 lg:group-hover:text-foreground lg:group-hover:-translate-y-0.5 ${isActive ? "border-primary/20 text-foreground -translate-y-0.5" : "border-border text-muted-foreground translate-y-0"}`}
          >
            {tag}
          </span>
        ))}
        {remainingTags > 0 && (
          <span className={`inline-flex items-center rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] transition-all duration-500 ease-out lg:group-hover:border-primary/20 lg:group-hover:text-foreground lg:group-hover:-translate-y-0.5 ${isActive ? "border-primary/20 text-foreground -translate-y-0.5" : "text-muted-foreground translate-y-0"}`}>
            +{remainingTags}
          </span>
        )}
      </div>
    </motion.div>
  )
})