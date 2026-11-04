import { ActiveSectionObserver } from '@/components/layout/ActiveSectionObserver'
import { BackToTop } from '@/components/layout/BackToTop'
import { About } from '@/components/sections/About'
import { Certifications } from '@/components/sections/Certifications'
import { Contact } from '@/components/sections/Contact'
import { Education } from '@/components/sections/Education'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { HireCta } from '@/components/sections/HireCta'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { Skills } from '@/components/sections/Skills'
import { Testimonials } from '@/components/sections/Testimonials'
import { navItems, uiCopy } from '@/content'
import { anchorId } from '@/lib/links'

/**
 * Home page in the approved order (PRD §7, D15, DS-02): Hero, 01 About, 02 Services,
 * 03 Experience, 04 Skills, 05 Certifications, 06 Education, 07 Projects, the hire band,
 * 08 Testimonials, 09 Contact. No separate Resume section.
 */
export default function HomePage() {
  const navIds = navItems.map((item) => anchorId(item.href) ?? '').filter(Boolean)
  return (
    <>
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Services />
        <Experience />
        <Skills />
        <Certifications />
        <Education />
        <Projects />
        <HireCta />
        <Testimonials />
        <Contact />
        {/* Inside <main> so all content sits in a landmark; fixed positioning is unaffected. */}
        <BackToTop label={uiCopy.backToTop} />
      </main>
      <ActiveSectionObserver navIds={navIds} />
    </>
  )
}
