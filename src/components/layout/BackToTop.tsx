'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { ArrowUpIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { goToSection } from '@/lib/section-nav'

export interface BackToTopProps {
  label: string
}

/**
 * Back to top (FR-INT-05, COMPONENT_VISUAL_SPEC §24). A real link to #top that appears once the
 * hero has left the viewport. Activating it scrolls up (instantly under reduced motion) and
 * moves focus to the top section. While hidden it is `invisible`: neither focusable nor
 * announced. Without JS it never appears (`js-only`), since nothing could reveal it.
 */
export function BackToTop({ label }: BackToTopProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry?.isIntersecting))
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (goToSection('top')) event.preventDefault()
  }

  return (
    <a
      href="#top"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'glass js-only fixed right-[max(18px,env(safe-area-inset-right,0px))] bottom-[calc(18px+env(safe-area-inset-bottom,0px))] z-30 inline-flex size-12.5 items-center justify-center rounded-full border-rim text-accent transition-[opacity,visibility,border-color] duration-250 hover:border-accent',
        visible ? 'visible opacity-100' : 'invisible opacity-0',
      )}
    >
      <ArrowUpIcon size={20} />
    </a>
  )
}
