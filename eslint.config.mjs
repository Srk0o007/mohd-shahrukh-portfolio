import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // jsx-a11y is registered by eslint-config-next; enable its full recommended rule set as errors.
    files: ['**/*.{jsx,tsx}'],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
  {
    files: ['**/*.{ts,tsx,mts}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
    // Local design handoff: git-excluded reference material, never committed.
    '.handoff/**',
  ]),
])

export default eslintConfig
