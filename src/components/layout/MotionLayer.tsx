'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Loads the scroll-motion module (ADR 0016) once the browser is idle after load: header
 * density, parallax, scroll reveal and the education journey. It is a separate chunk, so it
 * adds nothing to the first-load JS budget (NFR-PERF-05), and it renders nothing. It restarts
 * on route changes so the new page's elements are picked up.
 */
export function MotionLayer() {
  const pathname = usePathname()

  useEffect(() => {
    let disposed = false
    let destroy: (() => void) | undefined

    const boot = () => {
      void import('@/lib/motion').then(({ createMotion }) => {
        if (disposed) return
        destroy = createMotion().destroy
      })
    }

    // Safari has no requestIdleCallback: fall back to a short timeout after load.
    const hasIdle = typeof window.requestIdleCallback === 'function'
    let pending: number | undefined
    const onLoad = () => {
      pending = hasIdle
        ? window.requestIdleCallback(boot, { timeout: 1500 })
        : window.setTimeout(boot, 300)
    }
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })

    return () => {
      disposed = true
      window.removeEventListener('load', onLoad)
      if (pending !== undefined) {
        if (hasIdle) window.cancelIdleCallback(pending)
        else window.clearTimeout(pending)
      }
      destroy?.()
    }
  }, [pathname])

  return null
}
