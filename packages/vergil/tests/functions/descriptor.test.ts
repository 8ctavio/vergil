import { test, expect, describe } from "vitest"
import { markDescriptor, isDescriptor, dataDescriptor } from "#functions"

describe('markDescriptor', () => {
	test('Mark object as descriptor', () => {
		const obj = {}
		expect(markDescriptor(obj)).toBe(obj)
		expect(Object.hasOwn(obj, '__descriptor')).toBe(true)
	})

	test("Descriptor's mark property is immutable", () => {
		expect(Object.getOwnPropertyDescriptor(markDescriptor({}), '__descriptor')).toStrictEqual({
			value: true,
			writable: false,
			enumerable: false,
			configurable: false
		})
	})

	test('Throw error if argument is not an object', () => {
		// @ts-expect-error
		expect(() => markDescriptor()).toThrowError(TypeError)
		// @ts-expect-error
		expect(() => markDescriptor(null)).toThrowError(TypeError)
		// @ts-expect-error
		expect(() => markDescriptor(0)).toThrowError(TypeError)
	})
})

describe('isDescriptor', () => {
	test('Assert argument is descriptor-marked object', () => {
		expect(isDescriptor(markDescriptor({}))).toBe(true)
		expect(isDescriptor({})).toBe(false)
		expect(isDescriptor(null)).toBe(false)
		expect(isDescriptor(0)).toBe(false)
		expect(isDescriptor(Object.create(markDescriptor({})))).toBe(false)
		expect(isDescriptor({ __descriptor: false })).toBe(false)
	})
})

describe('dataDescriptor', () => {
	test('Create data descriptor', () => {
		for (const v of [undefined, true, false]) {
			const desc = dataDescriptor(v,v,v,v)
			expect(isDescriptor(desc)).toBe(true)
			for (const key of ['value', 'writable', 'enumerable', 'configurable'] as const) {
				expect(Object.hasOwn(desc, key)).toBe(true)
				expect(desc[key]).toBe(v)
			}
		}
	})
})