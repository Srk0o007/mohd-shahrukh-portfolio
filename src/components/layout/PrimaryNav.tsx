import { cn } from '@/lib/cn'

export interface PrimaryNavProps {
  label: string
  items: readonly { label: string; href: string }[]
  className?: string
}

/**
 * Inline primary navigation (FR-NAV-01). Visible from 1080 px; below that the MobileMenu
 * replaces it, except without JavaScript, where `nojs-flex` keeps it visible as a wrapped
 * list so navigation never becomes unreachable (NFR-BRW-03).
 * Links are grey; hover and the current section (aria-current, FR-NAV-04) turn white with a
 * 2 px gradient underline that grows from the left (`.nav-link` in globals.css).
 */
export function PrimaryNav({ label, items, className }: PrimaryNavProps) {
  return (
    <nav aria-label={label} className={cn('nojs-flex hidden nav:flex', className)}>
      <ul className="flex flex-wrap items-center gap-x-[clamp(10px,1.6vw,22px)]">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="nav-link inline-flex min-h-11 items-center text-ui text-sub no-underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
