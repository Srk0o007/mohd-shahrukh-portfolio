import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface ContainerProps {
  as?: ElementType
  className?: string
  children: ReactNode
}

/**
 * Content width inside the 1240 px column (DESIGN_SYSTEM §3, Phase 11.5): 1180 px of content
 * with 20 px gutters (or the device safe-area inset, whichever is larger).
 */
export function Container({ as: Tag = 'div', className, children }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-305 pr-(--gutter-r) pl-(--gutter)', className)}>
      {children}
    </Tag>
  )
}
