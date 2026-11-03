import { IconBase, type IconProps } from './IconBase'

/** Lucide "arrow-right" (ISC) — see LICENSES.md. */
export function ArrowRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </IconBase>
  )
}
