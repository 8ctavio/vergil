import { test, expectTypeOf } from "vitest"
import { isValidTheme } from "#utilities"
import type { ThemeAlias } from "#types"

test("Infer true return value for valid theme name or alias", () => {
	expectTypeOf(isValidTheme<ThemeAlias>('neutral')).toEqualTypeOf<true>()
})

test("Infer false return value for invalid theme name or alias", () => {
	expectTypeOf(isValidTheme('invalid alias')).toEqualTypeOf<false>()
})