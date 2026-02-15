import { test, expect, vi } from "vitest"
import { isRef, isShallow, ref, shallowRef, customRef, toRef, toValue, toRaw } from "vue"
import { extendedRef, defineEntangledProperties } from "#reactivity"
import { markDescriptor } from "#utilities"
import { noop } from "#utilities"

const values = [0, '', false, null, undefined, {}, []]

test("Create internal ref when `value` argument is missing", () => {
	const extended = extendedRef()
	expect(extended).toHaveProperty('ref')
	expect(extended.ref).toSatisfy(isRef)
	expect(extended.ref).not.toSatisfy(isShallow)
	expect(extended.ref.value).toBeUndefined()
})

test("Create internal ref from non-ref, non-getter value", () => {
	for (const value of values) {
		const extended = extendedRef(value)
		expect(extended.ref).toSatisfy(isRef)
		expect(extended.ref).not.toSatisfy(isShallow)
		expect(toRaw(extended.ref.value)).toBe(value)
	}
})

test("Create internal shallowRef from non-ref, non-getter value", () => {
	for (const value of values) {
		const extended = extendedRef(value, null, { shallow: true })
		expect(extended.ref).toSatisfy(isRef)
		expect(extended.ref).toSatisfy(isShallow)
		expect(extended.ref.value).toBe(value)
	}
})

test("Create internal ref from getter function", () => {
	const getter = vi.fn()
	const extended = extendedRef(getter)
	expect(extended.ref).toSatisfy(isRef)
	expect(extended.ref).not.toSatisfy(isShallow)
	expect(getter).not.toHaveBeenCalled()
	toValue(extended.ref)
	expect(getter).toHaveBeenCalledOnce()
})

test("Use provided ref as internal ref", () => {
	const refs = [
		ref(),
		shallowRef(),
		customRef(() => ({ get: noop, set: noop })),
		toRef(undefined),
		toRef(noop)
	]
	for (const r of refs) {
		const extended = extendedRef(r)
		expect(extended.ref).toSatisfy(isRef)
		expect(extended.ref).toBe(r)
	}
})

test("Unwrap internal ref with .value notation", () => {
	for (const value of values) {
		const extended = extendedRef(value)
		expect(extended.value).toBe(extended.ref.value)
	}
})

test("Define custom ref accessors", () => {
	const customGetter = vi.fn()
	const customSetter = vi.fn()
	const extended = extendedRef(undefined, null, {
		get: customGetter,
		set: customSetter
	})

	customGetter.mockClear()
	customSetter.mockClear()
	extended.value = extended.value // oxlint-disable-line no-self-assign
	expect(customGetter).toHaveBeenCalledOnce()
	expect(customSetter).toHaveBeenCalledOnce()
})

test("Extend with additional properties", () => {
	const extended = extendedRef(undefined, {
		foo: true,
		bar: markDescriptor({
			get: () => true
		})
	})
	
	expect(extended).toHaveProperty('foo')
	expect(extended).toHaveProperty('bar')
	expect(extended).not.toHaveProperty('baz')

	const r = shallowRef(true)
	defineEntangledProperties(extended, { baz: r })

	expect(extended).toHaveProperty('foo')
	expect(extended).toHaveProperty('bar')
	expect(extended).toHaveProperty('baz')

	expect(extended.foo).toBe(true)
	expect(extended.bar).toBe(true)
	// @ts-expect-error
	expect(extended.baz).toBe(true)
	expect(extended.getRef('baz')).toBe(r)
})

test("Return already created extendedRef", () => {
	const extended = extendedRef()
	expect(extendedRef(extended)).toBe(extended)
})