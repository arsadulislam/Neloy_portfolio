import type { Metadata } from "next"
import { ProjectsPageContent } from "./projects-content"

export const metadata: Metadata = {
  title: "Projects | VM Portfolio",
  description: "Detailed project showcase with descriptions, tech stacks, and media.",
}

export default function ProjectsPage() {
  return <ProjectsPageContent />
}