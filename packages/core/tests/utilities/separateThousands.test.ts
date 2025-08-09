import { test, expect } from 'vitest'
import { separateThousands } from "#utilities"

test('Separate thousands', () => {
	expect(separateThousands('123456789')).toBe('123,456,789')
	expect(separateThousands('123456789.123456789')).toBe('123,456,789.123456789')
	expect(separateThousands('1234')).toBe('1,234')
	expect(separateThousands('117')).toBe('117')
	expect(separateThousands('')).toBe('')
})

test('Coerce to string', () => {
	expect(separateThousands(123_456_789)).toBe('123,456,789')
})

test('Custom separator', () => {
	expect(separateThousands('123456789', '.')).toBe('123.456.789')
})