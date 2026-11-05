/**
 * Skills "editor" helpers (COMPONENT_VISUAL_SPEC §13, Phase 11.5). Each skill group is shown
 * as a TypeScript constant, e.g. `export const stateApis = ['Redux Toolkit', …] as const`.
 * Pure functions: the server renders the code; the client island only switches tabs.
 */

/** "State & APIs" → "stateApis"; "AI-Assisted Development" → "aiAssistedDevelopment". */
export function skillVariableName(label: string): string {
  const words = label
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
  return words
    .map((word, index) => {
      const lower = word.toLowerCase()
      return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join('')
}

/** "State & APIs" → "stateApis.ts" (the editor's file chip). */
export function skillFileName(label: string): string {
  return `${skillVariableName(label)}.ts`
}

/** One token of a code line, coloured by kind. */
export type CodeToken =
  | { kind: 'keyword' | 'name' | 'string' | 'punct' | 'comment'; text: string }
  | { kind: 'space'; text: string }

/** The lines of a group's constant: an optional `// context` comment, then the array. */
export function skillCodeLines(group: {
  label: string
  skills: readonly string[]
  context?: string
}): CodeToken[][] {
  const lines: CodeToken[][] = []
  if (group.context) lines.push([{ kind: 'comment', text: `// ${group.context}` }])
  lines.push([
    { kind: 'keyword', text: 'export const' },
    { kind: 'space', text: ' ' },
    { kind: 'name', text: skillVariableName(group.label) },
    { kind: 'space', text: ' ' },
    { kind: 'punct', text: '=' },
    { kind: 'space', text: ' ' },
    { kind: 'punct', text: '[' },
  ])
  for (const skill of group.skills) {
    lines.push([
      { kind: 'space', text: '  ' },
      { kind: 'string', text: `'${skill}'` },
      { kind: 'punct', text: ',' },
    ])
  }
  lines.push([
    { kind: 'punct', text: ']' },
    { kind: 'space', text: ' ' },
    { kind: 'keyword', text: 'as const' },
  ])
  return lines
}

/** Splits a list into two halves for the two ticker rows (the first row gets the extra item). */
export function splitInTwo<T>(items: readonly T[]): [T[], T[]] {
  const half = Math.ceil(items.length / 2)
  return [items.slice(0, half), items.slice(half)]
}
