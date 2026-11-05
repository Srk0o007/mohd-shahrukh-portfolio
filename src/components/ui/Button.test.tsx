import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { ButtonLink } from './ButtonLink'

describe('Button', () => {
  it('renders a real button that does not submit forms by default', () => {
    render(<Button>Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'button')
  })

  it('allows an explicit submit type', () => {
    render(<Button type="submit">Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit')
  })

  it('is keyboard-activatable and calls onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Try again</Button>)
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Try again' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies the variant classes (Phase 11.5: cyan primary, gradient-rim ghost)', () => {
    render(
      <>
        <Button>Primary</Button>
        <Button variant="ghost">Ghost</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Primary' }).className).toContain('btn-primary')
    expect(screen.getByRole('button', { name: 'Ghost' }).className).toContain('btn-ghost')
  })

  it('keeps a transparent border for forced-colours mode (NFR-BRW-04)', () => {
    render(<Button>Primary</Button>)
    expect(screen.getByRole('button', { name: 'Primary' }).className).toContain(
      'border-transparent',
    )
  })

  it('meets the 44 px minimum target size class (md) and 52 px (lg)', () => {
    render(
      <>
        <Button>Medium</Button>
        <Button size="lg">Large</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Medium' }).className).toContain('min-h-11')
    expect(screen.getByRole('button', { name: 'Large' }).className).toContain('min-h-13')
  })
})

describe('ButtonLink', () => {
  it('renders a link styled as a button', () => {
    render(<ButtonLink href="/cv.pdf">Download CV</ButtonLink>)
    const link = screen.getByRole('link', { name: 'Download CV' })
    expect(link).toHaveAttribute('href', '/cv.pdf')
    expect(link.className).toContain('rounded-pill')
  })
})
