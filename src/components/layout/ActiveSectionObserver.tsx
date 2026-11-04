'use client'

import { useEffect } from 'react'
import { currentSectionId, goToSection, legacyTarget } from '@/lib/section-nav'

export interface ActiveSectionObserverProps {
  /** Section ids that have a nav item (D15). */
  navIds: readonly string[]
}

/**
 * Renders nothing (COMPONENT_ARCHITECTURE §3).
 * - FR-NAV-04: marks the nav link of the section being read with `aria-current="true"`.
 *   Sections are observed with IntersectionObserver against a reading line 40% down the
 *   viewport; there is no per-scroll React state. The id is also written to
 *   `<html data-section>` so the mobile menu can mark the same item when it opens.
 *   Sections without a nav item (hero, certifications, education) clear the mark.
 * - FR-NAV-06: legacy anchors (#home, #resume, #portfolio, #testimonial) are redirected to the
 *   matching section on load and on hash changes.
 */
export function ActiveSectionObserver({ navIds }: ActiveSectionObserverProps) {
  useEffect(() => {
    const redirectLegacy = () => {
      const target = legacyTarget(window.location.hash)
      if (target) goToSection(target, { replace: true })
    }
    redirectLegacy()
    window.addEventListener('hashchange', redirectLegacy)
    return () => window.removeEventListener('hashchange', redirectLegacy)
  }, [])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
    const root = document.documentElement
    let frame = 0

    const update = () => {
      frame = 0
      const id = currentSectionId(
        sections.map((s) => ({ id: s.id, top: s.getBoundingClientRect().top })),
        {
          height: window.innerHeight,
          atBottom: window.innerHeight + window.scrollY >= root.scrollHeight - 2,
        },
      )
      const navId = id && navIds.includes(id) ? id : ''
      if (root.dataset.section === navId) return
      root.dataset.section = navId
      for (const link of document.querySelectorAll<HTMLAnchorElement>('nav a[href*="#"]')) {
        const matches = navId !== '' && link.hash === `#${navId}`
        if (matches) link.setAttribute('aria-current', 'true')
        else link.removeAttribute('aria-current')
      }
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    // A zero-height reading line 40% down the viewport: any section edge crossing it reports.
    const observer = new IntersectionObserver(schedule, { rootMargin: '-40% 0px -60% 0px' })
    for (const section of sections) observer.observe(section)
    // Reaching the end of the page (the last section may never cross the line).
    const footer = document.querySelector('footer')
    const bottom = new IntersectionObserver(schedule, { threshold: [0, 1] })
    if (footer) bottom.observe(footer)
    update()

    return () => {
      observer.disconnect()
      bottom.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [navIds])

  return null
}
