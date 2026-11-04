/**
 * Site-level anchor for header, menu and footer links: "#about" → "/#about".
 * On the home page this scrolls in place; on any other page (e.g. the 404) it takes the
 * visitor to the section on the home page instead of a missing local anchor.
 */
export function siteAnchor(href: `#${string}`): `/#${string}` {
  return `/${href}`
}

/** The section id an anchor points at: "/#about" or "#about" → "about". */
export function anchorId(href: string): string | null {
  const index = href.indexOf('#')
  if (index === -1 || index === href.length - 1) return null
  return href.slice(index + 1)
}
