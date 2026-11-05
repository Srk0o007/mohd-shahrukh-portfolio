import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMotion } from './index'

type Box = { top: number; height: number }

/** jsdom lays nothing out: give each element a box keyed by its id. */
function placeBoxes(boxes: Record<string, Box>) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const box = boxes[this.id] ?? { top: 0, height: 0 }
    return {
      top: box.top,
      bottom: box.top + box.height,
      height: box.height,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: box.top,
      toJSON: () => ({}),
    } as DOMRect
  })
}

let observed: Element[] = []

beforeEach(() => {
  observed = []
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe(element: Element) {
        observed.push(element)
      }
      disconnect() {}
    },
  )
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
  document.body.innerHTML = `
    <header id="site-header"></header>
    <h2 id="above" data-reveal="">On screen at load</h2>
    <ul data-stagger="">
      <li><article id="first" data-reveal=""></article></li>
      <li><article id="third" data-reveal=""></article></li>
    </ul>
    <p id="below" data-reveal="">Further down</p>`
  placeBoxes({ above: { top: 100, height: 60 }, below: { top: 1600, height: 40 } })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.documentElement.removeAttribute('data-reveal-on')
})

describe('createMotion (ADR 0016)', () => {
  it('never hides what is on screen at load', () => {
    const motion = createMotion()
    expect(document.documentElement).toHaveAttribute('data-reveal-on')
    expect(document.getElementById('above')).toHaveAttribute('data-in')
    expect(document.getElementById('below')).not.toHaveAttribute('data-in')
    expect(observed).toHaveLength(8) // four elements, entry and reset observers
    motion.destroy()
  })

  it('staggers the branches of a [data-stagger] group', () => {
    const motion = createMotion()
    expect(document.getElementById('first')?.style.getPropertyValue('--delay')).toBe('0ms')
    expect(document.getElementById('third')?.style.getPropertyValue('--delay')).toBe('90ms')
    expect(document.getElementById('above')?.style.getPropertyValue('--delay')).toBe('')
    motion.destroy()
  })

  it('stays off under reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: true,
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    )
    const motion = createMotion()
    expect(document.documentElement).not.toHaveAttribute('data-reveal-on')
    expect(observed).toHaveLength(0)
    motion.destroy()
  })

  it('cleans up on destroy', () => {
    createMotion().destroy()
    expect(document.documentElement).not.toHaveAttribute('data-reveal-on')
    expect(document.getElementById('above')).not.toHaveAttribute('data-in')
  })
})
