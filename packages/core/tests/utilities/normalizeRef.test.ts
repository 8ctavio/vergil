import { test, expect, vi } from 'vitest'
import { ref, shallowRef, customRef, toRef, isRef, isShallow } from 'vue'
import { normalizeRef, noop } from '#utilities'

test('Refs are directly returned', () => {
	const refs = [
		ref(0),
		shallowRef(),
		customRef(() => ({ get: noop, set: noop })),
		toRef(undefined)
	]

	for (const r of refs) {
		expect(normalizeRef(r)).toBe(r)
	}
})

test('Getter functions are turned into refs', () => {
	const getters = [
		vi.fn(() => 'vergil'),
		vi.fn(() => 8),
		vi.fn(() => true),
		vi.fn(() => null)
	]

	for (const getter of getters) {
		const r = normalizeRef(getter)
		expect(r).toSatisfy(isRef)
		expect(getter).not.toHaveBeenCalled()
		const v = r.value
		expect(getter).toHaveBeenCalledOnce()
		expect(v).toBe(getter())
	}
})

test('Refs are created for non-ref and non-getter values', () => {
	const values = ['', 0, false, null, undefined]
	for (const value of values) {
		const r = normalizeRef(value)
		expect(r).toSatisfy(isRef)
		expect(r).not.toSatisfy(isShallow)
		expect(r.value).toBe(value)
	}
})

test('Shallow refs are created for non-ref and non-getter values', () => {
	const values = [{}, [], '', 0, false, null, undefined]
	for (const value of values) {
		const r = normalizeRef(value, true)
		expect(r).toSatisfy(isRef)
		expect(r).toSatisfy(isShallow)
		expect(r.value).toBe(value)
	}
})

test('Return ref if no arguments are provided', () => {
	const r = normalizeRef()
	expect(r).toSatisfy(isRef)
	expect(r).not.toSatisfy(isShallow)
	expect(r.value).toBe(undefined)
})