import { test, expect } from 'vitest'
import { words } from "../../utilities"

test('Extract words', () => {
	expect(words('A Day At The Beach')).toStrictEqual(["A", "Day", "At", "The", "Beach"])
	expect(words('  México Vergil  Vue ')).toStrictEqual(['México', 'Vergil', 'Vue'])
})

test('Return empty array if no words are matched', () => {
	expect(words('')).toStrictEqual([])
})