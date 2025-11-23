import { test, expect } from 'vitest'
import { isObject } from '#utilities'

test('Assert argument is an object', () => {
	expect(isObject({})).toBe(true)
	expect(isObject(Object.create({}))).toBe(true)
	expect(isObject(Object.create(null))).toBe(true)
	expect(isObject([])).toBe(true)
	expect(isObject(Math)).toBe(true)

	expect(isObject(null)).toBe(false)
	expect(isObject(undefined)).toBe(false)
	expect(isObject(() => {})).toBe(false)
	expect(isObject('')).toBe(false)
	expect(isObject(0)).toBe(false)
	expect(isObject(true)).toBe(false)
	expect(isObject(Symbol())).toBe(false)
})