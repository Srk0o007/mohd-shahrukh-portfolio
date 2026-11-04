'use client'

import { useEffect, useRef } from 'react'

/**
 * Decorative 3D particle wave behind the whole page (ADR 0015).
 * - The canvas is fixed to the viewport, below all content (`-z-10`), `pointer-events: none`
 *   and `aria-hidden`: it never blocks clicks, focus or reading order.
 * - The engine is a separate chunk imported once the browser is idle after load, so it adds
 *   nothing to the first-load JS budget (NFR-PERF-05) and cannot delay LCP.
 * - `100lvh` keeps the canvas from resizing when mobile browser bars show or hide.
 * - Hidden in forced-colours mode and print.
 */
export function ParticleWaveLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let disposed = false
    let destroy: (() => void) | undefined

    const boot = () => {
      void import('@/lib/particle-wave').then(({ createParticleWave }) => {
        const canvas = canvasRef.current
        if (disposed || !canvas) return
        destroy = createParticleWave(canvas)?.destroy
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="particle-wave"
      className="pointer-events-none fixed top-0 left-0 -z-10 h-lvh w-full print:hidden forced-colors:hidden"
    />
  )
}
