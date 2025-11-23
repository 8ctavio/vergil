import { test, expect } from "vitest"
import { isValidTheme, themes } from "#utilities"
import type { Theme } from "#utilities"

test("Valid theme name or alias returns true", () => {
	for (const theme of Object.keys(themes)) {
		expect(isValidTheme(theme)).toBe(true)
		
		themes[theme as Theme]?.forEach((alias: string) => {
			expect(isValidTheme(alias)).toBe(true)
		})
	}
})

test("Invalid theme name or alias returns false", () => {
	expect(isValidTheme('invalid alias')).toBe(false)
})