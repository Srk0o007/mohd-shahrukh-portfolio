import { lookAt, project, type Projected, type Vec3 } from './camera'

/**
 * Builds the particle plane for the current viewport (ADR 0015). A regular grid is laid on
 * y = 0 and only the points that can appear on screen — for any camera pose the pointer can
 * reach — are kept. Near rows end up narrow and far rows wide (the frustum's trapezoid), so the
 * plane always fills the viewport to its corners without spending points off screen.
 */

export interface GridSpec {
  width: number
  height: number
  fov: number
  /** Camera poses the pointer can reach (rest and extremes). */
  poses: readonly Vec3[]
  target: Vec3
  /** Grid spacing in world units. */
  spacing: number
  /** Farthest row (most negative z) and the x half-extent searched. */
  farZ: number
  nearZ: number
  maxX: number
  /** Extra screen margin in px so waves and ripples never reveal an edge. */
  margin: number
}

export interface Grid {
  xs: Float32Array
  zs: Float32Array
  count: number
}

export function buildGrid(spec: GridSpec): Grid {
  const cams = spec.poses.map((pose) =>
    lookAt(pose, spec.target, spec.fov, spec.width, spec.height),
  )
  const out: Projected = { x: 0, y: 0, depth: 0, scale: 0 }
  const xs: number[] = []
  const zs: number[] = []
  const left = -spec.margin
  const right = spec.width + spec.margin
  const top = -spec.margin
  const bottom = spec.height + spec.margin
  const half = Math.floor(spec.maxX / spec.spacing)

  for (let z = spec.farZ; z <= spec.nearZ; z += spec.spacing) {
    for (let i = -half; i <= half; i++) {
      const x = i * spec.spacing
      for (const cam of cams) {
        project(cam, x, 0, z, out)
        if (out.depth > 1 && out.x >= left && out.x <= right && out.y >= top && out.y <= bottom) {
          xs.push(x)
          zs.push(z)
          break
        }
      }
    }
  }
  return { xs: Float32Array.from(xs), zs: Float32Array.from(zs), count: xs.length }
}

/**
 * Picks a spacing so the visible point count stays within `budget`: starts at `base` and
 * widens by 12 % until it fits (at most a few rebuilds, only on resize).
 */
export function buildGridWithinBudget(
  spec: Omit<GridSpec, 'spacing'>,
  base: number,
  budget: number,
) {
  let spacing = base
  let grid = buildGrid({ ...spec, spacing })
  for (let attempt = 0; grid.count > budget && attempt < 8; attempt++) {
    spacing *= 1.12
    grid = buildGrid({ ...spec, spacing })
  }
  return { grid, spacing }
}
