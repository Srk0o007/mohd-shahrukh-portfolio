import { describe, expect, it } from 'vitest'
import { JS_FLAG_SCRIPT } from './js-flag'

describe('JS_FLAG_SCRIPT (ADR 0014)', () => {
  it('sets the data-js flag on <html>', () => {
    const attributes: Record<string, string> = {}
    const element = {
      setAttribute: (name: string, value: string) => {
        attributes[name] = value
      },
    }
    new Function('document', JS_FLAG_SCRIPT)({ documentElement: element })
    expect(attributes).toEqual({ 'data-js': '' })
  })

  it('no longer reads storage or the system colour scheme (dark only)', () => {
    expect(JS_FLAG_SCRIPT).not.toMatch(/localStorage|matchMedia|data-theme/)
  })
})
