import { cn } from '@/lib/cn'

export interface PrimaryNavProps {
  label: string
  items: readonly { label: string; href: string }[]
  className?: string
}

/**
 * Inline primary navigation (FR-NAV-01). Visible from 1280 px; below that the MobileMenu
 * replaces it — except without JavaScript, where `nojs-flex` keeps it visible as a wrapped
 * list so navigation never becomes unreachable (NFR-BRW-03).
 */
export function PrimaryNav({ label, items, className }: PrimaryNavProps) {
  return (
    <nav aria-label={label} className={cn('nojs-flex hidden xl:flex', className)}>
      <ul className="flex flex-wrap items-center gap-x-7 gap-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              // Hover: 1 px underline; current section (aria-current, FR-NAV-04): 2 px (spec §3).
              className="inline-flex min-h-11 items-center text-ui font-medium decoration-1 underline-offset-[6px] hover:underline aria-current:underline aria-current:decoration-2"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
