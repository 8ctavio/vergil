import { test, expectTypeOf } from "vitest"
import { isPlainObject } from "#utilities"

test("Extract plain object-compatible types", () => {
	type PlainObjects = { foo: string } | { bar: number[] }

	void function(value: PlainObjects | string | number[] | Set<unknown> | Error | Response | (() => void)) {
		if (isPlainObject(value)) {
			expectTypeOf(value).toEqualTypeOf<PlainObjects>()
		}
	}
})

test("Convert unknown/any to Record<PropertyKey, unknown>", () => {
	void function(foo: unknown, bar: any) {
		if (isPlainObject(foo)) {
			expectTypeOf(foo).toEqualTypeOf<Record<PropertyKey, unknown>>()
		}
		if (isPlainObject(bar)) {
			expectTypeOf(bar).toEqualTypeOf<Record<PropertyKey, unknown>>()
		}
	}
})