import { test, expect, vi } from "vitest"
import { ref, shallowRef, readonly, toValue } from "vue"
import { entangled } from "#reactivity"
import { markDescriptor } from "#functions"
import { noop } from "#utilities"

test("Define/Extend regular properties", () => {
	const properties = [{
		foo: 0,
		bar: {}
	},{
		baz: () => {},
		qux: null,
	}] as const

	const _entangled = entangled(properties[0])
	_entangled.extend(properties[1])

	for (const props of properties) {
		for (const [key, value] of Object.entries(props)) {
			expect(_entangled).toHaveProperty(key, value)
		}
	}
})

test("Define symbol-keyed properties", () => {
	const foo = Symbol()
	const bar = Symbol()
	const properties = {
		[foo]: 0,
		[bar]: {}
	}
	const _entangled = entangled(properties)
	for (const sym of Object.getOwnPropertySymbols(properties)) {
		expect(_entangled).toSatisfy(v => 
			Object.hasOwn(v, sym)
			&& v[sym] === properties[sym as keyof typeof properties]
		)
	}
})

test("Defined properties are writable, enumerable, and configurable by default", () => {
	const properties = {
		foo: 0,
		bar: {},
		baz: () => {},
		qux: null
	}
	const _entangled = entangled(properties)

	for (const [key, value] of Object.entries(properties)) {
		expect(_entangled).toHaveProperty(key)
		expect(Object.getOwnPropertyDescriptor(_entangled, key)).toEqual({
			value,
			writable: true,
			enumerable: true,
			configurable: true
		})
	}
})

test("Define properties with custom descriptors", () => {
	const _entangled = entangled({
		foo: markDescriptor({
			value: 0,
			writable: false,
			enumerable: false,
			configurable: false
		}),
		bar: markDescriptor({
			enumerable: false
		}),
		baz: markDescriptor({
			get: noop,
			set: noop,
			configurable: false
		})
	})

	expect(Object.getOwnPropertyDescriptor(_entangled, 'foo')).toEqual({
		value: 0,
		writable: false,
		enumerable: false,
		configurable: false
	})
	expect(Object.getOwnPropertyDescriptor(_entangled, 'bar')).toEqual({
		value: undefined,
		writable: true,
		enumerable: false,
		configurable: true
	})
	expect(Object.getOwnPropertyDescriptor(_entangled, 'baz')).toEqual({
		get: noop,
		set: noop,
		enumerable: true,
		configurable: false
	})
})

test("Custom default values for property descriptors", () => {
	expect(Object.getOwnPropertyDescriptor(
		entangled({ foo: 0 }, { defaults: false }),
		'foo'
	)).toEqual({
		value: 0,
		writable: false,
		enumerable: false,
		configurable: false
	})

	expect(Object.getOwnPropertyDescriptor(
		entangled({ foo: 0 }, { configurable: false }),
		'foo'
	)).toEqual({
		value: 0,
		writable: true,
		enumerable: true,
		configurable: false
	})

	expect(Object.getOwnPropertyDescriptor(
		entangled({ foo: 0 }, { defaults: false, enumerable: true }),
		'foo'
	)).toEqual({
		value: 0,
		writable: false,
		enumerable: true,
		configurable: false
	})
})

test("Ignore properties to define", () => {
	const baz = Symbol()
	const _entangled = entangled({
		foo: 1,
		bar: 2,
		[baz]: 3
	},{
		ignore: ['bar', baz]
	})

	expect(_entangled).toHaveProperty('foo')
	expect(_entangled).not.toHaveProperty('bar')
	expect(_entangled).not.toSatisfy(e => Object.hasOwn(e, baz))
})

test("Define auto-unwrapped ref properties", () => {
	const properties = {
		foo: ref(0),
		bar: shallowRef([])
	}
	const _entangled = entangled(properties)
	for (const [key, value] of Object.entries(properties)) {
		expect(_entangled).toHaveProperty(
			key, 
			// @ts-expect-error
			toValue(value)
		)
	}
})

test("Define ref properties without auto-unwrapping", () => {
	const foo = ref()
	expect(entangled({
		foo: markDescriptor({
			value: foo,
			unwrap: false
		})
	})).toHaveProperty('foo', foo)
})

test("Define ref property with custom accessors", () => {
	const customGetter = vi.fn()
	const customSetter = vi.fn()
	const _entangled = entangled({
		foo: markDescriptor({
			value: ref(0),
			get: customGetter,
			set: customSetter,
		})
	})

	expect(_entangled).toHaveProperty('foo')

	customGetter.mockClear()
	customSetter.mockClear()
	_entangled.foo = _entangled.foo // oxlint-disable-line no-self-assign
	expect(customGetter).toHaveBeenCalledOnce()
	expect(customSetter).toHaveBeenCalledOnce()
})

test("Retrieve ref object of auto-unwrapped ref properties", () => {
	const foo = ref()
	const bar = shallowRef()
	const _entangled = entangled({
		foo,
		bar,
		baz: 8
	})

	expect(_entangled.getRef('foo')).toBe(foo)
	expect(_entangled.getRef('bar')).toBe(bar)
	expect(_entangled.getRef('baz')).toBe(undefined)
})

test("Provide custom `getRef` return value", () => {
	const foo = ref('foo')
	const fooProxy = readonly(foo)
	const bar = shallowRef('bar')

	const _entangled = entangled({
		foo: markDescriptor({
			value: foo,
			get(shouldUnwrap: boolean) {
				if (shouldUnwrap) {
					return foo.value
				} else {
					return fooProxy
				}
			}
		}),
		bar: markDescriptor({
			value: bar,
			get(shouldUnwrap: boolean) {
				if (shouldUnwrap) {
					return bar.value
				}
			}
		})
	})

	expect(_entangled).toHaveProperty('foo', 'foo')
	expect(_entangled.getRef('foo')).toBe(fooProxy)

	expect(_entangled).toHaveProperty('bar', 'bar')
	expect(_entangled.getRef('bar')).toBeUndefined()
})