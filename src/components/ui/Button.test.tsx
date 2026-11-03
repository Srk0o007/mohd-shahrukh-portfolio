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

  it('applies the token-based variant classes', () => {
    render(
      <>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Primary' }).className).toContain('bg-primary')
    expect(screen.getByRole('button', { name: 'Secondary' }).className).toContain('border-border')
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
