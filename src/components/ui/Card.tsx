import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  /** Lift, brighter border and full sheen on hover (default true). */
  hover?: boolean
  /** Fade in on scroll (motion module; default true). */
  reveal?: boolean
  children: ReactNode
}

/**
 * Card (COMPONENT_VISUAL_SPEC §9, Phase 11.5): flat #050505, a 1 px white 7 % border, 18 px
 * radius, and a glass sheen on the border only (`.card::after` in globals.css). Hover lifts
 * 4 px with a soft shadow; every transition uses the soft ease.
 */
export function Card({
  as: Tag = 'div',
  hover = true,
  reveal = true,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      data-reveal={reveal ? '' : undefined}
      className={cn('card', hover && 'card-hover', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
