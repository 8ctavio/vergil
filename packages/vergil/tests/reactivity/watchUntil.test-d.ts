import { test, expectTypeOf } from 'vitest'
import { watchUntil } from '#reactivity'
import { noop } from '#utilities'

test("Callback argument types match source types", () => {
	watchUntil(() => 0, (v,u) => {
		expectTypeOf(v).toEqualTypeOf<number>()
		expectTypeOf(u).toEqualTypeOf<number | undefined>()
	})

	watchUntil((): string | number | boolean => 0, (v,u) => {
		expectTypeOf(v).toEqualTypeOf<string | number | boolean>()
		expectTypeOf(u).toEqualTypeOf<string | number | boolean | undefined>()
	})

	watchUntil(() => [''], (v,u) => {
		expectTypeOf(v).toEqualTypeOf<string[]>()
		expectTypeOf(u).toEqualTypeOf<string[] | undefined>()
	})

	watchUntil([() => 0, () => '', () => false], (v,u) => {
		expectTypeOf(v).toEqualTypeOf<[number, string, boolean]>()
		expectTypeOf(u).toEqualTypeOf<[number | undefined, string | undefined, boolean | undefined]>()
	})

	watchUntil([() => 0, () => '', () => false] as const, (v,u) => {
		expectTypeOf(v).toEqualTypeOf<[number, string, boolean]>()
		expectTypeOf(u).toEqualTypeOf<[number | undefined, string | undefined, boolean | undefined]>()
	})
})

test("Infer returned Promise's resolve value", () => {
	expectTypeOf(watchUntil(() => 0, noop)).toEqualTypeOf<Promise<number>>()
	expectTypeOf(
		watchUntil((): number | string | boolean => 0, noop)
	).toEqualTypeOf<
		Promise<number | string | boolean>
	>()
	expectTypeOf(
		watchUntil([() => 0, () => '', () => false], noop)
	).toEqualTypeOf<
		Promise<[number, string, boolean]>
	>()
})

test("Constrain callback's return value", () => {
	type WatchUntilCallbackReturnType<F = boolean> = ReturnType<Parameters<
		typeof watchUntil<() => unknown, { fulfill: F; }>
	>[1]>

	expectTypeOf<WatchUntilCallbackReturnType>().toEqualTypeOf<boolean | void>()
	expectTypeOf<WatchUntilCallbackReturnType<string | number>>().toEqualTypeOf<string | number | void>()
	expectTypeOf<WatchUntilCallbackReturnType<string[]>>().toEqualTypeOf<string[] | void>()
})