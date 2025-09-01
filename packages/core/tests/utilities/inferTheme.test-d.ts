import { test, expectTypeOf } from 'vitest'
import { inferTheme } from '#utilities'
import type { Theme, ThemeAlias } from '#types'

test("Infer returned theme name", () => {
	expectTypeOf(inferTheme<ThemeAlias>('neutral')).toEqualTypeOf<Theme>()
})

test("Infer 'neutral' if no valid theme name or alias is provided", () => {
	expectTypeOf(inferTheme('invalid alias')).toEqualTypeOf<'neutral'>()
})