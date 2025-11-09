import { test, expectTypeOf } from 'vitest'
import { waitFor } from '#reactivity'
import { noop } from '#utilities'

namespace Conditions {
	export type Base = "toFulfill"
	export type Initial = "toChange"
	export type Monosource = "toBe" | "toBeIn" | "toBeTruthy" | "toBeNaN" | "toContain"
	export type Multisource = "toBeEqual"
}

const monosourceMethods = waitFor(noop)
const multisourceMethods = waitFor([])
type MonosourceMethods = typeof monosourceMethods
type MultisourceMethods = typeof multisourceMethods

test("Available methods", () => {
	expectTypeOf<keyof MonosourceMethods>().toEqualTypeOf<Conditions.Base | Conditions.Initial | Conditions.Monosource | 'not'>()
	expectTypeOf<MonosourceMethods>().toExtend<{
		[method in Conditions.Base | Conditions.Initial | Conditions.Monosource]: Function
	}>()

	expectTypeOf<keyof MonosourceMethods["not"]>().toEqualTypeOf<Conditions.Base | Conditions.Monosource>()
	expectTypeOf<MonosourceMethods["not"]>().toExtend<{
		[method in Conditions.Base | Conditions.Monosource]: Function
	}>()

	expectTypeOf<keyof MultisourceMethods>().toEqualTypeOf<Conditions.Base | Conditions.Initial | Conditions.Multisource | 'not'>()
	expectTypeOf<MultisourceMethods>().toExtend<{
		[method in Conditions.Base | Conditions.Initial | Conditions.Multisource]: Function
	}>()

	expectTypeOf<keyof MultisourceMethods["not"]>().toEqualTypeOf<Conditions.Base | Conditions.Multisource>()
	expectTypeOf<MultisourceMethods["not"]>().toExtend<{
		[method in Conditions.Base | Conditions.Multisource]: Function
	}>()
})

test("toFulfill's argument types match waitFor's source types", () => {
	waitFor(() => 0).toFulfill((v,u) => {
		expectTypeOf(v).toEqualTypeOf<number>()
		expectTypeOf(u).toEqualTypeOf<number | undefined>()
	})

	waitFor((): string | number | boolean => 0).toFulfill((v,u) => {
		expectTypeOf(v).toEqualTypeOf<string | number | boolean>()
		expectTypeOf(u).toEqualTypeOf<string | number | boolean | undefined>()
	})

	waitFor(() => ['']).toFulfill((v,u) => {
		expectTypeOf(v).toEqualTypeOf<string[]>()
		expectTypeOf(u).toEqualTypeOf<string[] | undefined>()
	})

	waitFor([() => 0, () => '', () => false]).toFulfill((v,u) => {
		expectTypeOf(v).toEqualTypeOf<[number, string, boolean]>()
		expectTypeOf(u).toEqualTypeOf<[number | undefined, string | undefined, boolean | undefined]>()
	})

	waitFor([() => 0, () => '', () => false] as const).toFulfill((v,u) => {
		expectTypeOf(v).toEqualTypeOf<[number, string, boolean]>()
		expectTypeOf(u).toEqualTypeOf<[number | undefined, string | undefined, boolean | undefined]>()
	})
})

test("Methods return a Promise", () => {
	expectTypeOf<
		{
			[method in keyof Omit<MonosourceMethods, 'not'>]: ReturnType<MonosourceMethods[method]>
		}[keyof Omit<MonosourceMethods, 'not'>]
	>().toExtend<Promise<unknown>>()

	expectTypeOf<
		{
			[method in keyof Omit<MultisourceMethods, 'not'>]: ReturnType<MultisourceMethods[method]>
		}[keyof Omit<MultisourceMethods, 'not'>]
	>().toExtend<Promise<unknown>>()
})