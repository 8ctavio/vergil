import { test, expect } from 'vitest'
import { everyKeyInObject } from '../../utilities'

const obj = Object.freeze({
	foo: 0,
	bar: 0,
	baz: 0,
})

test('Object has all and only the required keys', () => {
	expect(everyKeyInObject(obj, ['foo', 'bar', 'baz'])).toBe(true)
	expect(everyKeyInObject(obj, ['foo'])).toBe(false)
	expect(everyKeyInObject(obj, ['qux'])).toBe(false)
})

test('Object has at least all the required keys', () => {
	expect(everyKeyInObject(obj, ['foo'], false)).toBe(true)
	expect(everyKeyInObject(obj, ['foo', 'qux'], false)).toBe(false)
})

test('Object has all required keys and a subset of optional keys', () => {
	expect(everyKeyInObject(obj, {
		required: ['foo', 'bar'],
		optional: ['baz', 'qux']
	})).toBe(true)

	expect(everyKeyInObject(obj, {
		required: ['foo', 'bar', 'qux'],
		optional: ['baz']
	})).toBe(false)

	// Fails because `baz` is not defined as optional
	expect(everyKeyInObject(obj, {
		required: ['foo', 'bar'],
		optional: ['qux']
	})).toBe(false)

	expect(everyKeyInObject(obj, {
		optional: ['foo', 'bar', 'baz', 'qux']
	})).toBe(true)
})

test('Optional keys are ignored if `strict` is set to `false`', () => {
	// When strict === false any non-required key is considered optional
	// regardless of the `optional` array's content
	expect(everyKeyInObject(obj, {
		required: ['foo'],
		optional: ['qux']
	}, false)).toBe(true)
})