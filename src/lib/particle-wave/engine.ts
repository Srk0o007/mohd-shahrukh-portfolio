import {
  lookAt,
  pickGround,
  project,
  stepSpring,
  type CameraBasis,
  type Projected,
  type SpringState,
} from './camera'
import { buildGridWithinBudget, type Grid } from './grid'
import { RippleField } from './ripple'

/**
 * 3D particle wave background (ADR 0015) — the effect in the owner's reference video:
 * a perspective plane of dots under a camera that eases towards the pointer (the whole surface
 * tilts and settles with a soft bounce), crossing sine waves that travel continuously, dot size
 * following the wave crests, and liquid ripples spreading from the pointer through the surface.
 *
 * Canvas 2D, no dependencies. Per frame: one pass to animate and project the points into typed
 * arrays (no allocation), then ≈ 12 fills — one path per opacity band — and no shadows.
 */

/* ---------- Tuning (world units; the reference used 100-unit spacing) ---------- */

const FOV = 70
const CAM_Z = 1000
/** Rest height puts the horizon just above the top edge so the plane fills the viewport. */
const REST_Y = 680
const SWING_X = 420
/** Pointer up raises the camera more than pointer down lowers it (keeps the top covered). */
const SWING_UP = 210
const SWING_DOWN = 120
const TARGET = { x: 0, y: 0, z: 0 }
const SPRING_STIFFNESS = 13
const SPRING_DAMPING_RATIO = 0.62

const FAR_Z = -4600
const NEAR_Z = CAM_Z
const MAX_X = 9000
const BASE_SPACING = 78

/* Travelling waves: two crossing sines (as in the reference) plus a slow diagonal swell. */
const KX = 0.003
const KZ = 0.005
const WX = 1.5
const WZ = 2.3
const AMP = 60
const KS_X = 0.0009
const KS_Z = 0.0007
const WS = 0.55
const AMP_SWELL = 40

/* Dot radius in world units: crests are larger than troughs. */
const R_MIN = 2.6
const R_RANGE = 8.5

/* Liquid ripples. */
const RIPPLE_CELL = 60
const RIPPLE_STEPS_PER_SECOND = 22
const RIPPLE_DAMPING = 0.974
const RIPPLE_IMPULSE = 30
const RIPPLE_GAIN = 3.2
const RIPPLE_MAX = 120

/* Opacity. */
const BANDS = 12
const NEAR_FADE = 5200
const FAR_FADE_START = 4300
const FAR_FADE_END = 6000
const FADE_IN_SECONDS = 0.9

const IDLE_AFTER_MS = 5000

export interface ParticleWaveHandle {
  destroy(): void
}

interface Theme {
  rgb: string
  alpha: number
}

function readTheme(root: HTMLElement): Theme {
  const style = getComputedStyle(root)
  const rgb =
    style
      .getPropertyValue('--particle-rgb')
      .trim()
      .split(/[\s,]+/)
      .join(',') || '255,200,61'
  const alpha = Number.parseFloat(style.getPropertyValue('--particle-alpha')) || 0.8
  return { rgb, alpha }
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v
}

/**
 * Starts the effect on `canvas` (sized by CSS; fixed behind the page). Returns null when a 2D
 * context is unavailable. Honours `prefers-reduced-motion` (a single static frame, redrawn on
 * resize and theme change), pauses while the tab is hidden, and cleans up on `destroy()`.
 */
