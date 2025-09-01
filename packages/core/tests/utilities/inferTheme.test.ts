import { test, expect } from 'vitest'
import { inferTheme, themes } from '#utilities'
import type { Theme } from '#types'

test("Infer theme from name or alias", () => {
	for (const theme of Object.keys(themes)) {
		expect(inferTheme(theme)).toBe(theme)

		themes[theme as Theme]?.forEach((alias: string) => {
			expect(inferTheme(alias)).toBe(theme)
		})
	}
})

test("Default to 'neutral' if no valid theme name or alias is provided", () => {
	expect(inferTheme('invalid alias')).toBe('neutral')
})