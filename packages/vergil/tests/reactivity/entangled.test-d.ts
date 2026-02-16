import { test, expectTypeOf } from 'vitest'
import { ref, shallowRef } from 'vue'
import { entangled, defineEntangledProperties } from '#reactivity'
import { markDescriptor } from '#utilities'
import type { Ref, ShallowRef } from 'vue'

test("Return object with defined properties", () => {
	const _entangled = entangled({
		foo: 0 as number | string | boolean,
		bar: [0]
	})
	expectTypeOf(_entangled).toExtend<{
		foo: number | string | boolean,
		bar: number[]
	}>()

	expectTypeOf(defineEntangledProperties(_entangled, {
		baz: [] as [number?, string?, boolean?],
		qux: (() => {}) as (p: string) => void
	})).toExtend<{
		foo: number | string | boolean
		bar: number[]
		baz: [number?, string?, boolean?]
		qux: (p: string) => void
	}>()

	const sym = Symbol()
	expectTypeOf(entangled({
		prop1: markDescriptor({
			value: true
		}),
		prop2: markDescriptor({
			get: (): number | string => 0
		}),
		prop3: ref(0),
		prop4: shallowRef(0),
		prop5: markDescriptor({
			value: shallowRef<string[]>()
		}),
		prop6: markDescriptor({
			value: ref<[number?, string?]>([]),
			unwrap: false as const
		}),
		prop7: markDescriptor({
			value: shallowRef<(number | string)[]>([]),
			unwrap: false as const
		}),
		[sym]: 0,
	})).toExtend<{
		prop1: boolean
		prop2: number | string
		prop3: number
		prop4: number
		prop5: string[] | undefined
		prop6: Ref<[number?, string?]>
		prop7: ShallowRef<(number | string)[]>
		[sym]: number
	}>()
})

test("Omit ignored properties", () => {
	expectTypeOf(entangled({
		foo: 0,
		bar: 0,
		baz: 0
	},{
		ignore: ['bar', 'baz']
	})).not.toExtend<{
		bar: any
		baz: any
	}>()
})

test("Return Ref type with `$ref`", () => {
	const _entangled = entangled({
		prop1: 0,
		prop2: ref(0),
		prop3: shallowRef(0),
		prop4: markDescriptor({
			value: ref([0]),
		}),
		prop5: markDescriptor({
			value: shallowRef([0]),
		})
	})

	// @ts-expect-error
	expectTypeOf(_entangled.$ref('prop1')).toBeUndefined()
	expectTypeOf(_entangled.$ref('prop2')).toEqualTypeOf<Ref<number>>()
	expectTypeOf(_entangled.$ref('prop3')).toEqualTypeOf<ShallowRef<number>>()
	expectTypeOf(_entangled.$ref('prop4')).toEqualTypeOf<Ref<number[]>>()
	expectTypeOf(_entangled.$ref('prop5')).toEqualTypeOf<ShallowRef<number[]>>()
})