import { IconBase, type IconProps } from './IconBase'

/** Lucide "circle-check" (ISC), copied verbatim from lucide-static 1.67.0 — see LICENSES.md. */
export function CircleCheckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m16 9-5.5 5.5L8 12" />
    </IconBase>
  )
}
