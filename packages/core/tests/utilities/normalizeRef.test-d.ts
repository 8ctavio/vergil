import { test, expectTypeOf } from 'vitest'
import { ref, shallowRef, customRef, toRef } from 'vue'
import { normalizeRef } from '#utilities'

import type { Ref, ShallowRef } from 'vue'

test('Type of refs is directly returned', () => {
	const a1 = ref()
	const a2 = ref(0)
	const a3 = ref(true)
	const a4 = ref<string>()

	expectTypeOf(normalizeRef(a1)).toEqualTypeOf<typeof a1>()
	expectTypeOf(normalizeRef(a2)).toEqualTypeOf<typeof a2>()
	expectTypeOf(normalizeRef(a3)).toEqualTypeOf<typeof a3>()
	expectTypeOf(normalizeRef(a4)).toEqualTypeOf<typeof a4>()

	const b1 = shallowRef()
	const b2 = shallowRef(0)
	const b3 = shallowRef(true)
	const b4 = shallowRef<string>()

	expectTypeOf(normalizeRef(b1)).toEqualTypeOf<typeof b1>()
	expectTypeOf(normalizeRef(b2)).toEqualTypeOf<typeof b2>()
	expectTypeOf(normalizeRef(b3)).toEqualTypeOf<typeof b3>()
	expectTypeOf(normalizeRef(b4)).toEqualTypeOf<typeof b4>()

	const c1 = customRef(() => ({
		get: () => 0,
		set: () => {}
	}))

	expectTypeOf(normalizeRef(c1)).toEqualTypeOf<typeof c1>()

	const d1 = toRef(() => {})
	const d2 = toRef(() => '')
	const d3 = toRef(() => null)
	const d4 = toRef(() => [])

	expectTypeOf(normalizeRef(d1)).toEqualTypeOf<typeof d1>()
	expectTypeOf(normalizeRef(d2)).toEqualTypeOf<typeof d2>()
	expectTypeOf(normalizeRef(d3)).toEqualTypeOf<typeof d3>()
	expectTypeOf(normalizeRef(d4)).toEqualTypeOf<typeof d4>()
})
	

test('Getter functions return a readonly ref', () => {
	function getter(): number | boolean | string[] {
		return true
	}

	expectTypeOf(normalizeRef(getter)).toEqualTypeOf<Readonly<Ref<ReturnType<typeof getter>>>>()
})

test('Return Ref for non-ref and non-getter arguments', () => {
	expectTypeOf(normalizeRef(0)).toEqualTypeOf<Ref<number>>()
	expectTypeOf(normalizeRef()).toEqualTypeOf<Ref<undefined>>()
	expectTypeOf(normalizeRef<string | number[]>()).toEqualTypeOf<Ref<string | number[] | undefined>>()
})

test('Return ShallowRef for non-ref and non-getter arguments', () => {
	expectTypeOf(normalizeRef(0, true)).toEqualTypeOf<ShallowRef<number>>()
	expectTypeOf(normalizeRef<boolean | number[] | undefined, true>(undefined, true)).toEqualTypeOf<ShallowRef<boolean | number[] | undefined>>()
})