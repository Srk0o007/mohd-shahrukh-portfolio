import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ParticleWaveLayer } from './ParticleWaveLayer'

describe('ParticleWaveLayer (ADR 0015)', () => {
  it('renders a decorative canvas that never takes pointer events', () => {
    const { getByTestId } = render(<ParticleWaveLayer />)
    const canvas = getByTestId('particle-wave')
    expect(canvas.tagName).toBe('CANVAS')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(canvas).toHaveClass('pointer-events-none', 'fixed', '-z-10')
  })

  it('stays out of forced-colours mode and print', () => {
    const { getByTestId } = render(<ParticleWaveLayer />)
    expect(getByTestId('particle-wave')).toHaveClass('forced-colors:hidden', 'print:hidden')
  })
})
