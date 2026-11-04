import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { HighlightsDisclosure } from './HighlightsDisclosure'

const eleven = Array.from({ length: 11 }, (_, i) => `Highlight ${i + 1}`)
const labels = { more: 'Show all 11 highlights', less: 'Show fewer highlights' }

describe('HighlightsDisclosure (FR-RES-02, DS-13)', () => {
  it('server render: every highlight is in the HTML; extras collapse via CSS only when JS runs', () => {
    const html = renderToString(<HighlightsDisclosure highlights={eleven} labels={labels} />)
    for (const text of eleven) expect(html).toContain(text)
    // No `hidden` attribute: without JS (no html[data-js]) all items stay visible.
    expect(html).not.toContain('hidden=""')
    // Items 5–11 carry the pre-paint collapse class (Phase 11: no shift on hydration).
    expect(html.match(/class="js-collapsed"/g)).toHaveLength(7)
    // The button is server-rendered but js-only, so it reserves its space from the first paint.
    expect(html).toMatch(/<button[^>]*class="js-only/)
  })

  it('after hydration: shows the first four and an accessible disclosure button', () => {
    render(<HighlightsDisclosure highlights={eleven} labels={labels} />)
    const items = screen.getAllByRole('listitem', { hidden: true })
    expect(items).toHaveLength(11)
    expect(items.filter((item) => !item.hidden)).toHaveLength(4)
    const button = screen.getByRole('button', { name: 'Show all 11 highlights' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', screen.getByRole('list').id)
  })

  it('expands and collapses, keeping focus on the button', async () => {
    render(<HighlightsDisclosure highlights={eleven} labels={labels} />)
    const button = screen.getByRole('button', { name: 'Show all 11 highlights' })
    await userEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAccessibleName('Show fewer highlights')
    expect(screen.getAllByRole('listitem')).toHaveLength(11)
    expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('does not add a button when there are four or fewer highlights', () => {
    render(<HighlightsDisclosure highlights={['One', 'Two', 'Three', 'Four']} labels={labels} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })
})
