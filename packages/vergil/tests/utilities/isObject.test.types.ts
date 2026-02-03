import { test, expectTypeOf } from "vitest"
import { isObject } from "#utilities"

test("Extract object-compatible types", () => {
	type Objects = { foo: string } | { bar: number[] } | boolean[] | Set<unknown> | Error | Response

	void function(value: Objects | string | number | (() => void)) {
		if (isObject(value)) {
			expectTypeOf(value).toEqualTypeOf<Objects>()
		}
	}
})

test("Convert unknown/any to Record<PropertyKey, unknown>", () => {
	void function(foo: unknown, bar: any) {
		if (isObject(foo)) {
			expectTypeOf(foo).toEqualTypeOf<Record<PropertyKey, unknown>>()
		}
		if (isObject(bar)) {
			expectTypeOf(bar).toEqualTypeOf<Record<PropertyKey, unknown>>()
		}
	}
})