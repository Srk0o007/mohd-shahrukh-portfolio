'use client'

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon, MenuIcon } from '@/components/ui/icons'
import { anchorId } from '@/lib/links'
import { goToSection } from '@/lib/section-nav'

export interface MobileMenuProps {
  name: string
  items: readonly { label: string; href: string }[]
  /** Server-rendered CV link + social links (keeps them out of the client bundle). */
  footer: ReactNode
  labels: { open: string; close: string; nav: string }
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

type AfterClose = { kind: 'restore' } | { kind: 'section'; id: string } | null

/**
 * Overlay navigation below 1280 px (FR-NAV-02, COMPONENT_ARCHITECTURE §3):
 * focus moves into the menu and stays contained; everything else is `inert`; page scroll is
 * locked; Esc / Close return focus to the menu button; choosing a link closes the menu and
 * moves focus to the target section. On pages without the target (e.g. the 404) links fall
 * back to normal navigation to the home page section.
 * Without JavaScript the button is hidden (`js-only`) and the inline nav stays visible.
 */
export function MobileMenu({ name, items, footer, labels }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  /** Section being read when the menu opened (set by ActiveSectionObserver, FR-NAV-04). */
  const [currentId, setCurrentId] = useState('')
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const afterClose = useRef<AfterClose>(null)

  const close = useCallback((next: AfterClose) => {
    afterClose.current = next
    setOpen(false)
  }, [])

  // While open: lock scroll, make the rest of the page inert, focus the first link.
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    const madeInert: Element[] = []
    for (const element of Array.from(document.body.children)) {
      if (element === panel || element.hasAttribute('inert')) continue
      element.setAttribute('inert', '')
      madeInert.push(element)
    }

    panel?.querySelector<HTMLElement>('nav a')?.focus()

    // Esc closes; Tab / Shift+Tab wrap within the menu (focus containment).
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close({ kind: 'restore' })
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      root.style.overflow = previousOverflow
      for (const element of madeInert) element.removeAttribute('inert')
    }
  }, [open, close])

  // After closing (the cleanup above has already restored the page): restore or move focus.
  useEffect(() => {
    if (open) return
    const next = afterClose.current
    afterClose.current = null
    if (!next) return
    if (next.kind === 'restore') {
      buttonRef.current?.focus()
      return
    }
    goToSection(next.id)
  }, [open])

  const openMenu = () => {
    setCurrentId(document.documentElement.dataset.section ?? '')
    setOpen(true)
  }

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const id = anchorId(href)
    // Target not on this page (e.g. 404): let the browser navigate to /#id.
    if (!id || !document.getElementById(id)) {
      close(null)
      return
    }
    event.preventDefault()
    close({ kind: 'section', id })
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={labels.open}
        aria-expanded={open}
        {...(open ? { 'aria-controls': panelId } : {})}
        onClick={openMenu}
        className="js-only border-border text-text ease-standard hover:bg-surface-2 xl:hidden inline-flex size-11 items-center justify-center rounded-pill border transition-colors duration-150"
      >
        <MenuIcon size={20} />
      </button>

      {open
        ? createPortal(
            // A modal dialog (Phase 10): focus is contained and the page behind is inert, so the
            // overlay is announced as a dialog, named by the wordmark it shows (no new copy).
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${panelId}-title`}
              className="text-text fixed inset-0 z-50 overflow-y-auto bg-bg"
            >
              <div className="mx-auto flex min-h-full w-full max-w-360 flex-col px-5 pb-10 md:px-8 lg:px-10">
                <div className="border-rule flex h-16 items-center justify-between border-b md:h-18">
                  <span
                    id={`${panelId}-title`}
                    className="font-display text-wordmark font-semibold"
                  >
                    {name}
                  </span>
                  <button
                    type="button"
                    aria-label={labels.close}
                    onClick={() => close({ kind: 'restore' })}
                    className="border-border ease-standard hover:bg-surface-2 inline-flex size-11 items-center justify-center rounded-pill border transition-colors duration-150"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>

                <nav aria-label={labels.nav} className="mt-6">
                  <ul>
                    {items.map((item, index) => (
                      <li key={item.href} className="border-rule border-b">
                        <a
                          href={item.href}
                          onClick={(event) => onLinkClick(event, item.href)}
                          {...(currentId !== '' && anchorId(item.href) === currentId
                            ? { 'aria-current': 'true' as const }
                            : {})}
                          className="group/item flex min-h-14 items-baseline gap-4 py-3"
                        >
                          <span
                            aria-hidden="true"
                            className="text-text-muted text-label font-medium tabular-nums"
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          {/* Current section (FR-NAV-04): 2 px underline on the label only. */}
                          <span className="font-display text-h2 font-medium decoration-2 underline-offset-8 group-aria-current/item:underline">
                            {item.label}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-10">{footer}</div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
