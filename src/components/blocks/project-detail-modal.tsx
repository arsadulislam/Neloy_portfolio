"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Github, ExternalLink, Video, X, Layers, Info, Image as ImageIcon } from "lucide-react"
import { Project } from "@/lib/project-data"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GitHubReadme } from "@/components/blocks/github-readme"
import { headerReveal, characterContainer, staggerContainer } from "@/lib/animations"
import { GlowCard } from "./glow-card"

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
  sourceRect?: DOMRect | null
}

export function ProjectDetailModal({ project, onClose, sourceRect }: ProjectDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Calculate the final modal position (centered)
  const finalRect = useMemo(() => {
    if (typeof window === "undefined") return { top: "5%", left: "2.5%", width: "95%", height: "90%" }
    const vw = window.innerWidth
    const vh = window.innerHeight

    let widthPct = 95, heightPct = 90
    if (vw >= 1024) { widthPct = 75; heightPct = 85 }
    else if (vw >= 768) { widthPct = 85; heightPct = 85 }

    const w = Math.min(vw * widthPct / 100, 1280) // max-w-5xl = 1280px
    const h = vh * heightPct / 100
    const left = (vw - w) / 2
    const top = (vh - h) / 2

    return { top, left, width: w, height: h }
  }, [])

  // Source rect for the initial/exit keyframe
  const fromRect = sourceRect
    ? { top: sourceRect.top, left: sourceRect.left, width: sourceRect.width, height: sourceRect.height }
    : { top: finalRect.top as number, left: finalRect.left as number, width: (finalRect.width as number) * 0.9, height: (finalRect.height as number) * 0.9 }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-md"
      />

      {/* Modal — animates from card rect to centered position */}
      <GlowCard
        as={motion.div}
        initial={{
          position: "fixed",
          top: fromRect.top,
          left: fromRect.left,
          width: fromRect.width,
          height: fromRect.height,
          opacity: 0.5,
          borderRadius: 8,
        }}
        animate={{
          top: finalRect.top,
          left: finalRect.left,
          width: finalRect.width,
          height: finalRect.height,
          opacity: 1,
          borderRadius: 12,
        }}
        exit={{
          top: fromRect.top,
          left: fromRect.left,
          width: fromRect.width,
          height: fromRect.height,
          opacity: 0,
          borderRadius: 8,
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed z-[200] overflow-hidden flex flex-col shadow-2xl shadow-black/80 bg-card/95 backdrop-blur-xl border border-primary/20"
        style={{ maxWidth: "none" }}
      >
        {/* Content — fades in after expansion */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={staggerContainer}
          className="relative w-full h-full flex flex-col"
        >
          {/* Header / Close */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-background/20 backdrop-blur-sm">
            <motion.h2
              variants={characterContainer}
              className="flex flex-wrap font-mono text-xs md:text-sm font-medium uppercase text-foreground"
            >
              {project.title.split(" ").map((word, wordIdx) => (
                <span key={wordIdx} className="inline-flex mr-[0.3em]">
                  {word.split("").map((char, charIdx) => (
                    <motion.span 
                      key={charIdx} 
                      variants={headerReveal}
                      className="tracking-[0.1em]"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h2>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          <ScrollArea className="flex-1">
            <motion.div variants={staggerContainer} className="relative">
              
              {/* Cinematic Hero Banner */}
              {(project.banner || (project.images && project.images.length > 0)) && (
                <div className="relative w-full h-[250px] md:h-[400px] overflow-hidden border-b border-border/30">
                  <Image
                    src={project.banner || project.images![0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>
              )}

              <div className="p-6 md:p-10">
                <div className="grid gap-10 lg:grid-cols-3">
                  
                  {/* Left Column (Primary Content) */}
                  <div className="lg:col-span-2 space-y-12">
                    
                    {/* Overview Segment */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-primary uppercase">
                        <Info className="h-3 w-3" /> project overview
                      </div>
                      <div className="space-y-4 text-muted-foreground leading-relaxed text-justify">
                        {Array.isArray(project.description) ? (
                            project.description.map((paragraph, i) => (
                              <p key={i} className="text-sm md:text-base">{paragraph}</p>
                            ))
                          ) : (
                            <p className="text-sm md:text-base">{project.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Technical Segment */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-primary uppercase">
                        <Layers className="h-3 w-3" /> architecture & tools
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1.5 text-[10px] font-mono tracking-wider bg-secondary/50 border border-primary/10 rounded-sm text-foreground hover:border-primary/40 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Sidebar) */}
                  <div className="space-y-10 lg:pl-4 lg:border-l lg:border-border/30">
                    
                    {/* Actions Segment */}
                    {(project.github || project.live || project.video) && (
                      <div className="space-y-6">
                        <h4 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">links & access</h4>
                        <div className="grid gap-2">
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer"
                               className="flex items-center justify-between p-3 rounded-md bg-white/5 hover:bg-white/10 text-xs font-mono transition-colors group border border-transparent hover:border-white/10">
                              <span className="flex items-center gap-2"><Github className="h-4 w-4" /> Repository</span>
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          )}
                          {project.live && (
                            <a href={project.live} target="_blank" rel="noopener noreferrer"
                               className="flex items-center justify-between p-3 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-mono transition-colors group border border-primary/20">
                              <span className="flex items-center gap-2"><ExternalLink className="h-4 w-4" /> Live Demo</span>
                              <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </a>
                          )}
                          {project.video && (
                            <a href={project.video} target="_blank" rel="noopener noreferrer"
                               className="flex items-center justify-between p-3 rounded-md bg-white/5 hover:bg-white/10 text-xs font-mono transition-colors group border border-transparent hover:border-white/10">
                              <span className="flex items-center gap-2"><Video className="h-4 w-4" /> Case Study Video</span>
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Gallery Segment */}
                    {project.images && project.images.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">gallery</h4>
                          <ImageIcon className="h-3 w-3 text-muted-foreground/50" />
                        </div>
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
                          {project.images.map((img, i) => (
                            <button
                              key={img}
                              type="button"
                              onClick={() => setSelectedImage(img)}
                              className="relative aspect-video w-full overflow-hidden rounded-md border border-border/50 group/img cursor-zoom-in"
                              aria-label={`View ${project.title} screenshot ${i + 1}`}
                            >
                              <Image
                                src={img}
                                alt={`${project.title} scan ${i + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Section (Full Width README) */}
                {project.github && (
                  <div className="mt-14 md:mt-12 pt-4 md:pt-8 border-t border-border/30">
                    <div className="max-w-full overflow-x-auto">
                      <GitHubReadme githubUrl={project.github} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </ScrollArea>
        </motion.div>
      </GlowCard>

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[220] flex items-center justify-center bg-background/90 p-4 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-6 z-10 rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            aria-label="Close image preview"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative h-full w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={`${project.title} enlarged screenshot`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </motion.div>
      )}
    </>
  )
}
