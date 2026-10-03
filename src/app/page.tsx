import { Navigation } from "@/components/layout/navigation"
import { HeroBento } from "@/components/sections/hero-bento"
import { AboutSection, EducationSection } from "@/components/sections/about-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { ExperienceSection } from "@/components/sections/experience-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { CertificatesSection } from "@/components/sections/certificates-section"
import { Footer } from "@/components/layout/footer"

export default function Page() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroBento index={1} />
        <AboutSection index={2} />
        <EducationSection index={3} />
        <SkillsSection index={4} />
        <ExperienceSection index={5} />
        <ProjectsSection index={6} />
        <CertificatesSection index={7} />

      </main>
      <Footer />
    </div>
  )
}
