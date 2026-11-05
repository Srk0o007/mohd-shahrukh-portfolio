import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SkillTabs } from './SkillTabs'

const tabs = [
  { label: 'Frontend', count: 2, fileName: 'frontend.ts' },
  { label: 'Testing', count: 1, fileName: 'testing.ts' },
  { label: 'Design', count: 1, fileName: 'design.ts' },
]

function renderTabs() {
  return render(
    <SkillTabs
      label="Skill groups"
      tabs={tabs}
      meta="4 skills · 3 groups"
      panels={tabs.map((tab) => (
        <p key={tab.label}>{`${tab.label} panel`}</p>
      ))}
    />,
  )
}

const tab = (name: RegExp) => screen.getByRole('tab', { name })

describe('SkillTabs (Phase 11.5, ARIA tabs)', () => {
  it('wires each tab to its panel and selects the first', () => {
    renderTabs()
    expect(screen.getByRole('tablist', { name: 'Skill groups' })).toHaveAttribute(
      'aria-orientation',
      'vertical',
    )
    const first = tab(/Frontend/)
    expect(first).toHaveAttribute('aria-selected', 'true')
    expect(first).toHaveAttribute('tabindex', '0')
    expect(tab(/Testing/)).toHaveAttribute('tabindex', '-1')
    const panel = screen.getByRole('tabpanel', { name: /Frontend/ })
    expect(first).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveTextContent('Frontend panel')
    expect(screen.getByText('frontend.ts')).toBeInTheDocument()
  })

  it('switches panel and file name on click', async () => {
    renderTabs()
    await userEvent.click(tab(/Testing/))
    expect(tab(/Testing/)).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: /Testing/ })).toBeVisible()
    expect(screen.getByText('Frontend panel').closest('[role="tabpanel"]')).not.toBeVisible()
    expect(screen.getByText('testing.ts')).toBeInTheDocument()
  })

  it('moves with arrow keys (wrapping), Home and End, focusing the new tab', async () => {
    renderTabs()
    await userEvent.tab()
    expect(tab(/Frontend/)).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(tab(/Testing/)).toHaveFocus()
    expect(tab(/Testing/)).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    expect(tab(/Frontend/)).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    expect(tab(/Design/)).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(tab(/Frontend/)).toHaveFocus()
    await userEvent.keyboard('{End}')
    expect(tab(/Design/)).toHaveAttribute('aria-selected', 'true')
  })

  it('hides the tab list without JavaScript and collapses the other panels from first paint', () => {
    renderTabs()
    expect(screen.getByRole('tablist')).toHaveClass('js-only')
    const collapsed = document.querySelectorAll('[role="tabpanel"].js-collapsed')
    expect(collapsed).toHaveLength(2)
  })
})
