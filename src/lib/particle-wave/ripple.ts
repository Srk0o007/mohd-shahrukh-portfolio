/**
 * Liquid ripple surface (ADR 0015): a damped 2D wave equation on a regular grid laid over the
 * particle plane. Pointer movement drops soft impulses; each cell is driven by its neighbours,
 * so rings travel outwards, interfere and fade like water — one connected surface rather than
 * particles pushed apart. Pure maths, no DOM: unit-tested in ripple.test.ts.
 */

export interface RippleOptions {
  /** World-space extent covered by the field. */
  minX: number
  maxX: number
  minZ: number
  maxZ: number
  /** World units per cell. */
  cell: number
  /** Energy kept per step (0–1). */
  damping: number
}

export class RippleField {
  readonly cols: number
  readonly rows: number
  private current: Float32Array
  private previous: Float32Array
  private readonly opts: RippleOptions

  constructor(opts: RippleOptions) {
    this.opts = opts
    this.cols = Math.max(3, Math.ceil((opts.maxX - opts.minX) / opts.cell) + 1)
    this.rows = Math.max(3, Math.ceil((opts.maxZ - opts.minZ) / opts.cell) + 1)
    this.current = new Float32Array(this.cols * this.rows)
    this.previous = new Float32Array(this.cols * this.rows)
  }

  /** Adds a Gaussian bump of `amount` centred on world (x, z) with `radius` in cells. */
  impulse(x: number, z: number, amount: number, radius = 2.5): void {
    const { minX, minZ, cell } = this.opts
    const gx = (x - minX) / cell
    const gz = (z - minZ) / cell
    const reach = Math.ceil(radius * 2)
    const c0 = Math.max(1, Math.floor(gx) - reach)
    const c1 = Math.min(this.cols - 2, Math.ceil(gx) + reach)
    const r0 = Math.max(1, Math.floor(gz) - reach)
    const r1 = Math.min(this.rows - 2, Math.ceil(gz) + reach)
    const inv = 1 / (2 * radius * radius)
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const d2 = (c - gx) * (c - gx) + (r - gz) * (r - gz)
        const k = r * this.cols + c
        this.current[k] = (this.current[k] ?? 0) + amount * Math.exp(-d2 * inv)
      }
    }
  }

  /** One step of the classic two-buffer water algorithm; borders stay at rest (absorbing). */
  step(): void {
    const { cols, rows } = this
    const cur = this.current
    const prev = this.previous
    const damping = this.opts.damping
    for (let r = 1; r < rows - 1; r++) {
      const row = r * cols
      for (let c = 1; c < cols - 1; c++) {
        const i = row + c
        const sum =
          (cur[i - 1] ?? 0) + (cur[i + 1] ?? 0) + (cur[i - cols] ?? 0) + (cur[i + cols] ?? 0)
        const next = (sum * 0.5 - (prev[i] ?? 0)) * damping
        prev[i] = next
      }
    }
    // The buffer just written becomes current.
    this.previous = cur
    this.current = prev
  }

  /** Bilinear height at world (x, z); 0 outside the field. */
  sample(x: number, z: number): number {
    const { minX, minZ, cell } = this.opts
    const gx = (x - minX) / cell
    const gz = (z - minZ) / cell
    if (gx < 0 || gz < 0 || gx >= this.cols - 1 || gz >= this.rows - 1) return 0
    const c = gx | 0
    const r = gz | 0
    const fx = gx - c
    const fz = gz - r
    const i = r * this.cols + c
    const a = this.current[i] ?? 0
    const b = this.current[i + 1] ?? 0
    const d = this.current[i + this.cols] ?? 0
    const e = this.current[i + this.cols + 1] ?? 0
    return (a * (1 - fx) + b * fx) * (1 - fz) + (d * (1 - fx) + e * fx) * fz
  }

  /** Total absolute height: used by tests to check propagation and decay. */
  energy(): number {
    let sum = 0
    for (const v of this.current) sum += Math.abs(v)
    return sum
  }

  clear(): void {
    this.current.fill(0)
    this.previous.fill(0)
  }
}
