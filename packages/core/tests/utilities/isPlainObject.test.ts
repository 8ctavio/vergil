import { test, expect } from 'vitest'
import { isPlainObject } from '../../utilities'

test('Assert argument is a plain object', () => {
	expect(isPlainObject({})).toBe(true)
	expect(isPlainObject(Object.create(null))).toBe(true)

	expect(isPlainObject(Object.create({}))).toBe(false)
	expect(isPlainObject([])).toBe(false)
	expect(isPlainObject(new Set())).toBe(false)
	expect(isPlainObject(new Map())).toBe(false)
	expect(isPlainObject({ [Symbol.toStringTag]: 'type' })).toBe(false)
	expect(isPlainObject(Math)).toBe(false)

	expect(isPlainObject(null)).toBe(false)
	expect(isPlainObject(undefined)).toBe(false)
	expect(isPlainObject(() => {})).toBe(false)
	expect(isPlainObject('')).toBe(false)
	expect(isPlainObject(0)).toBe(false)
	expect(isPlainObject(true)).toBe(false)
	expect(isPlainObject(Symbol())).toBe(false)
})