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
    const target = document.getElementById(next.id)
    if (!target) return
    window.history.pushState(null, '', `#${next.id}`)
    target.scrollIntoView({ block: 'start' })
    target.focus({ preventScroll: true })
  }, [open])

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
        onClick={() => setOpen(true)}
        className="js-only inline-flex size-11 items-center justify-center rounded-pill border border-border text-text transition-colors duration-150 ease-standard hover:bg-surface-2 xl:hidden"
      >
        <MenuIcon size={20} />
      </button>

      {open
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              className="fixed inset-0 z-50 overflow-y-auto bg-bg text-text"
            >
              <div className="mx-auto flex min-h-full w-full max-w-360 flex-col px-5 pb-10 md:px-8 lg:px-10">
                <div className="flex h-16 items-center justify-between border-b border-rule md:h-18">
                  <span className="font-display text-wordmark font-semibold">{name}</span>
                  <button
                    type="button"
                    aria-label={labels.close}
                    onClick={() => close({ kind: 'restore' })}
                    className="inline-flex size-11 items-center justify-center rounded-pill border border-border transition-colors duration-150 ease-standard hover:bg-surface-2"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>

                <nav aria-label={labels.nav} className="mt-6">
                  <ul>
                    {items.map((item, index) => (
                      <li key={item.href} className="border-b border-rule">
                        <a
                          href={item.href}
                          onClick={(event) => onLinkClick(event, item.href)}
                          className="flex min-h-14 items-baseline gap-4 py-3"
                        >
                          <span
                            aria-hidden="true"
                            className="text-label font-medium text-text-muted tabular-nums"
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="font-display text-h2 font-medium">{item.label}</span>
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
