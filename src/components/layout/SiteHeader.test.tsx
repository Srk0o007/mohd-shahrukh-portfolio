import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader (FR-NAV-01, D15)', () => {
  it('links the wordmark to the top of the home page', () => {
    render(<SiteHeader />)
    expect(screen.getByRole('link', { name: 'Mohd Shahrukh' })).toHaveAttribute('href', '/#top')
  })

  it('renders the seven approved nav items as home-page anchors', () => {
    render(<SiteHeader />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((l) => [l.textContent, l.getAttribute('href')])).toEqual([
      ['About', '/#about'],
      ['Services', '/#services'],
      ['Experience', '/#experience'],
      ['Skills', '/#skills'],
      ['Projects', '/#projects'],
      ['Testimonials', '/#testimonials'],
      ['Contact', '/#contact'],
    ])
    expect(nav).toHaveClass('nojs-flex')
  })

  it('offers the CV download with format and size in its accessible name', () => {
    render(<SiteHeader />)
    const cv = screen.getByRole('link', { name: 'Download CV (PDF, 72 KB)' })
    expect(cv).toHaveAttribute('href', '/Mohd_Shahrukh_Resume_03_Nov_2026.pdf')
    expect(cv).toHaveAttribute('download')
  })

  it('has the mobile menu toggle and the theme toggle (Phase 09)', () => {
    render(<SiteHeader />)
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
    // jsdom applies no CSS, so both CSS-selected labels are present here; E2E checks each theme.
    const toggle = screen.getByRole('button', { name: /Switch to dark theme/ })
    expect(toggle).toHaveClass('js-only')
  })
})

describe('SiteFooter (FR-FTR-01, FR-SOC-01)', () => {
  it('shows the copyright with the current year and the credit', () => {
    render(<SiteFooter />)
    const year = new Date().getFullYear()
    expect(
      screen.getByText(`Copyright © ${year} Mohd Shahrukh. All Rights Reserved.`),
    ).toBeInTheDocument()
    expect(screen.getByText('Designed by Mohd Shahrukh')).toBeInTheDocument()
  })

  it('uses text-labelled social links in the approved order', () => {
    render(<SiteFooter />)
    const links = screen.getAllByRole('link')
    expect(links.map((l) => l.textContent?.replace(' (opens in new tab)', '').trim())).toEqual([
      'GitHub',
      'LinkedIn',
      'Email',
    ])
    expect(screen.getByRole('link', { name: 'GitHub (opens in new tab)' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:khan.shahrukh156@gmail.com',
    )
  })
})
