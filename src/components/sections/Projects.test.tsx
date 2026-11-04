import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { projects } from '@/content'
import { Projects } from './Projects'

const cards = () => screen.getAllByRole('article')

describe('07 — Projects (FR-PRJ-01–07)', () => {
  it('is a labelled region with the numbered eyebrow', () => {
    render(<Projects />)
    expect(screen.getByRole('region', { name: 'Some Of My Most Recent Projects' })).toHaveAttribute(
      'id',
      'projects',
    )
    expect(screen.getByText('07 — Projects')).toBeInTheDocument()
  })

  it('AC-PRJ-1 renders all ten projects in content order with h3 titles and subtitles', () => {
    render(<Projects />)
    expect(cards()).toHaveLength(10)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      projects.map((p) => p.title),
    )
    for (const project of projects) {
      const card = screen.getByRole('article', { name: project.title })
      expect(within(card).getByText(project.subtitle)).toBeInTheDocument()
      expect(within(card).getByRole('img')).toHaveAttribute('alt', project.image.alt)
    }
  })

  it('numbers cards 01–10 and tags them by group (DS-09)', () => {
    render(<Projects />)
    expect(cards().map((c) => c.querySelector('.tabular-nums')?.textContent)).toEqual(
      projects.map((_, i) => String(i + 1).padStart(2, '0')),
    )
    expect(screen.getAllByText('Enterprise product')).toHaveLength(3)
    expect(screen.getAllByText('Website')).toHaveLength(7)
  })

  it('links only the live project, opening in a new tab with a descriptive name (FR-PRJ-03)', () => {
    render(<Projects />)
    expect(screen.getAllByRole('link')).toHaveLength(1)
    const link = screen.getByRole('link', {
      name: 'Visit SOSUDATECH Pvt. Ltd. website (opens in new tab)',
    })
    expect(link).toHaveAttribute('href', 'https://www.sosudatech.com/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows the internal note on projects 1–3 only, nothing extra on pending projects (FR-PRJ-04/05)', () => {
    render(<Projects />)
    expect(screen.getAllByText('Internal product — no public link')).toHaveLength(3)
    const sosudatech = screen.getByRole('article', { name: 'SOSUDATECH Pvt. Ltd.' })
    expect(
      within(sosudatech).getByText(
        'Nov 2020 · HTML5, CSS3, JavaScript, jQuery, Bootstrap 4.5, Photoshop',
      ),
    ).toBeInTheDocument()
    for (const name of ['Job Listing Website', 'Virtual University', 'Frontier Mining Solutions']) {
      const card = screen.getByRole('article', { name })
      expect(within(card).queryByRole('link')).toBeNull()
      expect(card.querySelectorAll('p')).toHaveLength(1) // subtitle only
    }
  })

  it('lazy-loads every project image with explicit dimensions (FR-PRJ-06)', () => {
    render(<Projects />)
    for (const img of within(screen.getByRole('region', { name: /Recent Projects/ })).getAllByRole(
      'img',
    )) {
      expect(img).toHaveAttribute('loading', 'lazy')
      expect(img).toHaveAttribute('width')
      expect(img).toHaveAttribute('height')
    }
  })
})

describe('project filter (FR-PRJ-02)', () => {
  it('AC-PRJ-2 defaults to All and switches state with aria-pressed and a polite status', async () => {
    const user = userEvent.setup()
    const { container } = render(<Projects />)
    const gallery = container.querySelector('ul[data-filter]')
    const all = screen.getByRole('button', { name: 'All' })
    const enterprise = screen.getByRole('button', { name: 'Enterprise products' })
    const websites = screen.getByRole('button', { name: 'Websites' })
    const status = container.querySelector('[aria-live="polite"]')

    expect(gallery).toHaveAttribute('data-filter', 'all')
    expect(all).toHaveAttribute('aria-pressed', 'true')
    expect(status).toHaveTextContent('Showing 10 of 10 projects')

    await user.click(enterprise)
    expect(gallery).toHaveAttribute('data-filter', 'enterprise')
    expect(enterprise).toHaveAttribute('aria-pressed', 'true')
    expect(all).toHaveAttribute('aria-pressed', 'false')
    expect(status).toHaveTextContent('Showing 3 of 10 projects')
    expect(enterprise).toHaveFocus()

    await user.click(websites)
    expect(gallery).toHaveAttribute('data-filter', 'website')
    expect(status).toHaveTextContent('Showing 7 of 10 projects')
  })

  it('is keyboard operable and keeps focus on the chosen control', async () => {
    const user = userEvent.setup()
    const { container } = render(<Projects />)
    screen.getByRole('button', { name: 'All' }).focus()
    await user.tab()
    await user.keyboard('{Enter}')
    const enterprise = screen.getByRole('button', { name: 'Enterprise products' })
    expect(enterprise).toHaveFocus()
    expect(enterprise).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('ul[data-filter]')).toHaveAttribute('data-filter', 'enterprise')
  })

  it('hides cards per state through classes keyed to data-filter, never in the "All" state', () => {
    const { container } = render(<Projects />)
    const items = [...container.querySelectorAll('ul[data-filter] > li')]
    expect(items).toHaveLength(10)
    for (const item of items) {
      const group = item.getAttribute('data-group')
      expect(item.className).not.toContain('group-data-[filter=all]/gallery:hidden')
      expect(item.className.includes('group-data-[filter=enterprise]/gallery:hidden')).toBe(
        group === 'website',
      )
      expect(item.className.includes('group-data-[filter=website]/gallery:hidden')).toBe(
        group === 'enterprise',
      )
    }
  })

  it('server HTML has every card in the "All" state and js-only filter chips (no-JS fallback)', () => {
    const html = renderToString(<Projects />)
    expect(html).toContain('data-filter="all"')
    expect(html.match(/<article/g)).toHaveLength(10)
    expect(html).toMatch(/class="js-only[^"]*"/)
  })
})
