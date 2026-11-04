import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

/**
 * jsdom has no matchMedia. This stub reports "light" and "no reduced motion" by default;
 * tests that need system changes replace it (see ThemeToggle.test.tsx).
 */
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

/**
 * next/image needs Next's image loader. In Vitest, static image imports resolve to
 * { src, width, height } (plugin in vitest.config.mts); render a plain <img> with the
 * accessibility-relevant props and, like Next, the intrinsic dimensions.
 */
type StaticImage = { src: string; width?: number; height?: number }
type MockImageProps = { src: string | StaticImage; alt: string; className?: string }
const srcOf = (src: MockImageProps['src']) => (typeof src === 'string' ? src : src.src)
const sizeOf = (src: MockImageProps['src']) =>
  typeof src === 'string' ? {} : { width: src.width, height: src.height }

vi.mock('next/image', () => ({
  default: (props: MockImageProps) =>
    createElement('img', { src: srcOf(props.src), alt: props.alt, className: props.className }),
  getImageProps: (props: MockImageProps & Record<string, unknown>) => ({
    props: { ...props, ...sizeOf(props.src), src: srcOf(props.src) },
  }),
}))
