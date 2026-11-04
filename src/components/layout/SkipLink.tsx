export interface SkipLinkProps {
  label: string
  /** Target landmark; <main id="main" tabIndex={-1}> (FR-NAV-03). */
  href?: `#${string}`
}

/** First focusable element; visible only on focus (COMPONENT_VISUAL_SPEC §1). */
export function SkipLink({ label, href = '#main' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="fixed top-4 left-4 z-60 inline-flex min-h-11 -translate-y-24 items-center rounded-pill border border-transparent bg-primary px-5 text-ui font-semibold text-on-primary focus-visible:translate-y-0"
    >
      {label}
    </a>
  )
}
