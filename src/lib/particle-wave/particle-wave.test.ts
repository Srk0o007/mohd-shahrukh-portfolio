import { describe, expect, it } from 'vitest'
import { lookAt, pickGround, project, stepSpring, type Projected } from './camera'
import { buildGrid, buildGridWithinBudget } from './grid'
import { RippleField } from './ripple'

const out = (): Projected => ({ x: 0, y: 0, depth: 0, scale: 0 })

describe('particle wave camera (ADR 0015)', () => {
  const cam = lookAt({ x: 0, y: 680, z: 1000 }, { x: 0, y: 0, z: 0 }, 70, 1440, 900)

  it('projects the look-at target to the viewport centre', () => {
    const p = project(cam, 0, 0, 0, out())
    expect(p.x).toBeCloseTo(720, 5)
    expect(p.y).toBeCloseTo(450, 5)
    expect(p.depth).toBeCloseTo(Math.hypot(680, 1000), 5)
  })

  it('draws nearer points larger (perspective) and rejects points behind the camera', () => {
    const near = project(cam, 0, 0, 600, out()).scale
    const far = project(cam, 0, 0, -3000, out()).scale
    expect(near).toBeGreaterThan(far * 3)
    expect(project(cam, 0, 0, 3000, out()).scale).toBe(0)
  })

  it('puts the right side of the plane on the right of the screen', () => {
    expect(project(cam, 500, 0, 0, out()).x).toBeGreaterThan(720)
    expect(project(cam, -500, 0, 0, out()).x).toBeLessThan(720)
  })

  it('picks the ground point under a screen position (inverse of the projection)', () => {
    const p = project(cam, 340, 0, -820, out())
    const hit = pickGround(cam, p.x, p.y)
    expect(hit?.x).toBeCloseTo(340, 3)
    expect(hit?.z).toBeCloseTo(-820, 3)
  })

  it('returns no ground point above the horizon', () => {
    const up = lookAt({ x: 0, y: 200, z: 1000 }, { x: 0, y: 200, z: 0 }, 70, 800, 600)
    expect(pickGround(up, 400, 10)).toBeNull()
  })

  it('springs settle on the target with a small overshoot, independent of frame rate', () => {
    const run = (dt: number) => {
      const s = { value: 0, velocity: 0 }
      let peak = 0
      for (let t = 0; t < 3; t += dt) {
        stepSpring(s, 100, 13, 0.62, dt)
        peak = Math.max(peak, s.value)
      }
      return { value: s.value, peak }
    }
    const at60 = run(1 / 60)
    const at144 = run(1 / 144)
    expect(at60.value).toBeCloseTo(100, 0)
    expect(at60.peak).toBeGreaterThan(100) // the soft "bounce"
    expect(at60.peak).toBeLessThan(115)
    expect(Math.abs(at60.peak - at144.peak)).toBeLessThan(1.5)
  })
})

describe('particle wave grid (ADR 0015)', () => {
  const spec = {
    width: 1440,
    height: 900,
    fov: 70,
    poses: [{ x: 0, y: 680, z: 1000 }],
    target: { x: 0, y: 0, z: 0 },
    farZ: -4600,
    nearZ: 1000,
    maxX: 9000,
    margin: 100,
  }

  it('keeps only points that land on screen', () => {
    const grid = buildGrid({ ...spec, spacing: 100 })
    const cam = lookAt(spec.poses[0] ?? { x: 0, y: 0, z: 0 }, spec.target, 70, 1440, 900)
    expect(grid.count).toBeGreaterThan(500)
    for (let i = 0; i < grid.count; i += 37) {
      const p = project(cam, grid.xs[i] ?? 0, 0, grid.zs[i] ?? 0, out())
      expect(p.x).toBeGreaterThanOrEqual(-100)
      expect(p.x).toBeLessThanOrEqual(1540)
      expect(p.y).toBeGreaterThanOrEqual(-100)
      expect(p.y).toBeLessThanOrEqual(1000)
    }
  })

  it('covers the bottom corners and the top of the viewport (full-page coverage)', () => {
    const grid = buildGrid({ ...spec, spacing: 80 })
    const cam = lookAt(spec.poses[0] ?? { x: 0, y: 0, z: 0 }, spec.target, 70, 1440, 900)
    const pts = Array.from({ length: grid.count }, (_, i) =>
      project(cam, grid.xs[i] ?? 0, 0, grid.zs[i] ?? 0, out()),
    ).map((p) => ({ x: p.x, y: p.y }))
    const near = (x: number, y: number) =>
      pts.some((p) => Math.abs(p.x - x) < 120 && Math.abs(p.y - y) < 120)
    expect(near(0, 900)).toBe(true)
    expect(near(1440, 900)).toBe(true)
    expect(near(0, 60)).toBe(true)
    expect(near(1440, 60)).toBe(true)
  })

  it('stays within the point budget by widening the spacing', () => {
    const { grid, spacing } = buildGridWithinBudget(spec, 60, 3000)
    expect(grid.count).toBeLessThanOrEqual(3000)
    expect(spacing).toBeGreaterThan(60)
  })
})

describe('liquid ripple field (ADR 0015)', () => {
  const make = () =>
    new RippleField({ minX: -1200, maxX: 1200, minZ: -1200, maxZ: 1200, cell: 60, damping: 0.974 })

  it('is flat until disturbed', () => {
    expect(make().energy()).toBe(0)
  })

  it('spreads an impulse outwards as a ring through neighbouring cells', () => {
    const field = make()
    field.impulse(0, 0, 40)
    expect(Math.abs(field.sample(600, 0))).toBeLessThan(1e-6)
    for (let i = 0; i < 14; i++) field.step()
    expect(Math.abs(field.sample(600, 0)) + Math.abs(field.sample(540, 0))).toBeGreaterThan(0.5)
  })

  it('fades out over time (damped)', () => {
    const field = make()
    field.impulse(0, 0, 40)
    for (let i = 0; i < 5; i++) field.step()
    const early = field.energy()
    for (let i = 0; i < 300; i++) field.step()
    expect(field.energy()).toBeLessThan(early * 0.05)
  })

  it('samples 0 outside its extent', () => {
    const field = make()
    field.impulse(0, 0, 40)
    expect(field.sample(5000, 0)).toBe(0)
  })
})
