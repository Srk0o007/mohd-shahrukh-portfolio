import { About } from '@/components/sections/About'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'

/**
 * Home page (PRD §7 order). Phase 07 sections: Hero, 01 About … 06 Education.
 * Projects and the hire band arrive in Phase 08; testimonials and contact in Phases 08–09.
 */
export default function HomePage() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <Hero />
      <About />
      <Services />
      <Experience />
    </main>
  )
}
