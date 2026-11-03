import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArrowRightIcon } from './ArrowRightIcon'

describe('icons (NFR-A11Y-07)', () => {
  it('is decorative by default', () => {
    const { container } = render(<ArrowRightIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
  })

  it('is announced when given a title', () => {
    render(<ArrowRightIcon title="Next" />)
    expect(screen.getByRole('img', { name: 'Next' })).toBeInTheDocument()
  })
})
