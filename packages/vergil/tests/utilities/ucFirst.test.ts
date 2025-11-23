import { test, expect } from 'vitest'
import { ucFirst } from "#utilities"

test('Uppercase first letter', () => {
	expect(ucFirst('vergil')).toBe('Vergil')
	expect(ucFirst('álgebra')).toBe('Álgebra')
	expect(ucFirst('8ctavio')).toBe('8ctavio')
	expect(ucFirst('')).toBe('')
})