import { IconBase, type IconProps } from './IconBase'

/** Lucide "monitor" (ISC), copied verbatim from lucide-static 1.67.0 — see LICENSES.md. */
export function MonitorIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </IconBase>
  )
}
