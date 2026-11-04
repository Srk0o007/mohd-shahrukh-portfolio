import { describe, expect, it } from 'vitest'
import {
  isMilestoneLit,
  isNearViewport,
  journeyProgress,
  parallaxOffset,
  staggerDelay,
} from './math'

const desktop = { width: 1440, height: 900 }
const phone = { width: 390, height: 844 }

describe('parallaxOffset', () => {
  it('is zero when the parent is centred in the viewport', () => {
    expect(parallaxOffset({ top: 350, height: 200 }, desktop, 0.18)).toBe(0)
  })

  it('scales the distance from the centre by the speed', () => {
    // Parent centre 550, viewport centre 450 → 100 px × 0.2
    expect(parallaxOffset({ top: 450, height: 200 }, desktop, 0.2)).toBeCloseTo(20)
    expect(parallaxOffset({ top: 250, height: 200 }, desktop, 0.2)).toBeCloseTo(-20)
  })

  it('moves at 35 % on phones', () => {
    // Parent centre 522, viewport centre 422 → 100 px × 0.2 × 0.35
    expect(parallaxOffset({ top: 422, height: 200 }, phone, 0.2)).toBeCloseTo(7)
  })

  it('ignores a missing or invalid speed', () => {
    expect(parallaxOffset({ top: 900, height: 200 }, desktop, Number.NaN)).toBe(0)
  })
})

describe('isNearViewport', () => {
  it('keeps boxes within 200 px of the viewport', () => {
    expect(isNearViewport({ top: 100, bottom: 400 }, 900)).toBe(true)
    expect(isNearViewport({ top: -500, bottom: -150 }, 900)).toBe(true)
    expect(isNearViewport({ top: 1050, bottom: 1400 }, 900)).toBe(true)
  })

  it('skips boxes far outside it', () => {
    expect(isNearViewport({ top: -800, bottom: -201 }, 900)).toBe(false)
    expect(isNearViewport({ top: 1101, bottom: 1500 }, 900)).toBe(false)
  })
})

describe('journeyProgress', () => {
  it('is 0 before the journey reaches 60 % of the viewport', () => {
    expect(journeyProgress(800, 1000, 1000)).toBe(0)
  })

  it('grows with scroll and clamps at 1', () => {
    expect(journeyProgress(100, 1000, 1000)).toBeCloseTo(0.5)
    expect(journeyProgress(-2000, 1000, 1000)).toBe(1)
  })

  it('is full for an empty journey', () => {
    expect(journeyProgress(0, 0, 1000)).toBe(1)
  })
})

describe('isMilestoneLit', () => {
  it('lights a node once the fill reaches it, with a 2 px tolerance', () => {
    expect(isMilestoneLit(0.5, 1000, 498)).toBe(true)
    expect(isMilestoneLit(0.5, 1000, 502)).toBe(true)
    expect(isMilestoneLit(0.5, 1000, 503)).toBe(false)
  })

  it('lights every node when the journey is full', () => {
    expect(isMilestoneLit(1, 1000, 990)).toBe(true)
  })
})

describe('staggerDelay', () => {
  it('adds 90 ms per sibling, capped at five steps', () => {
    expect(staggerDelay(0)).toBe(0)
    expect(staggerDelay(2)).toBe(180)
    expect(staggerDelay(5)).toBe(450)
    expect(staggerDelay(12)).toBe(450)
  })

  it('treats a negative index as the first sibling', () => {
    expect(staggerDelay(-1)).toBe(0)
  })
})
