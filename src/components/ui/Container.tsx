import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface ContainerProps {
  as?: ElementType
  className?: string
  children: ReactNode
}

/**
 * Grid margins and max width (DESIGN_SYSTEM §3): 20 / 32 / 40 / 64 px outer margins;
 * capped at 1440 px (1312 px content) from the xl breakpoint.
 */
export function Container({ as: Tag = 'div', className, children }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-360 px-5 md:px-8 lg:px-10 xl:px-16', className)}>
      {children}
    </Tag>
  )
}
