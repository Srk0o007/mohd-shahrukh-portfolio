import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AUTOPLAY_MS, TestimonialSlider } from './TestimonialSlider'

function renderSlider() {
  return render(
    <TestimonialSlider
      label="Testimonials"
      slides={[<p key="a">Quote A</p>, <p key="b">Quote B</p>, <p key="c">Quote C</p>]}
      slideLabels={['1 of 3', '2 of 3', '3 of 3']}
      dotLabels={['Show testimonial 1', 'Show testimonial 2', 'Show testimonial 3']}
      previousLabel="Previous testimonial"
      nextLabel="Next testimonial"
    />,
  )
}

/** Replaces the default "no match" matchMedia stub for one query. */
function mockReducedMotion(reduce: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: reduce && query.includes('prefers-reduced-motion'),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  )
}

/** Hidden slides have an empty accessible name, so find them by their label attribute. */
const slide = (label: string) => {
  const element = document.querySelector(`[aria-roledescription="slide"][aria-label="${label}"]`)
  if (!element) throw new Error(`No slide ${label}`)
  return element
}
const current = () =>
  screen
    .getAllByRole('button', { name: /Show testimonial/ })
    .find((b) => b.hasAttribute('aria-current'))

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('TestimonialSlider (ADR 0016)', () => {
  it('shows one slide; the others are hidden from assistive technology', () => {
    mockReducedMotion(true)
    renderSlider()
    expect(slide('1 of 3')).not.toHaveAttribute('aria-hidden')
    expect(slide('2 of 3')).toHaveAttribute('aria-hidden', 'true')
    expect(slide('3 of 3')).toHaveAttribute('data-inactive')
    expect(current()).toHaveAccessibleName('Show testimonial 1')
  })

  it('moves with next / previous (wrapping) and the dots', async () => {
    mockReducedMotion(true)
    renderSlider()
    await userEvent.click(screen.getByRole('button', { name: 'Next testimonial' }))
    expect(slide('2 of 3')).not.toHaveAttribute('aria-hidden')
    await userEvent.click(screen.getByRole('button', { name: 'Previous testimonial' }))
    await userEvent.click(screen.getByRole('button', { name: 'Previous testimonial' }))
    expect(slide('3 of 3')).not.toHaveAttribute('aria-hidden')
    await userEvent.click(screen.getByRole('button', { name: 'Show testimonial 1' }))
    expect(current()).toHaveAccessibleName('Show testimonial 1')
  })

  it('moves on a horizontal swipe of more than 50 px', () => {
    mockReducedMotion(true)
    const { container } = renderSlider()
    const track = container.querySelector('[aria-live]') as HTMLElement
    fireEvent.pointerDown(track, { clientX: 300 })
    fireEvent.pointerUp(track, { clientX: 200 })
    expect(slide('2 of 3')).not.toHaveAttribute('aria-hidden')
    fireEvent.pointerDown(track, { clientX: 200 })
    fireEvent.pointerUp(track, { clientX: 230 })
    expect(slide('2 of 3')).not.toHaveAttribute('aria-hidden')
  })

  it('autoplays every 7 s and keeps the live region quiet while it does', () => {
    vi.useFakeTimers()
    mockReducedMotion(false)
    const { container } = renderSlider()
    expect(container.querySelector('[aria-live]')).toHaveAttribute('aria-live', 'off')
    act(() => vi.advanceTimersByTime(AUTOPLAY_MS))
    expect(slide('2 of 3')).not.toHaveAttribute('aria-hidden')
  })

  it('pauses autoplay while hovered and announces politely', () => {
    vi.useFakeTimers()
    mockReducedMotion(false)
    const { container } = renderSlider()
    const carousel = screen.getByRole('region', { name: 'Testimonials' })
    fireEvent.mouseEnter(carousel)
    expect(container.querySelector('[aria-live]')).toHaveAttribute('aria-live', 'polite')
    act(() => vi.advanceTimersByTime(AUTOPLAY_MS * 2))
    expect(slide('1 of 3')).not.toHaveAttribute('aria-hidden')
  })

  it('never autoplays under reduced motion', () => {
    vi.useFakeTimers()
    mockReducedMotion(true)
    renderSlider()
    act(() => vi.advanceTimersByTime(AUTOPLAY_MS * 3))
    expect(slide('1 of 3')).not.toHaveAttribute('aria-hidden')
  })
})
