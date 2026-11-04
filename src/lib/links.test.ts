import { describe, expect, it } from 'vitest'
import { anchorId, siteAnchor } from './links'

describe('siteAnchor', () => {
  it('prefixes in-page anchors with the home path', () => {
    expect(siteAnchor('#about')).toBe('/#about')
    expect(siteAnchor('#top')).toBe('/#top')
  })
})

describe('anchorId', () => {
  it.each([
    ['/#about', 'about'],
    ['#skills', 'skills'],
    ['/', null],
    ['#', null],
  ])('%s → %s', (href, expected) => {
    expect(anchorId(href)).toBe(expected)
  })
})
