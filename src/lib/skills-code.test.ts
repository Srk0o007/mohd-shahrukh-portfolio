import { describe, expect, it } from 'vitest'
import { skillCodeLines, skillFileName, skillVariableName, splitInTwo } from './skills-code'

const text = (line: { text: string }[]) => line.map((token) => token.text).join('')

describe('skillVariableName / skillFileName', () => {
  it('turns group labels into camelCase identifiers', () => {
    expect(skillVariableName('Frontend')).toBe('frontend')
    expect(skillVariableName('State & APIs')).toBe('stateApis')
    expect(skillVariableName('Performance & Accessibility')).toBe('performanceAccessibility')
    expect(skillVariableName('AI-Assisted Development')).toBe('aiAssistedDevelopment')
    expect(skillVariableName('Cloud & Delivery')).toBe('cloudDelivery')
  })

  it('appends .ts for the editor file chip', () => {
    expect(skillFileName('Frontend Security')).toBe('frontendSecurity.ts')
  })
})

describe('skillCodeLines', () => {
  it('renders a group as an `as const` array, one skill per line', () => {
    const lines = skillCodeLines({ label: 'State & APIs', skills: ['Redux Toolkit', 'REST APIs'] })
    expect(lines.map(text)).toEqual([
      'export const stateApis = [',
      "  'Redux Toolkit',",
      "  'REST APIs',",
      '] as const',
    ])
  })

  it('puts the context line first as a comment', () => {
    const lines = skillCodeLines({ label: 'Testing', skills: ['Jest'], context: 'unit testing' })
    expect(text(lines[0] ?? [])).toBe('// unit testing')
    expect(lines[0]?.[0]?.kind).toBe('comment')
    expect(lines).toHaveLength(4)
  })
})

describe('splitInTwo', () => {
  it('gives the first half the extra item', () => {
    expect(splitInTwo([1, 2, 3, 4, 5])).toEqual([
      [1, 2, 3],
      [4, 5],
    ])
    expect(splitInTwo([])).toEqual([[], []])
  })
})
