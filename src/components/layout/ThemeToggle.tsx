'use client'

import { useEffect } from 'react'
import { MoonIcon, SunIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { applyTheme, currentTheme, readStoredTheme, storeTheme, type Theme } from '@/lib/theme'

export interface ThemeToggleProps {
  labels: { toDark: string; toLight: string }
  className?: string
}

/** A choice made this visit; covers browsers where storage is blocked (FR-THM-02). */
let sessionChoice: Theme | null = null

function safeStorage(): Storage | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

/**
 * Theme toggle (FR-THM-01–04, COMPONENT_VISUAL_SPEC §5, ADR 0005).
 * The pre-paint script has already set `data-theme`, so the icon **and the accessible name**
 * are chosen by CSS from that attribute: correct before hydration, with no server/client
 * mismatch. Clicking applies and stores the other theme; until a choice exists, live system
 * changes are followed. Hidden without JS (the system preference applies via CSS).
 */
export function ThemeToggle({ labels, className }: ThemeToggleProps) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const followSystem = (dark: boolean) => {
      if (sessionChoice || readStoredTheme(safeStorage())) return
      applyTheme(document.documentElement, dark ? 'dark' : 'light')
    }
    // Catch a system change between first paint and hydration, before the listener existed.
    followSystem(media.matches)
    const onSystemChange = (event: MediaQueryListEvent) => followSystem(event.matches)
    media.addEventListener('change', onSystemChange)
    return () => media.removeEventListener('change', onSystemChange)
  }, [])

  const toggle = () => {
    const next: Theme = currentTheme(document.documentElement) === 'dark' ? 'light' : 'dark'
    sessionChoice = next
    applyTheme(document.documentElement, next)
    storeTheme(safeStorage(), next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'js-only inline-flex size-11 shrink-0 items-center justify-center rounded-pill border border-border text-text transition-colors duration-150 ease-standard hover:bg-surface-2',
        className,
      )}
    >
      {/* Light theme: moon + "Switch to dark theme". Dark theme: sun + "Switch to light theme". */}
      <MoonIcon size={20} className="dark:hidden" />
      <SunIcon size={20} className="hidden dark:block" />
      <span className="sr-only dark:hidden">{labels.toDark}</span>
      <span className="sr-only hidden dark:inline">{labels.toLight}</span>
    </button>
  )
}
