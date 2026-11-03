import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CvLink } from './CvLink'
import { MobileMenu, type MobileMenuProps } from './MobileMenu'
import { SocialLinks } from './SocialLinks'

const props: MobileMenuProps = {
  name: 'Mohd Shahrukh',
  items: [
    { label: 'About', href: '/#about' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Projects', href: '/#projects' },
  ],
  footer: (
    <div>
      <CvLink href="/cv.pdf" label="Download CV" accessibleSuffix="(PDF, 72 KB)" />
      <SocialLinks
        links={[
          { id: 'github', label: 'GitHub', href: 'https://github.com/Srk0o007' },
          { id: 'email', label: 'Email', href: 'mailto:someone@example.com' },
        ]}
        newTabLabel="(opens in new tab)"
      />
    </div>
  ),
  labels: { open: 'Open menu', close: 'Close menu', nav: 'Primary' },
}

/** Page content outside the menu, so inert / focus targets can be asserted. */
function renderWithPage() {
  const page = document.createElement('main')
  page.id = 'main'
  page.innerHTML =
    '<section id="about" tabindex="-1">About</section><section id="skills" tabindex="-1">Skills</section>'
  document.body.appendChild(page)
  const utils = render(<MobileMenu {...props} />)
  return { ...utils, page }
}

const openButton = () => screen.getByRole('button', { name: 'Open menu' })
const panelNav = () => screen.getByRole('navigation', { name: 'Primary' })

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  document.getElementById('main')?.remove()
  document.documentElement.style.overflow = ''
  window.history.replaceState(null, '', '/')
})

describe('MobileMenu (FR-NAV-02)', () => {
  it('starts closed with an accessible toggle and no dangling aria-controls', () => {
    renderWithPage()
    expect(openButton()).toHaveAttribute('aria-expanded', 'false')
    expect(openButton()).not.toHaveAttribute('aria-controls')
    expect(openButton()).toHaveClass('js-only')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('opens: focuses the first link, locks scroll, makes the page inert', async () => {
    const { page } = renderWithPage()
    await userEvent.click(openButton())
    expect(openButton()).toHaveAttribute('aria-expanded', 'true')
    expect(openButton().getAttribute('aria-controls')).toBeTruthy()
    expect(within(panelNav()).getByRole('link', { name: /About/ })).toHaveFocus()
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(page).toHaveAttribute('inert')
  })

  it('contains Tab focus within the menu in both directions', async () => {
    renderWithPage()
    await userEvent.click(openButton())
    const first = within(panelNav()).getByRole('link', { name: /About/ })
    const close = screen.getByRole('button', { name: 'Close menu' })
    const links = screen.getAllByRole('link')
    const last = links[links.length - 1]

    // Shift+Tab from the first focusable element (Close) wraps to the last.
    close.focus()
    await userEvent.tab({ shift: true })
    expect(last).toHaveFocus()
    // Tab from the last wraps to the first focusable element (Close).
    await userEvent.tab()
    expect(close).toHaveFocus()
    expect(first).toBeInTheDocument()
  })

  it('Escape closes, restores scroll and inertness, and returns focus to the toggle', async () => {
    const { page } = renderWithPage()
    await userEvent.click(openButton())
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(openButton()).toHaveFocus()
    expect(openButton()).toHaveAttribute('aria-expanded', 'false')
    expect(document.documentElement.style.overflow).toBe('')
    expect(page).not.toHaveAttribute('inert')
  })

  it('the close button closes and returns focus to the toggle', async () => {
    renderWithPage()
    await userEvent.click(openButton())
    await userEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(openButton()).toHaveFocus()
  })

  it('choosing a link closes the menu and moves focus to the target section', async () => {
    renderWithPage()
    await userEvent.click(openButton())
    await userEvent.click(within(panelNav()).getByRole('link', { name: /Skills/ }))
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(document.getElementById('skills')).toHaveFocus()
    expect(window.location.hash).toBe('#skills')
  })

  it('a link whose section is not on this page closes the menu and lets the browser navigate', async () => {
    renderWithPage()
    await userEvent.click(openButton())
    const link = within(panelNav()).getByRole('link', { name: /Projects/ })
    expect(link).toHaveAttribute('href', '/#projects')
    const notPrevented = fireEvent.click(link)
    expect(notPrevented).toBe(true)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('includes the CV download and text-labelled social links', async () => {
    renderWithPage()
    await userEvent.click(openButton())
    expect(screen.getByRole('link', { name: 'Download CV (PDF, 72 KB)' })).toHaveAttribute(
      'href',
      '/cv.pdf',
    )
    expect(screen.getByRole('link', { name: 'GitHub (opens in new tab)' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:someone@example.com',
    )
  })

  it('numbers menu items without adding the numbers to their accessible names', async () => {
    renderWithPage()
    await userEvent.click(openButton())
    expect(within(panelNav()).getByRole('link', { name: 'About' })).toHaveTextContent('01About')
  })
})
