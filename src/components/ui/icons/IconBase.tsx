import type { ReactNode, SVGProps } from 'react'

export type IconSize = 16 | 20 | 24

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: IconSize
  /** When provided the icon is announced; otherwise it is decorative (aria-hidden). */
  title?: string
}

/** 24 px grid, 1.6 stroke, round caps (DESIGN_SYSTEM §9). */
export function IconBase({
  size = 20,
  title,
  children,
  ...rest
}: IconProps & { children: ReactNode }) {
  const labelled = typeof title === 'string' && title.length > 0
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...(labelled ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
      {...rest}
    >
      {labelled ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}
