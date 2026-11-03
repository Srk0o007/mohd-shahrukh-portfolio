import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ExternalLink } from './ExternalLink'

describe('ExternalLink (NFR-SEC-04, NFR-A11Y-12)', () => {
  it('always opens in a new tab with noopener noreferrer', () => {
    render(
      <ExternalLink href="https://www.sosudatech.com/" newTabLabel="(opens in new tab)">
        Visit SOSUDATECH Pvt. Ltd. website
      </ExternalLink>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAttribute('href', 'https://www.sosudatech.com/')
  })

  it('announces that it opens in a new tab and hides the icon', () => {
    const { container } = render(
      <ExternalLink href="https://github.com/Srk0o007" newTabLabel="(opens in new tab)">
        GitHub profile
      </ExternalLink>,
    )
    expect(
      screen.getByRole('link', { name: 'GitHub profile (opens in new tab)' }),
    ).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
