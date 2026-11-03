import type { ReactNode } from 'react'

/** Text available to assistive technology but not shown visually. */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>
}
