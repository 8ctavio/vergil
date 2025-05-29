import { test, expect } from 'vitest'
import { spaceEvenly } from "../../utilities"

test('Space evenly', () => {
	expect(spaceEvenly('  Guilty    Spark     ')).toBe('Guilty Spark')
})

test('Custom separator', () => {
	expect(spaceEvenly(' 123   456  789  ', '-')).toBe('123-456-789')
	
	expect(spaceEvenly('1\t2  3\t4', (match, offset) => {
		if (match.length > 1) {
			return '.'
		} else if (offset % 2 === 0) {
			return '_'
		} else {
			return '-'
		}
	})).toBe('1-2.3_4')
})