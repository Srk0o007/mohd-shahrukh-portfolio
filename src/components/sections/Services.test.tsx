import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { services } from '@/content'
import { Services } from './Services'

describe('02 — Services (FR-SRV-01, D20)', () => {
  it('is a labelled region with the numbered eyebrow', () => {
    render(<Services />)
    expect(
      screen.getByRole('region', { name: 'How I Can Help Your Next Project' }),
    ).toHaveAttribute('id', 'services')
    expect(screen.getByText('02 — Services')).toBeInTheDocument()
  })

  it('lists the four services in order with h3 titles', () => {
    render(<Services />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Web Design',
      'Frontend Engineering',
      'Accessibility & Compliance',
      'Testing & QA',
    ])
  })

  it('shows every description word for word', () => {
    render(<Services />)
    for (const service of services)
      expect(screen.getByText(service.description)).toBeInTheDocument()
  })

  it('renders one decorative icon per service (including the flask → flask-conical mapping)', () => {
    const { container } = render(<Services />)
    const icons = container.querySelectorAll('svg')
    expect(icons).toHaveLength(4)
    for (const icon of icons) expect(icon).toHaveAttribute('aria-hidden', 'true')
  })
})
