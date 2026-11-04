import { getImageProps, type StaticImageData } from 'next/image'
import { preload } from 'react-dom'

export interface ResponsiveImageProps {
  src: StaticImageData
  alt: string
  /** Layout-specific `sizes` (COMPONENT_ARCHITECTURE §6). */
  sizes: string
  /** LCP image: fetched eagerly with high priority (ADR 0010; `priority` is deprecated in Next 16). */
  priority?: boolean
  className?: string
}

/**
 * Optimised image without client JavaScript (ADR 0010 addendum, NFR-PERF-05).
 * `getImageProps()` produces the same optimised `src`/`srcSet`/`sizes` as <Image>, but renders a
 * plain server-side <img>, so the next/image client component is not shipped to the browser.
 * For the LCP image, a responsive `<link rel="preload">` is also hoisted into <head> (React 19
 * `preload`), so the browser requests it before fonts and scripts (Phase 11, PERFORMANCE_REPORT).
 */
export function ResponsiveImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: ResponsiveImageProps) {
  const { props } = getImageProps({
    src,
    alt,
    sizes,
    ...(priority ? { fetchPriority: 'high', loading: 'eager' } : { loading: 'lazy' }),
  })
  if (priority && props.src) {
    preload(props.src, {
      as: 'image',
      fetchPriority: 'high',
      ...(props.srcSet ? { imageSrcSet: props.srcSet } : {}),
      ...(props.sizes ? { imageSizes: props.sizes } : {}),
    })
  }
  // eslint-disable-next-line @next/next/no-img-element -- getImageProps supplies the optimised srcSet; avoids next/image client JS
  return <img {...props} alt={alt} className={className} />
}
