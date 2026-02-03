import { test, expectTypeOf } from "vitest"
import { isFunction } from "#utilities"

test("Extract function-compatible types", () => {
	type Functions =
		| (() => void)
		| ((v: number) => number[])
		| ((...args: string[]) => Promise<unknown>)
		| ((...args: any[]) => any)
	
	void function(value: Functions | string | number[] | { foo: boolean }) {
		if (isFunction(value)) {
			expectTypeOf(value).toEqualTypeOf<Functions>()
		}
	}
})

test("Convert unknown to Function", () => {
	void function(value: unknown) {
		if (isFunction(value)) {
			expectTypeOf(value).toEqualTypeOf<Function>()
		}
	}
})