import { test, expect } from 'vitest'
import { isFunction } from '#utilities'

test('Assert argument is an object', () => {
	expect(isFunction(() => {})).toBe(true)
	expect(isFunction(function () {})).toBe(true)

	expect(isFunction({})).toBe(false)
	expect(isFunction([])).toBe(false)
	expect(isFunction(null)).toBe(false)
	expect(isFunction(undefined)).toBe(false)
	expect(isFunction('')).toBe(false)
	expect(isFunction(0)).toBe(false)
	expect(isFunction(true)).toBe(false)
	expect(isFunction(Symbol())).toBe(false)
})