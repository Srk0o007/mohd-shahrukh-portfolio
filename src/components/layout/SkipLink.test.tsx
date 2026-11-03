import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SkipLink } from './SkipLink'

describe('SkipLink (FR-NAV-03)', () => {
  it('is the first focusable element and targets #main', async () => {
    render(
      <>
        <SkipLink label="Skip to main content" />
        <a href="#elsewhere">Other link</a>
      </>,
    )
    await userEvent.tab()
    const link = screen.getByRole('link', { name: 'Skip to main content' })
    expect(link).toHaveFocus()
    expect(link).toHaveAttribute('href', '#main')
  })
})