export function createParticleWave(canvas: HTMLCanvasElement): ParticleWaveHandle | null {
  const context = canvas.getContext('2d', { alpha: true })
  if (!context) return null
  // A non-null binding that the hoisted helpers below can close over.
  const ctx: CanvasRenderingContext2D = context

  const root = document.documentElement
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

  let width = 0
  let height = 0
  let dpr = 1
  let grid: Grid = { xs: new Float32Array(0), zs: new Float32Array(0), count: 0 }
  let budgetScale = 1
  let sx = new Float32Array(0)
  let sy = new Float32Array(0)
  let sr = new Float32Array(0)
  let band = new Uint8Array(0)
  let theme = readTheme(root)
  let bandStyles: string[] = []
  const bandCounts = new Uint32Array(BANDS)

  const ripple = new RippleField({
    minX: -3600,
    maxX: 3600,
    minZ: -2600,
    maxZ: NEAR_Z,
    cell: RIPPLE_CELL,
    damping: RIPPLE_DAMPING,
  })

  const camX: SpringState = { value: 0, velocity: 0 }
  const camY: SpringState = { value: REST_Y, velocity: 0 }
  let cam: CameraBasis = lookAt({ x: 0, y: REST_Y, z: CAM_Z }, TARGET, FOV, 1, 1)
  const scratch: Projected = { x: 0, y: 0, depth: 0, scale: 0 }

  const pointer = { x: 0, y: 0, nx: 0, ny: 0, lastMove: -Infinity, speed: 0, dirty: false }
  let lastHit: { x: number; z: number } | null = null
  let time = 0
  let phaseZ = 0
  let fade = 0
  let rippleClock = 0
  let lastScrollY = window.scrollY
  let raf = 0
  let lastFrame = 0
  let running = false
  let slowFrames = 0
  let sampledFrames = 0

  /* ---------- Sizing ---------- */

  function rebuild() {
    width = canvas.clientWidth || window.innerWidth
    height = canvas.clientHeight || window.innerHeight
    const mobile = width < 768
    dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Point budget follows viewport area: ≈ 6,200 on a 1440 × 900 desktop, fewer on phones.
    const area = (width * height) / (1440 * 900)
    const budget = clamp(Math.round(6200 * area * budgetScale), 1800, 7000)
    const poses = [
      { x: 0, y: REST_Y, z: CAM_Z },
      { x: -SWING_X * 1.15, y: REST_Y - SWING_DOWN * 1.15, z: CAM_Z },
      { x: SWING_X * 1.15, y: REST_Y - SWING_DOWN * 1.15, z: CAM_Z },
      { x: -SWING_X * 1.15, y: REST_Y + SWING_UP * 1.15, z: CAM_Z },
      { x: SWING_X * 1.15, y: REST_Y + SWING_UP * 1.15, z: CAM_Z },
    ]
    grid = buildGridWithinBudget(
      {
        width,
        height,
        fov: FOV,
        poses,
        target: TARGET,
        farZ: FAR_Z,
        nearZ: NEAR_Z,
        maxX: MAX_X,
        margin: Math.max(60, height * 0.12),
      },
      BASE_SPACING,
      budget,
    ).grid
    // Exposed for tests and debugging (point count after fitting to the viewport).
    canvas.dataset.points = String(grid.count)
    sx = new Float32Array(grid.count)
    sy = new Float32Array(grid.count)
    sr = new Float32Array(grid.count)
    band = new Uint8Array(grid.count)
  }

  function updateBandStyles() {
    const a = theme.alpha * fade
    bandStyles = Array.from(
      { length: BANDS },
      (_, i) => `rgba(${theme.rgb},${(((i + 1) / BANDS) * a).toFixed(3)})`,
    )
  }

  /* ---------- Simulation ---------- */

  function updateCamera(dt: number, now: number) {
    let tx: number
    let ty: number
    const idle = !finePointer.matches || now - pointer.lastMove > IDLE_AFTER_MS
    if (idle) {
      // Slow drift so the surface keeps breathing on touch devices and when the mouse rests.
      tx = Math.sin(time * 0.21) * 0.35
      ty = Math.sin(time * 0.16 + 1.3) * 0.3
    } else {
      tx = pointer.nx
      ty = pointer.ny
    }
    // Pointer up → camera rises and looks down onto the surface (the reference's mapping).
    stepSpring(camX, tx * SWING_X, SPRING_STIFFNESS, SPRING_DAMPING_RATIO, dt)
    const lift = ty < 0 ? -ty * SWING_UP : -ty * SWING_DOWN
    stepSpring(camY, REST_Y + lift, SPRING_STIFFNESS, SPRING_DAMPING_RATIO, dt)
    cam = lookAt({ x: camX.value, y: camY.value, z: CAM_Z }, TARGET, FOV, width, height)
  }

  function injectRipples() {
    if (!pointer.dirty) return
    pointer.dirty = false
    const hit = pickGround(cam, pointer.x, pointer.y)
    if (!hit) {
      lastHit = null
      return
    }
    const amount = RIPPLE_IMPULSE * clamp(pointer.speed / 1400, 0.18, 1.2)
    // Fill the path since the last sample so a fast stroke leaves a continuous wake.
    if (lastHit) {
      const dx = hit.x - lastHit.x
      const dz = hit.z - lastHit.z
      const steps = Math.min(12, Math.ceil(Math.hypot(dx, dz) / (RIPPLE_CELL * 1.5)))
      for (let i = 1; i <= steps; i++) {
        ripple.impulse(lastHit.x + (dx * i) / steps, lastHit.z + (dz * i) / steps, amount / steps)
      }
    } else {
      ripple.impulse(hit.x, hit.z, amount)
    }
    lastHit = hit
  }

  function splash(x: number, y: number) {
    const hit = pickGround(cam, x, y)
    if (hit) ripple.impulse(hit.x, hit.z, RIPPLE_IMPULSE * 1.6, 3.2)
  }

  /* ---------- Frame ---------- */

  function computeAndDraw(t: number) {
    const { xs, zs, count } = grid
    const marginX = width + 20
    const marginY = height + 20
    bandCounts.fill(0)

    for (let i = 0; i < count; i++) {
      const x = xs[i] ?? 0
      const z = zs[i] ?? 0
      const s1 = Math.sin(x * KX + t * WX)
      const s2 = Math.sin(z * KZ + t * WZ + phaseZ)
      const swell = Math.sin(x * KS_X + z * KS_Z - t * WS + phaseZ * 0.5)
      const rippleHeight = clamp(ripple.sample(x, z) * RIPPLE_GAIN, -RIPPLE_MAX, RIPPLE_MAX)
      const y = (s1 + s2) * AMP + swell * AMP_SWELL + rippleHeight

      project(cam, x, y, z, scratch)
      band[i] = 255
      if (scratch.depth <= 1) continue
      const px = scratch.x
      const py = scratch.y
      if (px < -20 || px > marginX || py < -20 || py > marginY) continue

      const crest = (s1 + s2 + 2) * 0.25 // 0 … 1
      const lift = clamp(rippleHeight / RIPPLE_MAX, -0.5, 1)
      const radius = (R_MIN + R_RANGE * crest) * (1 + lift * 0.55) * scratch.scale
      if (radius < 0.25) continue

      const d = scratch.depth
      let alpha = clamp(1.2 - d / NEAR_FADE, 0.18, 1)
      if (d > FAR_FADE_START)
        alpha *= clamp((FAR_FADE_END - d) / (FAR_FADE_END - FAR_FADE_START), 0, 1)
      alpha *= 0.78 + 0.22 * crest + Math.max(0, lift) * 0.3
      if (alpha < 0.04) continue

      sx[i] = px
      sy[i] = py
      sr[i] = Math.min(radius, 14)
      const b = Math.min(BANDS - 1, (alpha * BANDS) | 0)
      band[i] = b
      bandCounts[b] = (bandCounts[b] ?? 0) + 1
    }

    ctx.clearRect(0, 0, width, height)
    const TAU = Math.PI * 2
    for (let b = 0; b < BANDS; b++) {
      if (!bandCounts[b]) continue
      ctx.beginPath()
      for (let i = 0; i < count; i++) {
        if (band[i] !== b) continue
        const r = sr[i] ?? 0
        const x = sx[i] ?? 0
        const y = sy[i] ?? 0
        if (r < 1.1) {
          ctx.rect(x - r, y - r, r * 2, r * 2)
        } else {
          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, TAU)
        }
      }
      ctx.fillStyle = bandStyles[b] ?? 'transparent'
      ctx.fill()
    }
  }

  function frame(now: number) {
    raf = window.requestAnimationFrame(frame)
    const elapsed = lastFrame ? now - lastFrame : 16.7
    lastFrame = now
    const dt = Math.min(elapsed / 1000, 1 / 20)
    time += dt

    if (fade < 1) {
      fade = Math.min(1, fade + dt / FADE_IN_SECONDS)
      updateBandStyles()
    }

    updateCamera(dt, now)
    rippleClock += dt
    const stepTime = 1 / RIPPLE_STEPS_PER_SECOND
    while (rippleClock >= stepTime) {
      injectRipples()
      ripple.step()
      rippleClock -= stepTime
    }
    computeAndDraw(time)
    adaptQuality(elapsed)
  }

  /** If frames are consistently slow (low-end device), thin the grid — at most twice. */
  function adaptQuality(elapsed: number) {
    if (budgetScale <= 0.5 || elapsed > 200) return
    sampledFrames++
    if (elapsed > 26) slowFrames++
    if (sampledFrames >= 120) {
      if (slowFrames > 80) {
        budgetScale *= 0.7
        rebuild()
      }
      sampledFrames = 0
      slowFrames = 0
    }
  }

  function drawStatic() {
    fade = 1
    updateBandStyles()
    cam = lookAt({ x: 0, y: REST_Y, z: CAM_Z }, TARGET, FOV, width, height)
    computeAndDraw(1.2)
  }

  function start() {
    if (running || reducedMotion.matches || document.hidden) return
    running = true
    lastFrame = 0
    raf = window.requestAnimationFrame(frame)
  }

  function stop() {
    running = false
    window.cancelAnimationFrame(raf)
  }

  /* ---------- Events ---------- */

  function onPointerMove(event: PointerEvent) {
    const now = performance.now()
    const dtMs = Math.max(8, now - (pointer.lastMove === -Infinity ? now : pointer.lastMove))
    const dist = Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y)
    pointer.speed = pointer.speed * 0.6 + (dist / dtMs) * 1000 * 0.4
    pointer.x = event.clientX
    pointer.y = event.clientY
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      pointer.nx = clamp((event.clientX / width) * 2 - 1, -1, 1)
      pointer.ny = clamp((event.clientY / height) * 2 - 1, -1, 1)
      pointer.lastMove = now
    }
    pointer.dirty = true
  }

  function onPointerDown(event: PointerEvent) {
    if (!running) return
    pointer.x = event.clientX
    pointer.y = event.clientY
    lastHit = null
    splash(event.clientX, event.clientY)
  }

  function onPointerOut(event: PointerEvent) {
    // Leaving the window: let the camera drift instead of holding the last edge position.
    if (!event.relatedTarget) {
      pointer.lastMove = -Infinity
      lastHit = null
    }
  }

  function onScroll() {
    const y = window.scrollY
    // Scrolling moves the waves forward, so the surface flows with the page.
    phaseZ += clamp(y - lastScrollY, -400, 400) * 0.004
    lastScrollY = y
  }

  let resizeRaf = 0
  function onResize() {
    window.cancelAnimationFrame(resizeRaf)
    resizeRaf = window.requestAnimationFrame(() => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w === width && h === height) return
      rebuild()
      ripple.clear()
      if (!running) drawStatic()
    })
  }

  function onVisibility() {
    if (document.hidden) stop()
    else start()
  }

  function onMotionPreference() {
    if (reducedMotion.matches) {
      stop()
      drawStatic()
    } else {
      fade = 0
      updateBandStyles()
      start()
    }
  }

  const themeObserver = new MutationObserver(() => {
    theme = readTheme(root)
    updateBandStyles()
    if (!running) drawStatic()
  })

  /* ---------- Boot ---------- */

  rebuild()
  updateBandStyles()
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerdown', onPointerDown, { passive: true })
  document.addEventListener('pointerout', onPointerOut, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  reducedMotion.addEventListener('change', onMotionPreference)
  themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

  if (reducedMotion.matches) drawStatic()
  else start()

  return {
    destroy() {
      stop()
      window.cancelAnimationFrame(resizeRaf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      reducedMotion.removeEventListener('change', onMotionPreference)
      themeObserver.disconnect()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    },
  }
}
