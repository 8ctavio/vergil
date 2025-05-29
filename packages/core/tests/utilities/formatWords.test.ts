import { test, expect } from 'vitest'
import { formatWords } from "../../utilities"

const words = ['abc1', 'Uvw2', 'XYZ3']
const str = words.join(' ')
function formatter(word: string, idx: number) {
	return word === words[idx] ? '#' : ''
}

test('All words extracted and passed to formatter', () => {
	expect(formatWords(str, formatter)).toBe('# # #')
})

test('Ignore non-alphanumeric characters', () => {
	expect(formatWords(`  ${str}  `, formatter)).toBe('# # #')
	expect(formatWords(`__${str}__`, formatter)).toBe('# # #')
})

test('Custom separator', () => {
	expect(formatWords(`  ${str}  `, formatter, '-')).toBe('#-#-#')
})