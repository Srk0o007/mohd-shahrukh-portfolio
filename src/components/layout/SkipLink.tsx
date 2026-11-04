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
      className="fixed top-4 left-4 z-100 inline-flex min-h-11 -translate-y-24 items-center rounded-[10px] border border-transparent bg-accent px-4 font-bold text-on-accent focus-visible:translate-y-0"
    >
      {label}
    </a>
  )
}
