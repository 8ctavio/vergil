import { test, expect } from 'vitest'
import { deburr } from "#utilities"

test('Remove diacritics', () => {
	expect(deburr('áéíóúñÁÉÍÓÚÑ')).toBe('aeiounAEIOUN')
	expect(deburr('`´¨^')).toBe('')
})

test('Leave non-diacritical characters', () => {
	const abc = 'abcdefghijklmnopqrstuvwxyz'
	const str = abc + ' ' + abc.toUpperCase() + ` 0123456789 .:,;(){}[]<>?!¿¡=+*-_~#$%&/\\|°"'`
	expect(deburr(str)).toBe(str)
})