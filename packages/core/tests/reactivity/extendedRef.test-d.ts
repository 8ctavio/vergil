import { test, expectTypeOf } from 'vitest'
import { ref, shallowRef, customRef, toRef } from 'vue'
import { extendedRef } from '#reactivity'
import { noop, getTrue } from '#utilities'
import type { Ref, ShallowRef, UnwrapRef } from 'vue'

const refA = ref(true)
const refB = shallowRef(true)
const refC = customRef(() => ({ get: getTrue, set: noop }))
const refD = toRef(getTrue)
const getter: (() => void | number | number[]) = noop

test("Infer type of internal ref", () => {
	expectTypeOf(extendedRef().ref).toEqualTypeOf<Ref<undefined>>()
	expectTypeOf(extendedRef(0).ref).toEqualTypeOf<Ref<number>>()
	expectTypeOf(extendedRef(0, null, { shallow: true }).ref).toEqualTypeOf<ShallowRef<number>>()

	expectTypeOf(extendedRef(refA).ref).toEqualTypeOf<typeof refA>()
	expectTypeOf(extendedRef(refB).ref).toEqualTypeOf<typeof refB>()
	expectTypeOf(extendedRef(refC).ref).toEqualTypeOf<typeof refC>()
	expectTypeOf(extendedRef(refD).ref).toEqualTypeOf<typeof refD>()

	expectTypeOf(extendedRef(getter).ref).toEqualTypeOf<
		Readonly<Ref<ReturnType<typeof getter>>>
	>()
})

test("Infer type of unwrapped internal ref", () => {
	expectTypeOf(extendedRef().value).toEqualTypeOf<undefined>()
	expectTypeOf(extendedRef(0).value).toEqualTypeOf<number>()
	expectTypeOf(extendedRef(0, null, { shallow: true }).value).toEqualTypeOf<number>()

	expectTypeOf(extendedRef(refA).value).toEqualTypeOf<UnwrapRef<typeof refA>>()
	expectTypeOf(extendedRef(refB).value).toEqualTypeOf<UnwrapRef<typeof refB>>()
	expectTypeOf(extendedRef(refC).value).toEqualTypeOf<UnwrapRef<typeof refC>>()
	expectTypeOf(extendedRef(refD).value).toEqualTypeOf<UnwrapRef<typeof refD>>()

	expectTypeOf(extendedRef(getter).value).toEqualTypeOf<ReturnType<typeof getter>>()
})

test("Include extension properties", () => {
	expectTypeOf(extendedRef(undefined, {
		foo: 0,
		bar: '',
		baz: false
	})).toExtend<{
		foo: number
		bar: string
		baz: boolean
	}>()
})
