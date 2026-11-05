/**
 * Perspective camera for the particle wave (ADR 0015). A camera at `position` looking at
 * `target`, with a vertical field of view; points are projected to CSS pixels.
 * Pure maths, no DOM: unit-tested in camera.test.ts.
 */

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface CameraBasis {
  position: Vec3
  /** Unit vectors: right, up and forward (towards the target). */
  right: Vec3
  up: Vec3
  forward: Vec3
  /** Focal length in pixels: (viewport height / 2) / tan(fov / 2). */
  focal: number
  /** Viewport centre in pixels. */
  cx: number
  cy: number
}

const WORLD_UP: Vec3 = { x: 0, y: 1, z: 0 }

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1
  return { x: v.x / len, y: v.y / len, z: v.z / len }
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x }
}

/** Builds the view basis for a look-at camera (the three.js `lookAt` convention). */
export function lookAt(
  position: Vec3,
  target: Vec3,
  fovDeg: number,
  width: number,
  height: number,
): CameraBasis {
  const forward = normalize({
    x: target.x - position.x,
    y: target.y - position.y,
    z: target.z - position.z,
  })
  const right = normalize(cross(forward, WORLD_UP))
  const up = cross(right, forward)
  const focal = height / 2 / Math.tan((fovDeg * Math.PI) / 360)
  return { position, right, up, forward, focal, cx: width / 2, cy: height / 2 }
}

/** Projection result written into a reusable object (no allocation in the frame loop). */
export interface Projected {
  x: number
  y: number
  /** Distance along the view direction; ≤ 0 means behind the camera. */
  depth: number
  /** Pixels per world unit at this depth. */
  scale: number
}

export function project(cam: CameraBasis, px: number, py: number, pz: number, out: Projected) {
  const dx = px - cam.position.x
  const dy = py - cam.position.y
  const dz = pz - cam.position.z
  const depth = dx * cam.forward.x + dy * cam.forward.y + dz * cam.forward.z
  out.depth = depth
  if (depth <= 1) {
    out.scale = 0
    return out
  }
  const scale = cam.focal / depth
  out.scale = scale
  out.x = cam.cx + (dx * cam.right.x + dy * cam.right.y + dz * cam.right.z) * scale
  out.y = cam.cy - (dx * cam.up.x + dy * cam.up.y + dz * cam.up.z) * scale
  return out
}

/**
 * Where the ray through screen point (sx, sy) meets the plane y = 0, or null when the ray
 * points at or above the horizon. Used to place pointer ripples on the surface.
 */
export function pickGround(
  cam: CameraBasis,
  sx: number,
  sy: number,
): { x: number; z: number } | null {
  const ox = (sx - cam.cx) / cam.focal
  const oy = (cam.cy - sy) / cam.focal
  const dx = cam.forward.x + cam.right.x * ox + cam.up.x * oy
  const dy = cam.forward.y + cam.right.y * ox + cam.up.y * oy
  const dz = cam.forward.z + cam.right.z * ox + cam.up.z * oy
  if (dy >= -1e-4) return null
  const t = -cam.position.y / dy
  return { x: cam.position.x + dx * t, z: cam.position.z + dz * t }
}

/** One axis of a damped spring; slightly under-damped gives the soft "liquid" settle. */
export interface SpringState {
  value: number
  velocity: number
}

export function stepSpring(
  s: SpringState,
  target: number,
  stiffness: number,
  dampingRatio: number,
  dt: number,
): void {
  const damping = 2 * dampingRatio * Math.sqrt(stiffness)
  // Semi-implicit Euler in ≤ 1/120 s steps: stable and frame-rate independent.
  let remaining = dt
  while (remaining > 0) {
    const h = Math.min(remaining, 1 / 120)
    const accel = stiffness * (target - s.value) - damping * s.velocity
    s.velocity += accel * h
    s.value += s.velocity * h
    remaining -= h
  }
}
