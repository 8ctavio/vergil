import { test, expect } from 'vitest'
import { ref, shallowRef, isProxy } from 'vue'
import { useResetValue } from '#composables'
import { noop } from '#utilities'

const resetValues = [8, 'vergil', true, null, noop, {}, []]

test("Reset to static reference", () => {
	for (const reference of resetValues) {
		const getResetValue = useResetValue(reference, false)
		for (let i=0; i<3; i++) {
			expect(getResetValue()).toBe(reference)
		}
	}
})

test("Reset to dynamic reference", () => {
	const reference = shallowRef()
	const getResetValue = useResetValue(reference)
	for (const value of resetValues) {
		reference.value = value
		for (let i=0; i<3; i++) {
			expect(getResetValue()).toBe(reference.value)
		}
	}
})

test("Clone reference object", () => {
	const resetValues = [
		{ foo: 0, bar: 1 } as Record<string, number>,
		['foo', 'bar'],
	]
	for (const resetValue of resetValues) {
		for (const transform of [(v: any) => v, shallowRef, ref]) {
			const reference = structuredClone(resetValue)
			const getResetValue = useResetValue(transform(reference), true)
		
			if (Array.isArray(reference)) {
				reference.push('baz')
			} else {
				reference.baz = 2
			}
		
			const reset1 = getResetValue()
			expect(reset1).toEqual(resetValue)
			expect(reset1).not.toEqual(reference)
			expect(reset1).not.toBe(reference)
			expect(reset1).not.toSatisfy(isProxy)
			
			const reset2 = getResetValue()
			expect(reset2).toEqual(resetValue)
			expect(reset2).not.toEqual(reference)
			expect(reset2).not.toBe(reference)
			expect(reset2).not.toBe(reset1)
			expect(reset2).not.toSatisfy(isProxy)
		}
	}
})