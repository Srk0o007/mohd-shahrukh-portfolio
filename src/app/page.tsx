import { About } from '@/components/sections/About'
import { Certifications } from '@/components/sections/Certifications'
import { Education } from '@/components/sections/Education'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Skills } from '@/components/sections/Skills'

/**
 * Home page in the approved order (PRD §7, D15, DS-02): Hero, 01 About, 02 Services,
 * 03 Experience, 04 Skills, 05 Certifications, 06 Education. No separate Resume section.
 * Projects, the hire band and testimonials arrive in Phase 08; contact in Phase 09.
 */
export default function HomePage() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <Hero />
      <About />
      <Services />
      <Experience />
      <Skills />
      <Certifications />
      <Education />
    </main>
  )
}
