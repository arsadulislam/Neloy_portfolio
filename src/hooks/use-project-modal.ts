"use client"

import { useState, useEffect, useCallback } from "react"
import { Project } from "@/lib/project-data"

export function useProjectModal() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const handlePopState = () => {
      setSelectedProject(null)
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    if (selectedProject) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
      document.body.style.paddingRight = "0px"
    }
    return () => {
      document.body.style.overflow = "unset"
      document.body.style.paddingRight = "0px"
    }
  }, [selectedProject])

  const openProject = useCallback((project: Project, rect?: DOMRect) => {
    window.history.pushState(null, "", window.location.href)
    setSourceRect(rect ?? null)
    setSelectedProject(project)
  }, [])

  const closeProject = useCallback(() => {
    if (selectedProject) {
      window.history.back()
    }
  }, [selectedProject])

  return {
    selectedProject,
    sourceRect,
    openProject,
    closeProject,
    setSelectedProject
  }
}
